#!/bin/sh

cd ../server && docker build -t 172.16.16.172:12380/bridgx/bridgx-fe:0.0.1 . && docker push 172.16.16.172:12380/bridgx/bridgx-fe:0.0.1
