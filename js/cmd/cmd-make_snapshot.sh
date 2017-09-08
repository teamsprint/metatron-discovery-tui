#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/../lib";
source "${lib_dir}/env.sh"

function help() {
    echo "USAGE: $0 [wrangledDsId] [format] [compression] [partKey]"
    exit -1;
}
if [ $# -lt 4 ] ; then help; fi

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
            0) wrangledDsId=$arg ;;
            1) format=$arg ;;
            2) compression=$arg ;;
            3) partKey=$arg ;;
        esac

        let i=$i+1
    fi
done

echo '{ "wrangledDsId":"'${wrangledDsId}'", "format":"'${format}'", "compression":"'${compression}'", "partKey":"'${partKey}'" }' |
run_node ${make_snapshot_js} ${silent}
