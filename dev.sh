#!/bin/sh

DIR="$( pwd )/$( dirname $0 )"

cd "$DIR/frontend"
npm run dev:watch &
npm run dev:inject &

cd "$DIR/backend"
npm run dev &

trap "trap - TERM && kill -- -$$ 2>/dev/null ; ps -aux | grep -e webpack -e nodemon | tr -s ' ' | cut -d' ' -f2 | xargs -n1 kill -9 2>/dev/null" INT TERM EXIT
wait
