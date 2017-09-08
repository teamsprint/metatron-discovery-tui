#!/bin/bash


hdfsUrl="hdfs://localhost:9000/tmp/imported_files/test.csv";
ruleListFile="rulelist.txt";
hiveJson="hive_dest.json"; 
verbose="";
i=0
for arg in "$@"
do
    if [ "$arg" = "-v" ] ; then
        verbose="-v";
    elif [ "$arg" = "-h" ] ; then
        echo "USAGE: $0 [HDFS url] [rule list file] [hive json]"
        exit -1;
    else
        case $i in
            0) hdfsUrl=$arg ;; 
            1) ruleListFile=$arg ;; 
            2) hiveJson=$arg ;; 
        esac

        let i=$i+1
    fi
done

wrangledDs=$(echo '{"hdfsUrl":"'${hdfsUrl}'","ruleListFile":"'${ruleListFile}'","hiveJson":"'${hiveJson}'"}' | node app.js -c hdfs-test_makedataset.js | node app.js -c hdfs-test_makedataflow.js | node app.js -c hdfs-test_post_tranform.js)

#if [ ! -e $ruleListFile ] ; 
#then
#    echo "rulelist file not found : ${rulsListFile}"
#    exit -1;
#fi
#while read line
#do
#    oldIFS="$IFS"
#    IFS=',' read -a rule <<< "${line}"
#    op=$(echo ${rule[0]}|awk '{$1=$1};1')
#    ruleIdx=$(echo ${rule[1]}|awk '{$1=$1};1')
#    if [ -z "$ruleIdx" ]
#    then
#        ruleIdx="null";
#    fi
#    ruleString=$(echo ${rule[2]}|awk '{$1=$1};1')
#    echo '{"op":"'${op}'","ruleIdx":'${ruleIdx}',"ruleString":"'${ruleString}'"}' | node app.js -c 
#    IFS="$oldIFS"
#done < ${ruleListFile}
#| node app.js -c hdfs-test_put_transform.js

i=0
while [ true ] ; do
    newWrangledDs=$(echo ${wrangledDs} | node app.js -c hdfs-test_put_transform.js)
    if [ $? -ne 0 ] ; then
        break;
    fi
    wrangledDs=$newWrangledDs;
    let i=$i+1
done

echo $wrangledDs;
#echo $wrangledDs | node app.js -c hdfs-test_get_transform.js $verbose

echo $wrangledDs | node app.js -c hdfs-test_make_snapshot.js $verbose





