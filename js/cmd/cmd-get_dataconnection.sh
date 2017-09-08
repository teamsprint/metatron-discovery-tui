#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [dcId]"
    exit -1;
}
if [ $# -lt 1  ] ; then help; fi

silent="";
i=0
for arg in "$@"
do
    if [ "$arg" = "-s" ] ; then
        silent="-s";
    elif [ "$arg" = "-h" ] ; then
        help;
    else
        case $i in
            0) dcId=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{"dcId":"'${dcId}'"}' | run_node ${get_dataconnection_js} ${silent}
