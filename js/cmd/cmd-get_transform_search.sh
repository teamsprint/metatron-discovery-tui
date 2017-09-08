#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [dsId] [searchString] [count]"
    exit -1;
}
if [ $# -lt 2 ] ; then help; fi

silent="";
i=0
count=0;
for arg in "$@"
do
    if [ "$arg" = "-s" ] ; then
        silent="-s";
    elif [ "$arg" = "-h" ] ; then
        help;
    else
        case $i in
            0) dsId=$arg ;; 
            1) searchString=$arg ;; 
            2) count=$arg ;;
        esac

        let i=$i+1
    fi
done

echo '{"dsId":"'${dsId}'","searchString":"'${searchString}'","count":"'${count}'"}' | run_node ${get_transform_search_js} ${silent}
