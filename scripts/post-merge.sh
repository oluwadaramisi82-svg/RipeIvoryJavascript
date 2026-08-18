#!/bin/bash
set -e

# Install mockup-sandbox dependencies if package.json exists
if [ -f "artifacts/mockup-sandbox/package.json" ]; then
  cd artifacts/mockup-sandbox
  npm install --prefer-offline 2>/dev/null || npm install
  cd ../..
fi

# Apply idempotent schema to the development database
if [ -n "$DATABASE_URL" ] && [ -f "schema.sql" ]; then
  psql "$DATABASE_URL" -f schema.sql || echo "Warning: schema apply failed"
fi

echo "Post-merge setup complete."
