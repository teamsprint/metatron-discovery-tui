#!/bin/sh

function abspath()
{
  case "${1}" in
    [./]*)
    echo "$(cd ${1%/*}; pwd)/${1##*/}"
    ;;
    *)
    echo "${PWD}/${1}"
    ;;
  esac
}

EXCLUDE_LIST="--exclude .idea\
              --exclude data\
              --exclude cscope.out\
              --exclude *.tar.gz\
              --exclude *.pyc\
              --exclude *.swp\
              --exclude *.iml\
              --exclude make-dist.sh\
              --exclude .gitignore\
              --exclude .git\
              --exclude .DS_Store"

DIRNAME=metatron-discovery-tui
DATE_STRING=`date "+%m%d_%H%M"`
TARGET_NAME=$DIRNAME-$DATE_STRING.tar.gz
cd `dirname $(abspath $0)`/..
tar zcvf $TARGET_NAME $EXCLUDE_LIST $DIRNAME
mv $TARGET_NAME $DIRNAME

#eof
