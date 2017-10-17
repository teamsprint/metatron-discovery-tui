#!/usr/bin/env python
#encoding:utf8

import json
import sys
import os

import dateutil.parser

line_script_file = None
args = None

reg = []
reg_cnt = 0

def reg_append(type, name, uuid, createdTime):
    global reg_cnt

    for d in reg:
        if d['uuid'] == uuid:
            return

    offset = reg_cnt

    for i, d in enumerate(reg):
        d_time = dateutil.parser.parse(d['createdTime'])
        new_time = dateutil.parser.parse(createdTime)
        if new_time < d_time:
            offset = i
            break
        elif new_time == d_time:
            if type == 'IMPORTED':
                offset = i
                break
            elif type == 'dataflow' and d['type'] != 'IMPORTED':
                offset = i
                break
            elif type == 'WRANGLED' and d['type'] != 'IMPORTED' and d['type'] != 'dataflow':
                offset = i
                break
            else:   # snapshot
                continue
        else:
            continue

    reg.insert(offset, {'type': type, 'name': name, 'uuid': uuid, 'createdTime': createdTime})
    reg_cnt += 1

def reg_del(uuid):
    global reg_cnt
    for d in reg:
        if d['uuid'] == uuid:
            reg.remove(d)
            reg_cnt -= 1
            return

def keep(orig_d, keep_list):
    new_d = dict()
    for key in keep_list:
        if key in orig_d:
            new_d[key] = orig_d[key]
    return new_d


def delete(d, delete_list):
    for key in delete_list:
        try:
            del d[key]
        except KeyError:
            pass
    return d

def get_line(prompt, strip=True):
    sys.stdout.write(prompt)

    # enable commenting out
    while True:
        if line_script_file:
            line = line_script_file.readline()
        else:
            line = sys.stdin.readline()

        if len(line) > 0 and line[0].startswith('#'):   # comment out the line
            continue

        break

    offset = line.find('#')     # comment out the rest
    if offset >= 0:
        line = line[:offset]

    if line_script_file:
        print line

    if strip:
        return line.strip()
    else:
        return line

help = { "rename"   : "rename col: speed to: 'HP'",
         'drop'     : "drop col: speed",
         'settype'  : "settype col: 'itemNo' type: integer'",
         'set'      : "set col: country value: if (country=='US', 'USA', country)",
         'derive'   : "derive value: point * 2 as: 'double'",
         'replace'  : "replace col: birth on '2015' with: '15' global: true'",
         'split'    : "split col: birth on: '-' limit: 2",
         'merge'    : "merge col: d1, d2, d3 with: '_' as: 'birth_merged'",
         'extract'  : "extract col: birth on: /2[0-9][0-9][0-9]/ limit: 2",
         'keep'     : "keep row: if (speed >= 300 || price >= 50000)",
         'delete'   : "delete row: if (speed < 300 && price < 50000)",
         'nest'     : "nest: col: year, month, day into: map as 'map_birth'",
         'unnest'   : "unnest: col: map_birth into: map idx: 'year'",
         'header'   : "header rownum: 1",
         'join'     : "join leftSelectCol: itemNo,name,speed rigthSelectCol: itemNo,name,weight condition: itemNo=itemNo && weight=weight joinType: 'inner' dataset2: [2]",
         'union'    : "union masterCol: itemNo, weight, speed dataset2: [4], [6]",
         'countpattern': "countpattern: col: country on: [a-z] ignoreCase: true",
         'sort'     : "sort order: col1, col2",
         'pivot'    : "pivot col: year value: `count()` group: region limit: 30",
         'unpivot'  : "unpivot col: year groupEvery: 1",
         'flatten'  : "flatten: col: regions",
         'move'     : "move col: map_birth before: column1" }

def get_uuid(s):
    if s[0] == '[':
        reg_idx = int(s[1:-1])
        return reg[reg_idx]['uuid']
    elif s[0] == '<':
        reg_name = s[1:-1]
        uuid = 'not_found'
        for d in reg:
            if d['name'].find(reg_name) >= 0:
                uuid = d['uuid']
        return uuid
    return s

