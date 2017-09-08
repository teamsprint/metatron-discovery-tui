#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [file path]"
    exit -1;
}
if [ $# -lt 1 ] ; then help; fi

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
            0) filepath=$arg ;; 
        esac

        let i=$i+1
    fi
done

fileType="${filepath##*.}"

echo '{ "filePath":"'${filepath}'" }' | run_node ${upload_file_js} ${silent} | run_node ${make_imported_dataset_js} ${silent} | run_node ${make_dataflow_with_dataset_js} ${silent} | run_node ${make_transform_js} | run_node ${make_snapshot_js}
