#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [fileKey] [sheetname=""] [sheetindex=0] [resultSize=250] [hasFields=Y]"
    exit -1;
}
if [ $# -lt 1  ] ; then help; fi

sheetname="";
sheetindex=0;
resultSize=250;
hasFields="Y";
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
            0) fileKey=$arg ;; 
            1) sheetname=$arg ;; 
            2) sheetindex=$arg ;; 
            3) resultSize=$arg ;; 
            4) hasFields=$arg ;; 
        esac

        let i=$i+1
    fi
done

echo '{ "fileKey":"'${fileKey}'", "sheetname":"'${sheetname}'", "sheetindex":"'${sheetindex}'", "resultSize":"'${resultSize}'", "hasFields":"'${hasFields}'"}' | run_node ${get_file_content_js} ${silent}
