#!/bin/sh
set -ex
npx prisma db push --skip-generate
node server.js
