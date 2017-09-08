#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

ssId="";
silent="";
i=0
for arg in "$@"
do
    if [ "$arg" = "-s" ] ; then
        silent="-s";
    elif [ "$arg" = "-h" ] ; then
        echo "USAGE: $0 [ssId]"
        exit -1;
    else
        case $i in
            0) ssId=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{"ssId":"'${ssId}'"}' | run_node ${get_snapshot_js} ${silent}
