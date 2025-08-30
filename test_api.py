import requests
import json

def test_api_endpoints():
    base_url = "http://127.0.0.1:5000"
    
    print("=== Testing API Endpoints ===")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/api/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return False
    
    # Test model info endpoint
    try:
        response = requests.get(f"{base_url}/api/model-info")
        print(f"Model info: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Model info failed: {e}")
        return False
    
    # Test transaction analysis with ML model
    try:
        # Test with old format (using v_values for ML model)
        ml_test_data = {
            "time": 0.0,
            "v_values": [0.0] * 28,  # 28 V features
            "amount": 100.0
        }
        
        response = requests.post(f"{base_url}/api/analyze-transaction", 
                               json=ml_test_data,
                               headers={'Content-Type': 'application/json'})
        
        result = response.json()
        print(f"\nML Model Test (amount: $100):")
        print(f"Status: {response.status_code}")
        print(f"Fraud Probability: {result.get('fraudProbability', 'N/A')}")
        print(f"Risk Score: {result.get('riskScore', 'N/A')}")
        print(f"Is Genuine: {result.get('isGenuine', 'N/A')}")
        print(f"Factors: {result.get('factors', [])}")
        
    except Exception as e:
        print(f"ML model test failed: {e}")
        return False
    
    # Test transaction analysis with new format (heuristic-based)
    try:
        # Test with new format (using amount, merchant, location)
        heuristic_test_data = {
            "amount": 5000.0,
            "merchant": "Unknown Store",
            "location": "International",
            "cardNumber": "1234-5678-9012-3456",
            "timestamp": "2024-01-01T12:00:00Z"
        }
        
        response = requests.post(f"{base_url}/api/analyze-transaction", 
                               json=heuristic_test_data,
                               headers={'Content-Type': 'application/json'})
        
        result = response.json()
        print(f"\nHeuristic Test (amount: $5000, unknown merchant):")
        print(f"Status: {response.status_code}")
        print(f"Fraud Probability: {result.get('fraudProbability', 'N/A')}")
        print(f"Risk Score: {result.get('riskScore', 'N/A')}")
        print(f"Is Genuine: {result.get('isGenuine', 'N/A')}")
        print(f"Factors: {result.get('factors', [])}")
        
    except Exception as e:
        print(f"Heuristic test failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = test_api_endpoints()
    if success:
        print("\n✅ All API endpoints are working properly!")
    else:
        print("\n❌ Some API endpoints have issues!") 