import joblib
import numpy as np
import requests
import json

def debug_model_issue():
    print("=== Debugging ML Model Issue ===")
    
    # Load model and scaler
    model = joblib.load('fraud_model.pkl')
    scaler = joblib.load('scaler.pkl')
    
    print(f"Model type: {type(model).__name__}")
    print(f"Scaler type: {type(scaler).__name__}")
    
    # Test the exact data format that's failing
    test_data = {
        "time": 0.0,
        "v_values": [0.0] * 28,
        "amount": 100.0
    }
    
    print(f"\nTest data: {test_data}")
    
    try:
        # Try the same logic as in the API
        features = [test_data.get('time', 0)] + test_data['v_values'] + [test_data.get('amount', 0)]
        print(f"Features length: {len(features)}")
        print(f"Features: {features[:5]}...")  # Show first 5 features
        
        features_scaled = scaler.transform([features])
        print(f"Scaled features shape: {features_scaled.shape}")
        
        prediction = model.predict(features_scaled)[0]
        print(f"Prediction: {prediction}")
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

def test_api_directly():
    print("\n=== Testing API Directly ===")
    
    # Test with the exact format that should work
    test_data = {
        "amount": 100.0,
        "merchant": "Test Store",
        "location": "Local",
        "cardNumber": "1234-5678-9012-3456",
        "timestamp": "2024-01-01T12:00:00Z"
    }
    
    try:
        response = requests.post("http://127.0.0.1:5000/api/analyze-transaction", 
                               json=test_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"API test failed: {e}")

if __name__ == "__main__":
    debug_model_issue()
    test_api_directly() 