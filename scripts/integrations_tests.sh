#!/bin/bash

NPM=$(which npm)

echo "Enable debug mode..."
set -x

echo "Execute integration tests..."
${NPM} run integration

if [ $? -ne 0 ]; then
    echo "Integration tests fail. Please review the log!"
    exit 1
fi

echo "Disable debug mode..."
set +x

echo "Integration tests running sucesseful..."
exit 0