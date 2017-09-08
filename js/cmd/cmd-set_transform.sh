#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [start] [count] [wrangledDsId] [op=APPEND/UPDATE/DELETE/JUMP/UNDO/REDO] [ruleParameter] [ruleParameter2]";
    exit -1;
}
if [ $# -lt 4 ] ; then help; fi

maxColSize=15;
silent="";
i=0
for arg in "$@"
do
    if [ "$arg" = "-s" ] ; then
        silent="-s";
    elif [ "$arg" = "-h" ] ; then
        echo "USAGE: $0 [dfId] [importedDsId]"
        exit -1;
    else
        case $i in
            0) start=$arg ;; 
            1) count=$arg ;; 
            2) wrangledDsId=$arg ;;
            3) op=$arg ;;
            4) ruleParam=$arg ;;
            5) ruleParam2=$arg ;;
        esac

        let i=$i+1
    fi
done

ruleIdx=0;
ruleString=""; # "rename col: a to: b"
case $op in
    'APPEND') ruleString=$ruleParam ;;
    'UPDATE') ruleString=$ruleParam ; ruleIdx=$ruleParam2 ;;
    'DELETE') ruleIdx=$ruleParam ;;
    'JUMP') ruleIdx=$ruleParam ;;
    'UNDO') ;;
    'REDO') ;;
    *) help ;;
esac

echo $ruleParam

echo '{ "start":'${start}', "count":'${count}', "maxColSize":'${maxColSize}', "dsId":"'${wrangledDsId}'", "op":"'${op}'", "ruleIdx":'${ruleIdx}', "ruleString":"'${ruleString}'" }' | run_node ${set_transform_js} ${silent}
