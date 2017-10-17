#!/bin/sh
cd line-scripts
for i in `ls *.script`; do ../pycli -l $i; done
cd -
#cd snapshot-descriptions
#for i in `ls ??-*.desc.json`; do ../pycli -l $i; done
#cd -
