#!/bin/bash

script_dir=$(cd "$(dirname "$0")" && pwd);
lib_dir="${script_dir}/lib";
source "${lib_dir}/env.sh"
#script_dir=$(cd "$(dirname "$0")" && pwd);
#lib_dir="${script_dir}/lib";

#app_js="${lib_dir}/app.js";
make_dataset_js="${lib_dir}/hive-load_make_dataset.js";
make_dataflow_js="${lib_dir}/hive-load_make_dataflow.js";
post_transform_js="${lib_dir}/hive-load_post_tranform.js";
set_upstream_js="${lib_dir}/hive-load_set_upstream.js";
put_transform_js="${lib_dir}/hive-load_put_transform.js";
get_transform_js="${lib_dir}/hive-load_get_transform.js";
make_snapshot_js="${lib_dir}/hive-load_make_snapshot.js";

sampleFile="${script_dir}/hive-load.config.json";

i=0
for arg in "$@"
do
    if [ "$arg" = "-h" ] ; then
        echo "USAGE: $0 [sample file]"
        exit -1;
    else
        case $i in
            0) sampleFile=$arg ;; 
        esac

        let i=$i+1
    fi
done

if [ -f "${sampleFile}" ] ;
then
    sampleFilePwd=$(cd $(dirname "${sampleFile}") && pwd -P);
    sampleFileName=$(basename "${sampleFile}");
    sampleFile="${sampleFilePwd}/${sampleFileName}"
else
    echo "${sampleFile} is not found";
    exit -1;
fi

echo "dataset"
resultJson=$(echo '{"sampleFile":"'${sampleFile}'"}' | node ${app_js} -c ${make_dataset_js})
if [ $? -ne 0 ] ; then exit $? ; fi

echo "dataflow"
resultJson=$(echo "${resultJson}" | node ${app_js} -c ${make_dataflow_js} )
if [ $? -ne 0 ] ; then exit $? ; fi

echo "transform"
resultJson=$(echo "${resultJson}" | node ${app_js} -c ${post_transform_js} )
if [ $? -ne 0 ] ; then exit $? ; fi

echo "upstream"
resultJson=$(echo "${resultJson}" | node ${app_js} -c ${set_upstream_js} )
if [ $? -ne 0 ] ; then exit $? ; fi

wrangledDsId=$(echo $resultJson | node ${tool_parse_json_js} 'upstream.dsId')
echo "rule editing tool for [ ${wrangledDsId} ]"
echo ""
${script_dir}/transform-tool.sh ${wrangledDsId}