def replace_registry_no(s):
    for i, d in enumerate(reg):
        s = s.replace('[%d]' % i, "'%s'" % d['uuid'], 1)

    pos = 0
    while True:
        start = s.find('<', pos)
        if start < 0:
            break
        pos = start + 1
        end = s.find('>', pos)
        if end < 0:
            print 'wrong dataset name'
            break

        dsname = s[start:end+1]
        s = s.replace(dsname, "'" + get_uuid(dsname) + "'")

    return s

def get_transform_args():
    d = {}

    while True:
        s = get_line('enter action: ')
        if s == '': return None
        d['op'] = str.upper(s)
        if d['op'] in ['APPEND', 'UPDATE', 'DELETE', 'JUMP', 'UNDO', 'REDO', 'CANCEL']:
            break
        print 'invalid transform rule:', s.split()[0], ': available: APPEND, UPDATE, DELETE, JUMP, UNDO, REDO, CANCEL'

    if d['op'] in ['DELETE', 'UNDO', 'REDO', 'CANCEL']:
        return d

    if d['op'] == 'JUMP':
        s = get_line('enter ruleIdx: ')
        if s == '': return None
        d['ruleIdx'] = int(s)
        return d

    while True:
        s = get_line('enter ruleString: ')
        if s == '': return None
        d['ruleString'] = str.lower(s)

        # 2개 이상의 token일 경우, 제대로 입력했다고 가정.
        if len(s.split()) >= 2:
            s = replace_registry_no(s)

            d['ruleString'] = s
            return d

        cmd = s.split()[0]

        if cmd == 'h' or cmd == 'help':
            for i in help:
                '<rule examples>'
                print '  %-12s %s' % (i, help.get(i))
        elif cmd in help:
            print 'example: ', help.get(cmd)
        else:
            print 'invalid ruleString: ', s
            print 'try again'

def prune_dict(d, verbose, delete_list=[], keep_list=[]):
    if verbose == 'on':
        d = delete(d, delete_list)
    elif verbose == 'off':
        d = keep(d, keep_list)
    return d

# verbose == 'off': 지정된 key들만을 출력
# verbose == 'on': 지정된 key들을 제거하고 출력
# verbose == 'more': 몽땅 출력
def print_dict(d, verbose, delete_list=[], keep_list=[]):
    d = prune_dict(d, verbose, delete_list, keep_list)
    print json.dumps(d, sort_keys=True, indent=4)

def print_matrix(d, target_cnt):
    records = []
    for i in range(0, target_cnt):
        records.append([])
    if 'matrixResponse' not in d:
        print 'no matrixResponse'
        return

    print 'column name(type) list:'
    if 'columns' not in d['matrixResponse']:
        print 'no columns in matrixResponse'
        return

    for column in d['matrixResponse']['columns']:
        print '%s(%s)' % (column['name'], column['type']),
        idx = 0
        for value in column['value']:
            records[idx].append(value)
            idx += 1
            if idx == target_cnt:
                break
    print

    for i in range(0, target_cnt):
        for value in records[i]:
            print value,
        print

def print_column_list(d):
    if 'matrixResponse' not in d or 'columns' not in d['matrixResponse']:
        print 'no column info exists'
        return

    print 'columns:',
    for column in d['matrixResponse']['columns']:
        print '%s(%s)' % (column['name'], column['type']),
    print

def print_rule_list(d):
    if 'ruleStringInfos' not in d:
        return

    print 'undoable=%s redoable=%s' % (d['undoable'], d['redoable'])
    print 'transform rule list:'
    for i, info in enumerate(d['ruleStringInfos']):
        print ' %s [%d]: %s' % ('cur =>' if  i == d['ruleCurIdx'] else '      ', i, info['ruleString'])

def check_response(r):
    print 'response status code: ', r.status_code
    d = r.json()
    if r.status_code == '500' or 'errorMsg' in d:
        print_error(d)
        print '------------------------------------------------------------'
        print '------------------------------------------------------------'
        print '--------------- error occured while running ----------------', args
        print '------------------------------------------------------------'
        print '------------------------------------------------------------'
        exit(-1)

