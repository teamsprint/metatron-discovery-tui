#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [file path] [target path]"
    exit -1;
}
if [ $# -lt 2 ] ; then help; fi

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
            1) targetPath=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{ "filePath":"'${filepath}'", "targetPath":"'${targetPath}'" }' | run_node ${upload_file_hdfs_js} ${silent}
