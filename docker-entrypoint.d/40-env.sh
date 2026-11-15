#!/bin/sh
set -eu

export API_URL="${API_URL:-}"

if [ -f /usr/share/nginx/html/env.template.js ]; then
  envsubst '${API_URL}' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi
