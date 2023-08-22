#!/bin/bash

NPM=$(which npm)

echo "Enable debug mode..."
set -x

echo "Execute e2e tests..."
${NPM} run e2e

if [ $? -ne 0 ]; then
    echo "e2e tests fail. Please review the log!"
    exit 1
fi

echo "Disable debug mode..."
set +x

echo "e2e tests running sucesseful..."
exit 0