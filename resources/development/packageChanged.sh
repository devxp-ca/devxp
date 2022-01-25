#!/bin/sh

subfolder="."
[ -z "$1" ] || subfolder="$( echo $1 | sed 's/\/$//g' )"

exit $( git diff --name-only HEAD@{1} HEAD | grep "^$subfolder/package-lock.json" > /dev/null 2>&1 )
