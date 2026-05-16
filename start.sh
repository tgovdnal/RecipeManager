#!/bin/sh
set -ex
./node_modules/.bin/prisma db push
node server.js
