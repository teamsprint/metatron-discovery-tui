#!/usr/bin/env python
#encoding:utf8

import json
import sys

line_script_file = None

reg = []
reg_cnt = 0

def reg_append(type, name, uuid, createdTime):
    global reg_cnt
    for d in reg:
        if d['uuid'] == uuid:
            return
    reg.append({'type': type, 'name': name, 'uuid': uuid, 'createdTime': createdTime})
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
    if line_script_file:
        line = line_script_file.readline()
    else:
        sys.stdout.write(prompt)
        line = sys.stdin.readline()

    if strip:
        return line.strip()
    else:
        return line

help = { "rename"   : "rename col: speed to: 'HP'",
         'drop'     : "drop col: speed'",
         'settype'  : "settype col: itemNo type: integer'",
         'set'      : "set col: country value: if (country=='US', 'USA', country)",
         'derive'   : "derive value: point * 2 as: 'double'",
         'replace'  : "replace col: birth on '2015' with: '15' global: true'",
         'split'    : "split col: birth on: '-' limit: 2",
         'merge'    : "merge col: d1, d2, d3 with: '_' as: birth_merged",
         'extract'  : "extract col: birth on: /2[0-9][0-9][0-9]/ limit: 2",
         'keep'     : "keep row: if (speed >= 300 || price >= 50000)",
         'delete'   : "delete row: if (speed < 300 && price < 50000)",
         'nest'     : "nest: col: year, month, day into: map as 'map_birth'",
         'unnest'   : "unnest: col: map_birth into: map idx: 'year'",
         'header'   : "header rownum: 1",
         'join'     : "join leftSelectCol: itemNo,name,speed rigthSelectCol: itemNo,name,weight condition: itemNo=itemNo joinType: ‘inner’ dataset2: [2]",
         'union'    : "union masterCol: itemNo, weight, speed dataset2: [4], [6]",
         'countpattern': "countpattern: col: country on: [a-z] ignoreCase: true",
         'sort'     : "sort order: col1, col2",
         'pivot'    : "pivot col: year value: `count()` group: region limit: 30",
         'unpivot'  : "unpivot col: year groupEvery: 1",
         'flatten'  : "flatten: col: regions",
         'move'     : "move col: map_birth before: column1" }

def replace_registry_no(s):
    for i, d in enumerate(reg):
        s = s.replace('[%d]' % i, "'%s'" % d['uuid'], 1)
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

def process_transform_response(r, verbose, words, join_preview=False):
    d = r.json()

    if 'errorMsg' in d:
        print_error(d)
        return

    if not join_preview:
        print_dict(d, verbose, \
                   ['_links', 'matrixResponse', 'createdBy', 'createdTime', 'modifiedBy', 'modifiedTime'], \
                   ['ruleCurIdx', 'ruleCurStringInfos'])

    # print(d['matrixResponse']['columns']['type'])
    target_cnt = 3
    if len(words) == 4:
        try:
            target_cnt = int(words[3])
        except TypeError:
            pass

    print_matrix(d, target_cnt)

    print_column_list(d)
    print_rule_list(d)

    print 'response status code: ', r.status_code
    assert r.status_code == 200, r.status_code

def run_snapshot_descripton_file(desc_filename):
    global line_script_file

    try:
        f = open(desc_filename)
        d = json.load(f)

        tmp_line_script = 'tmp.line.script'
        f = open(tmp_line_script, 'w+')

        print >> f, 'ds post'
        print >> f
        print >> f, 'tmp ds for %s' % desc_filename
        print >> f, d['sql']
        print >> f, 'df post'
        print >> f, 'tmp df for %s' % desc_filename
        print >> f, '[0]'
        print >> f
        print >> f, 'tr post'
        print >> f, '[0]'
        print >> f, '[1]'

        for rule in d['rules']:
            print >> f, 'tr put [2]'
            print >> f, 'append'
            print >> f, rule

        print >> f, 'ss post [2]'
        print >> f, d['dbName']
        print >> f, d['tblName']

        for partKey in d['partKeys']:
            print >> f, partKey
        print >> f

        print >> f, d['extHdfsDir']

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
    print '<<<<<<<<<<<<<<<<<<<< Error Occured <<<<<<<<<<<<<<<<<<<<'

#eof
