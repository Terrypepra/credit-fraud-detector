import requests
import json

def test_real_transaction():
    """Test the real Netflix transaction to understand why it's being flagged"""
    url = "http://localhost:5000/api/analyze-transaction"
    
    # Real transaction data
    data = {
        "amount": 9.99,
        "merchant": "netflix.com",
        "location": "new york",
        "cardNumber": "4660395507098264",
        "timestamp": "2024-06-15T10:30:00Z"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            result = response.json()
            print("=== Real Transaction Analysis ===")
            print(f"Amount: ${data['amount']}")
            print(f"Merchant: {data['merchant']}")
            print(f"Location: {data['location']}")
            print(f"Card Number: {data['cardNumber']}")
            print(f"Fraud Probability: {result['fraudProbability']:.3f}")
            print(f"Risk Score: {result['riskScore']}")
            print(f"Is Genuine: {result['isGenuine']}")
            print(f"Factors: {result['factors']}")
            
            # Analyze each factor
            print("\n=== Factor Analysis ===")
            for factor in result['factors']:
                print(f"- {factor}")
            
            # Expected result
            print(f"\n=== Expected vs Actual ===")
            print(f"Expected: Legitimate (Netflix subscription)")
            print(f"Actual: {'Fraud' if not result['isGenuine'] else 'Legitimate'}")
            
            if result['isGenuine']:
                print("✅ CORRECT: Legitimate transaction detected")
            else:
                print("❌ INCORRECT: Legitimate transaction flagged as fraud")
                
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_real_transaction() 