#!/usr/bin/env python3
"""
Test script to verify the API connection
"""

import requests
import json

def test_api_connection():
    """Test the API connection and endpoints"""
    
    base_url = "http://127.0.0.1:5000/api"
    
    print("🔍 Testing API Connection...")
    print(f"Base URL: {base_url}")
    print("-" * 50)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health Check: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Message: {data.get('message', 'N/A')}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
    
    # Test 2: Model info (should require auth)
    try:
        response = requests.get(f"{base_url}/model-info")
        print(f"🔒 Model Info (No Auth): {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Correctly requires authentication")
        else:
            print(f"   ⚠️ Unexpected status: {response.text}")
    except Exception as e:
        print(f"❌ Model Info Test Failed: {e}")
    
    # Test 3: Test CORS headers
    try:
        response = requests.options(f"{base_url}/health")
        print(f"🌐 CORS Test: {response.status_code}")
        cors_headers = response.headers.get('Access-Control-Allow-Origin', 'Not set')
        print(f"   CORS Headers: {cors_headers}")
    except Exception as e:
        print(f"❌ CORS Test Failed: {e}")
    
    print("-" * 50)
    print("🎯 Connection Test Complete!")
    print("\n📋 Next Steps:")
    print("1. Open http://127.0.0.1:5173 in your browser")
    print("2. Try to register/login")
    print("3. Test the fraud detection features")

if __name__ == "__main__":
    test_api_connection() 