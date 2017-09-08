#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [dsId] [row]"
    exit -1;
}
if [ $# -lt 2 ] ; then help; fi

row=0;
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
            1) row=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{"dsId":"'${dsId}'", "row":"'${row}'"}' | run_node ${get_preview_js} ${silent}
