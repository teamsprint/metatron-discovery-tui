#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [dsId] [count=default 0]"
    exit -1;
}
if [ $# -lt 1 ] ; then help; fi

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
            0) dsId=$arg ;; 
            1) count=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{"dsId":"'${dsId}'","count":"'${count}'"}' | run_node ${get_transform_count_js} ${silent}
