#!/bin/bash
# Simple script to run your app and expose it publicly

echo "🚀 Starting your app with public URL..."
echo ""

# Kill any existing processes
echo "1. Cleaning up..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Start the app
echo "2. Starting Next.js app..."
cd "/Users/mohammedsalih/Documents/New project"
npm run dev > /tmp/nextjs.log 2>&1 &
APP_PID=$!

# Wait for app to be ready
echo "3. Waiting for app to start..."
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ App is ready!"
    break
  fi
  sleep 1
done

# Test app
echo ""
echo "4. Testing app..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "304" ]; then
  echo "✅ App responding with code: $RESPONSE"
else
  echo "⚠️  App responding with code: $RESPONSE"
  echo "Check logs: tail -f /tmp/nextjs.log"
fi

echo ""
echo "5. Creating public URL..."
echo ""
echo "Your app is running on: http://localhost:3000"
echo ""
echo "📍 To get a public URL, run in a NEW terminal:"
echo ""
echo "   ssh -R 80:localhost:3000 nokey@localhost.run"
echo ""
echo "You'll get a URL like: https://xxxxx.lhr.life"
echo ""
echo "Keep this terminal open!"
echo ""
echo "To stop: kill $APP_PID"
