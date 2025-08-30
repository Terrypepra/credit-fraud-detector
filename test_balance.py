import requests
import json
import numpy as np

def test_transaction(amount, merchant, location, card_number, description):
    """Test a transaction and return the results"""
    url = "http://localhost:5000/api/analyze-transaction"
    
    data = {
        "amount": amount,
        "merchant": merchant,
        "location": location,
        "cardNumber": card_number,
        "timestamp": "2024-06-15T10:30:00Z"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"\n{description}")
            print(f"Amount: ${amount}, Merchant: {merchant}, Location: {location}")
            print(f"Fraud Probability: {result['fraudProbability']:.3f}")
            print(f"Risk Score: {result['riskScore']}")
            print(f"Result: {'FRAUD' if not result['isGenuine'] else 'LEGITIMATE'}")
            print(f"Factors: {result['factors']}")
            return result
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Exception: {e}")
        return None

def main():
    print("Testing Fraud Detection Balance...")
    
    # Test legitimate transactions
    print("\n=== LEGITIMATE TRANSACTIONS ===")
    test_transaction(50, "Walmart", "Local Store", "1234-5678-9012-3456", "Small legitimate purchase")
    test_transaction(150, "Amazon", "Online", "1234-5678-9012-3456", "Medium legitimate purchase")
    test_transaction(500, "Best Buy", "Local Store", "1234-5678-9012-3456", "Large legitimate purchase")
    
    # Test suspicious transactions
    print("\n=== SUSPICIOUS TRANSACTIONS ===")
    test_transaction(5000, "Unknown Merchant", "Foreign Country", "1234-5678-9012-3456", "High amount + unknown merchant")
    test_transaction(15000, "Test Store", "International", "1234-5678-9012-3456", "Very high amount + test merchant")
    test_transaction(2000, "Suspicious Shop", "Overseas", "1234-5678-9012-3456", "Medium amount + suspicious merchant")
    
    # Test edge cases
    print("\n=== EDGE CASES ===")
    test_transaction(1000, "Normal Store", "Local", "1234-5678-9012-3456", "Moderate amount legitimate")
    test_transaction(8000, "Normal Store", "Local", "1234-5678-9012-3456", "High amount legitimate")
    test_transaction(12000, "Normal Store", "Local", "1234-5678-9012-3456", "Very high amount legitimate")

if __name__ == "__main__":
    main() 