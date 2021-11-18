#!/bin/sh
cd ../ && npm run build:prod && yes | cp -r ./dist/* ./server/web
