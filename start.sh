#!/bin/sh
set -ex
npx prisma db push
node server.js
