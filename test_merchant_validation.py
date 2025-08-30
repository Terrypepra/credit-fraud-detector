import requests
import json
import numpy as np

def test_merchant_validation():
    """Test merchant validation with various suspicious merchant names"""
    url = "http://localhost:5000/api/analyze-transaction"
    
    test_cases = [
        {
            "amount": 100,
            "merchant": "ben inc",
            "location": "New York",
            "cardNumber": "4111111111111111",
            "description": "Suspicious: 'ben inc' (should be flagged)"
        },
        {
            "amount": 500,
            "merchant": "abc corp",
            "location": "Los Angeles",
            "cardNumber": "5555555555554444",
            "description": "Suspicious: 'abc corp' (should be flagged)"
        },
        {
            "amount": 1000,
            "merchant": "test company",
            "location": "Chicago",
            "cardNumber": "378282246310005",
            "description": "Suspicious: 'test company' (should be flagged)"
        },
        {
            "amount": 2000,
            "merchant": "xyz llc",
            "location": "Miami",
            "cardNumber": "6011111111111117",
            "description": "Suspicious: 'xyz llc' (should be flagged)"
        },
        {
            "amount": 5000,
            "merchant": "fake business",
            "location": "Seattle",
            "cardNumber": "4000000000000002",
            "description": "Suspicious: 'fake business' (should be flagged)"
        },
        {
            "amount": 100,
            "merchant": "Walmart",
            "location": "New York",
            "cardNumber": "4111111111111111",
            "description": "Legitimate: 'Walmart' (should be legitimate)"
        },
        {
            "amount": 500,
            "merchant": "Amazon.com",
            "location": "Los Angeles",
            "cardNumber": "5555555555554444",
            "description": "Legitimate: 'Amazon.com' (should be legitimate)"
        },
        {
            "amount": 1000,
            "merchant": "Starbucks",
            "location": "Chicago",
            "cardNumber": "378282246310005",
            "description": "Legitimate: 'Starbucks' (should be legitimate)"
        },
        {
            "amount": 2000,
            "merchant": "Target",
            "location": "Miami",
            "cardNumber": "6011111111111117",
            "description": "Legitimate: 'Target' (should be legitimate)"
        },
        {
            "amount": 5000,
            "merchant": "Home Depot",
            "location": "Seattle",
            "cardNumber": "4000000000000002",
            "description": "Legitimate: 'Home Depot' (should be legitimate)"
        }
    ]
    
    print("=== Testing Enhanced Merchant Validation ===\n")
    
    for i, test_case in enumerate(test_cases, 1):
        data = {
            "amount": test_case["amount"],
            "merchant": test_case["merchant"],
            "location": test_case["location"],
            "cardNumber": test_case["cardNumber"],
            "timestamp": "2024-06-15T10:30:00Z"
        }
        
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                result = response.json()
                print(f"{i}. {test_case['description']}")
                print(f"   Amount: ${test_case['amount']}, Merchant: {test_case['merchant']}")
                print(f"   Fraud Probability: {result['fraudProbability']:.3f}")
                print(f"   Risk Score: {result['riskScore']}")
                print(f"   Is Genuine: {result['isGenuine']}")
                print(f"   Factors: {result['factors']}")
                
                # Determine if the result matches expectations
                expected_fraud = "Suspicious" in test_case['description']
                actual_fraud = not result['isGenuine']
                
                if expected_fraud == actual_fraud:
                    print(f"   ✅ CORRECT: {'Fraud' if expected_fraud else 'Legitimate'} detected as expected")
                else:
                    print(f"   ❌ INCORRECT: Expected {'Fraud' if expected_fraud else 'Legitimate'}, got {'Fraud' if actual_fraud else 'Legitimate'}")
                
                print()
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")
    
    print("=== Test Summary ===")
    print("The enhanced merchant validation should now properly detect:")
    print("- Made-up company names with 'inc', 'corp', 'llc'")
    print("- Very short merchant names")
    print("- Names with suspicious patterns")
    print("- All lowercase or uppercase names")
    print("- Names with repeated characters")
    print("- Names with numbers")
    print("- Generic business names")

if __name__ == "__main__":
    test_merchant_validation() 