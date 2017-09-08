#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [dcName] [host] [port] [username] [password]"
    exit -1;
}
if [ $# -lt 5 ] ; then help; fi

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
            0) dcName=$arg ;;
            1) hostname=$arg ;;
            2) port=$arg ;;
            3) username=$arg ;;
            4) password=$arg ;;
        esac

        let i=$i+1
    fi
done

fileType="${filepath##*.}"

echo '{ "dcName":"'${dcName}'", "hostname":"'${hostname}'", "port":"'${port}'", "username":"'${username}'", "password":"'${password}'" }' | run_node ${make_dataconnection_hive_js} ${silent} | run_node ${make_hive_imported_dataset_js} ${slient}
