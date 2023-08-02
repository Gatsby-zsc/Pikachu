#!/bin/bash

npx prisma generate
npx prisma migrate deploy
node server.js