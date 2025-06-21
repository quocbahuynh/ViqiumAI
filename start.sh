#!/bin/bash

echo "============================================="
echo "   🤖 Welcome to Viqium AI Setup Script 🤖   "
echo "============================================="

# Ensure root dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "[+] Installing root (backend) dependencies..."
  npm install
fi

# Ensure frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
  echo "[+] Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

echo ""
echo "How would you like to run Viqium AI?"
echo "1) 🛠  Development Mode (npm run dev)"
echo "2) 🚀 Production Mode (npm run build & start)"
echo "3) 🐳 Docker Containers (docker-compose up)"
echo "0) ❌ Exit"
read -p "Enter your choice [0-3]: " choice

case $choice in
  1)
    echo "[*] Starting Development Server..."
    npm run dev
    ;;
  2)
    echo "[*] Building and Starting Production Server..."
    npm run build
    npm run start
    ;;
  3)
    echo "[*] Starting Docker Compose..."
    docker-compose up --build
    ;;
  0)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "[!] Invalid choice. Exiting."
    exit 1
    ;;
esac
