#!/bin/bash
set -e

echo ">>> Building application..."
npm run build

echo ">>> Running migrations..."
# npm run migration:run

echo ">>> Starting application..."
npm run start:prod
