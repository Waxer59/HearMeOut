#!/bin/bash

docker-compose up -d

sleep 10

docker exec db /scripts/init-rs.sh