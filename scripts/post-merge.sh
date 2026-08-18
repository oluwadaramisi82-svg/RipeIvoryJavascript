#!/bin/bash
set -e

# Install mockup-sandbox dependencies if package.json exists
if [ -f "artifacts/mockup-sandbox/package.json" ]; then
  cd artifacts/mockup-sandbox
  npm install --prefer-offline 2>/dev/null || npm install
  cd ../..
fi

echo "Post-merge setup complete."
