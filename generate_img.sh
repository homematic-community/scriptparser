#!/bin/sh
mkdir -p tmp/script
cp -a script/* tmp/script
cp update_script tmp/
cp scriptparser tmp/
cd tmp
tar -czvf ../scriptparser-1.1.tar.gz *
cd ..
rm -rf tmp
