#!/bin/bash
echo "Forcing Node.js version 20..."
export NODE_VERSION=20
export NPM_FLAGS="--legacy-peer-deps"

if ! node --version | grep -q "v20"; then
    echo "Installing Node.js 20..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
fi

echo "Current Node version: $(node --version)"
npm ci --legacy-peer-deps && npm run build