#!/bin/sh

docker-compose up -d

sleep 10

docker exec db sh "/scripts/init-rs.sh"