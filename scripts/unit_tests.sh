#!/bin/bash

NPM=$(which npm)

echo "Enable debug mode..."
set -x

echo "Install app dependencies..."
${NPM} ci

if [ $? -ne 0 ]; then
    echo "Fails npm ci. Please review the dependencies!"
    exit 1
fi

echo "Execute unit tests..."
${NPM} test

if [ $? -ne 0 ]; then
    echo "Fails npm ci. Please review the dependencies!"
    exit 1
fi

echo "Disable debug mode..."
set +x

echo "Tests running sucesseful..."
exit 0