import requests
import json

def test_auth_endpoints():
    """Test authentication endpoints"""
    base_url = "http://localhost:5000/api"
    
    print("=== Testing Authentication Endpoints ===\n")
    
    # Test registration
    print("1. Testing Registration...")
    register_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/register", json=register_data)
        if response.status_code == 201:
            print("✅ Registration successful")
            token = response.json()["access_token"]
            print(f"Token received: {token[:20]}...")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(response.json())
    except Exception as e:
        print(f"❌ Registration error: {e}")
    
    print("\n2. Testing Login...")
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/login", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful")
            token = response.json()["access_token"]
            print(f"Token received: {token[:20]}...")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(response.json())
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    print("\n3. Testing Protected Endpoint (Model Info)...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{base_url}/model-info", headers=headers)
        if response.status_code == 200:
            print("✅ Protected endpoint accessible")
            print(f"Model info: {response.json()}")
        else:
            print(f"❌ Protected endpoint failed: {response.status_code}")
            print(response.json())
    except Exception as e:
        print(f"❌ Protected endpoint error: {e}")
    
    print("\n4. Testing Unprotected Endpoint (Health)...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health endpoint accessible")
            print(f"Health status: {response.json()}")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")

if __name__ == "__main__":
    test_auth_endpoints() 