#!/bin/sh
mkdir -p tmp/script
cp -a script/* tmp/script
cp -a VERSION tmp/script/
cp update_script tmp/
cp scriptparser tmp/
cd tmp
tar -czvf ../scriptparser-$(cat ../VERSION).tar.gz *
cd ..
rm -rf tmp
ls -al