#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [tablename] [size]"
    exit -1;
}
if [ $# -lt 2 ] ; then help; fi

size=0;
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
            0) tbl=$arg ;; 
            1) size=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{"sql": "select * from '${tbl}' limit 7", "size":"'${size}'"}' | run_node ${get_preview_hive_js} ${silent}
