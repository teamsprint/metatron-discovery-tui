#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [dfId]"
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
            0) dfId=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{"dfId":"'${dfId}'"}' | run_node ${get_dataflow_js} ${silent}
