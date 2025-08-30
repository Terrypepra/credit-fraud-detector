import requests
import json

def test_merchant_form():
    """Test the merchant form with various transaction patterns"""
    
    # Test cases with different risk levels
    test_cases = [
        {
            "name": "Low Risk - Normal Transaction",
            "data": {
                "amount": 50.00,
                "merchant": "Walmart",
                "location": "New York, NY",
                "cardNumber": "1234-5678-9012-3456",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        },
        {
            "name": "Medium Risk - High Amount",
            "data": {
                "amount": 2500.00,
                "merchant": "Amazon",
                "location": "Seattle, WA",
                "cardNumber": "1234-5678-9012-3456",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        },
        {
            "name": "High Risk - Very High Amount",
            "data": {
                "amount": 8000.00,
                "merchant": "Unknown Store",
                "location": "International",
                "cardNumber": "1234-5678-9012-3456",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        },
        {
            "name": "Very High Risk - Suspicious Pattern",
            "data": {
                "amount": 9999.00,
                "merchant": "Suspicious Merchant",
                "location": "Foreign Country",
                "cardNumber": "1234-5678-9012",  # Invalid card number
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }
    ]
    
    print("Testing Merchant Form ML Model...")
    print("=" * 50)
    
    for test_case in test_cases:
        print(f"\nTest: {test_case['name']}")
        print(f"Input: {test_case['data']}")
        
        try:
            response = requests.post(
                "http://localhost:5000/api/analyze-transaction",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Success!")
                print(f"   Fraud Probability: {result['fraudProbability']:.3f}")
                print(f"   Risk Score: {result['riskScore']}%")
                print(f"   Is Genuine: {result['isGenuine']}")
                print(f"   Factors: {result['factors']}")
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")

def test_direct_ml_form():
    """Test the direct ML form with V1-V28 values"""
    
    # Test with some suspicious V values
    suspicious_v_values = [2.5, 3.1, -1.2, 4.8, 2.3, 5.2, -0.8, 3.9, 2.1, 4.5,
                          1.8, 3.7, -2.1, 4.2, 2.9, 3.4, 1.6, 4.1, 2.7, 3.8,
                          2.0, 4.3, 1.9, 3.6, 2.4, 4.0, 2.2, 3.5]
    
    test_data = {
        "time": 1234567890,
        "amount": 5000.00,
        "v_values": suspicious_v_values,
        "timestamp": "2024-01-15T10:30:00Z"
    }
    
    print("\nTesting Direct ML Form...")
    print("=" * 50)
    print(f"Input: {test_data}")
    
    try:
        response = requests.post(
            "http://localhost:5000/api/analyze-transaction",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success!")
            print(f"   Fraud Probability: {result['fraudProbability']:.3f}")
            print(f"   Risk Score: {result['riskScore']}%")
            print(f"   Is Genuine: {result['isGenuine']}")
            print(f"   Factors: {result['factors']}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    print("ML Model Testing Script")
    print("=" * 50)
    
    # Test merchant form
    test_merchant_form()
    
    # Test direct ML form
    test_direct_ml_form()
    
    print("\n" + "=" * 50)
    print("Testing complete!") 