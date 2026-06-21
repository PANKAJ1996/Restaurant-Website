#!/usr/bin/env python3
"""
Simple HTTP Server for Bubu Dudu ki Duniya Restaurant Website
Serves files from the current directory on localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

PORT = 8000
HANDLER = http.server.SimpleHTTPRequestHandler

def start_server():
    """Start the HTTP server and open browser."""
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), HANDLER) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"")
        print(f"╔═══════════════════════════════════════════════════════╗")
        print(f"║  Bubu Dudu ki Duniya - Offline Test Server           ║")
        print(f"╠═══════════════════════════════════════════════════════╣")
        print(f"║  Server running at: {url:<38} ║")
        print(f"║  Press Ctrl+C to stop the server                    ║")
        print(f"╚═══════════════════════════════════════════════════════╝")
        print(f"")
        
        try:
            webbrowser.open(url, new=2)
        except Exception as e:
            print(f"Could not open browser automatically: {e}")
            print(f"Open your browser and visit: {url}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    start_server()
