#!/usr/bin/env bash
# Saddle: Test Pi CLI as a subprocess (how we'll run per-tenant agents)
set -e

cd /opt/saddle
source .env
export OPENROUTER_API_KEY

echo "=== Phase 0 Complete ==="
echo ""

# Test 1: Pi CLI works
echo "Test 1: Pi version"
pi --version

# Test 2: Extension loads
echo ""
echo "Test 2: Extension discovery"
pi --provider openrouter --model openrouter/deepseek/deepseek-chat \
  -e .pi/extensions/saddle.ts \
  --no-context-files --no-skills \
  -p "Say 'saddle ready' exactly." 2>&1

# Test 3: Print mode for programmatic use
echo ""
echo "Test 3: Print mode (how Saddle calls Pi)"
pi -p --provider openrouter --model openrouter/deepseek/deepseek-chat \
  --no-context-files --no-skills --no-extensions \
  "What is the current working directory? Answer in one line." 2>&1

echo ""
echo "=== All tests passed ==="