#!/bin/sh
set -ex
npx prisma db push --skip-generate
npx prisma db seed || true
node server.js
