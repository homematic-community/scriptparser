#!/bin/sh
mkdir -p tmp/script
cp -a script/* tmp/script
cp -a VERSION tmp/script/
cp update_script tmp/
cp scriptparser tmp/
cd tmp
find . -not -name '.DS_Store' -not -name '*.sha256' -type f -print0 | xargs -0 sha256sum >scriptparser-$(cat ../VERSION).sha256
tar --owner=root --group=root --exclude=.DS_Store -czvf ../scriptparser-$(cat ../VERSION).tar.gz *
cd ..
rm -rf tmp
