#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [start=0] [count=0]"
    exit -1;
}

start=0;
count=0;
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
            0) start=$arg ;; 
            1) count=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{ "start":'${start}', "count":'${count}' }' | run_node ${list_snapshot_js} ${silent}
