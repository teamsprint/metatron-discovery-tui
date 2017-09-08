#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/lib";
source "${lib_dir}/env.sh"

if [ $# -ne 1 ] ; then
    list_dataset=$(run_node_silent ${rule_tester_list_dataset_js});

    echo " > list of wrangled datasets";
    array_dataset=( ${list_dataset} )
    i=0
    for dsId in ${list_dataset} 
    do
        echo " ${i}) [ ${dsId} ]";
        let i=$i+1;
    done
    echo "";
    read -p " put the WrangledDs Index): " wrangledDsIdx
    wrangledDsId=${array_dataset[$wrangledDsIdx]};
    #echo "USAGE: $0 [wrangledDsId]";
    #exit -1;
else
    wrangledDsId=$1;
fi

function help() {
    echo "help, quit, exit, list, show, append, delete";
}

function quit() {
    exit 0;
}

function process {
    cmdLine=$1;

    echo "not ready for ${cmdLine}";
}

function list {
    echo '{ "dsId":"'${wrangledDsId}'" }' | run_node_silent ${rule_tester_list_js};
}

function show {
    echo '{ "dsId":"'${wrangledDsId}'" }' | run_node_silent ${rule_tester_show_js};
}

function append {
    read -p " (ruleString): " ruleString
    op="APPEND";
    ruleIdx="null";
    echo '{ "dsId":"'${wrangledDsId}'", "op":"'${op}'", "ruleIdx":'${ruleIdx}', "ruleString":"'${ruleString}'" }' | run_node_silent ${rule_tester_put_js};
}

function delete {
    #read -p " (ruleIdx): " ruleIdx
    ruleIdx="0";
    op="DELETE";
    ruleString="null";
    echo '{ "dsId":"'${wrangledDsId}'", "op":"'${op}'", "ruleIdx":'${ruleIdx}', "ruleString":"'${ruleString}'" }' | run_node_silent ${rule_tester_put_js};
}


while true; do
    read -p "> " cmdLine
    case "$cmdLine" in
        "help") help ;;
        "quit") quit ;;
        "exit") quit ;;
        "list") list ;;
        "show") show ;;
        "append") append ;;
        "delete") delete ;;
        *) process $cmdLine ;;
    esac
    echo "";
done