def process_transform_response(r, verbose, words, join_preview=False):
    d = r.json()

    if 'errorMsg' in d:
        print_error(d)
        return

    if not join_preview:
        # to protect matrixRespone
        tmp = {}
        for key in d:
            tmp[key] = d[key]

        print_dict(tmp, verbose, \
                   ['_links', 'matrixResponse', 'createdBy', 'createdTime', 'modifiedBy', 'modifiedTime'], \
                   ['ruleCurIdx', 'ruleCurStringInfos'])

    if 'matrixResponse' in d and \
       'columns' in d['matrixResponse'] and \
       len(d['matrixResponse']['columns']) > 0 and \
       'value' in d['matrixResponse']['columns'][0]:
        print 'result_cnt: %d' % len(d['matrixResponse']['columns'][0]['value'])
    else:
        print 'result_cnt: 0'

    print_target_cnt = 3
    if len(words) == 4:
        try:
            print_target_cnt = int(words[3])
        except TypeError:
            pass

    print_matrix(d, print_target_cnt)

    print_column_list(d)
    print_rule_list(d)

    check_response(r)

def replace_dataset2(rule):
    datasets = []
    words = rule.split()

    clause_began = False
    for word in words:
        if clause_began:
            if word[:-1] == ':':
                break
            else:
                datasets.append(word.replace(',','').strip())
        else:
            if word == 'dataset2:':
                clause_began = True

    skip = len('dataset2') + 1
    start = rule.find('dataset2:')
    for i, dataset in enumerate(datasets):
        offset = rule.find(dataset, start + skip)
        rule = '%s[%d]%s' % (rule[:start + skip], 4 + i * 2, rule[offset + skip + len(dataset):])

    return rule

def run_snapshot_descripton_file(desc_filename):
    global line_script_file

    try:
        f = open(desc_filename)
        d = json.load(f)

        tmp_line_script = 'tmp.line.script'
        f = open(tmp_line_script, 'w+')

        print >> f, 'ds post'
        print >> f
        print >> f, d['dsName']
        print >> f, d['sql']
        print >> f, 'df post'
        print >> f, os.path.basename(desc_filename)
        print >> f, '[0]'
        print >> f

        print >> f, 'tr post'
        print >> f, '[0]'
        print >> f, '[1]'

        # [0] -> initial imported dataset
        # [1] -> dataflow
        # [2] -> master wrangled dataset

        if 'dataset2' in d:
            for i, d2 in enumerate(d['dataset2']):
                print >> f, 'ds post'
                print >> f
                print >> f, d2['dsName']
                print >> f, d2['sql']           # create [3] -> 2nd imported dataset ([5], [7], ..)

                print >> f, 'tr post'
                print >> f, '[%d]' % (3 + i * 2)    # create [4] -> 2nd wrangled dataset ([6], [8], ..)
                print >> f, '[1]'

                for rule in d2['rules']:
                    print >> f, 'tr put [%d]' % (4 + i * 2)
                    print >> f, 'append'
                    print >> f, rule

        for rule in d['rules']:
            if rule.find('dataset2') >= 0:
                rule = replace_dataset2(rule)
            if rule.startswith('join'):
                print >> f, 'tr preview [2]'
                print >> f, 'append'
                print >> f, rule
            print >> f, 'tr put [2]'
            print >> f, 'append'
            print >> f, rule

        print >> f, 'ss post [2]'
        print >> f, d['dbName']
        print >> f, d['tblName']

        for partKey in d['partKeys']:
            print >> f, partKey
        print >> f

        f.close()
        line_script_file = open(tmp_line_script, 'r')

    except Exception as e:
        print e
        exit(-1)

def print_error(d):
    print '>>>>>>>>>>>>>>>>>>>> Error Occured >>>>>>>>>>>>>>>>>>>>'
    print 'errorMsg:', d['errorMsg']
    if 'exceptionClassName' in d:
        print 'exceptionClassName:', d['exceptionClassName']
    print 'full json:'
    print d
    print '<<<<<<<<<<<<<<<<<<<< Error Occured <<<<<<<<<<<<<<<<<<<<'

#eof
