#!/bin/bash

# Club Run - Startup Script
# This script starts both the main platform and agent dashboard

echo "🎉 Starting Club Run Platform..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Stopping Club Run services..."
    kill $PLATFORM_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start the main platform (purple gradient homepage)
echo "🚀 Starting main platform on http://localhost:8081"
cd club-run-platform
python3 -m http.server 8081 &
PLATFORM_PID=$!

# Start the frontend (agent dashboard)
echo "🎨 Starting agent dashboard on http://localhost:8080"
cd ../club-run-frontend
python3 -m http.server 8080 &
FRONTEND_PID=$!

echo ""
echo "✅ Club Run is now running!"
echo ""
echo "📱 Main Platform (Purple Homepage):"
echo "   http://localhost:8081"
echo ""
echo "🎨 Agent Dashboard (Light Theme):"
echo "   http://localhost:8080/index.html"
echo ""
echo "💬 Chat Widget: Shared between both pages"
echo "   Updates to shared-assets/chat-widget.js will affect both pages"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for user to stop
wait 