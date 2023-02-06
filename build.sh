#! /usr/bin/env bash

set -e

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo

if test -f "node"; then
    echo "𝙓 NodeJS installation not found. Aborting"
    exit 1
fi

echo "▸ Running build ..."
npm run build

echo
echo "▸ Fixing potential Security issues ..."
npm audit fix

echo
echo "▸ Locking dependencies ..."
npm i --package-lock-only

echo
echo "✅ Done!"
echo