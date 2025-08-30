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
            print(f"Card Number: {card_number}")
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
    print("Testing Enhanced Card Number Validation...")
    
    # Test legitimate card numbers (should be legitimate)
    print("\n=== LEGITIMATE CARD NUMBERS (Should be LEGITIMATE) ===")
    test_transaction(50, "Walmart", "Local Store", "4532015112830366", "Valid Visa card")
    test_transaction(150, "Amazon", "Online", "5555555555554444", "Valid Mastercard")
    test_transaction(500, "Best Buy", "Local Store", "378282246310005", "Valid Amex card")
    
    # Test suspicious card number patterns (should be flagged as fraud)
    print("\n=== SUSPICIOUS CARD PATTERNS (Should be FRAUD) ===")
    test_transaction(100, "Test Store", "Local", "5555555555555555", "All fives pattern")
    test_transaction(200, "Test Store", "Local", "1111111111111111", "All ones pattern")
    test_transaction(300, "Test Store", "Local", "0000000000000000", "All zeros pattern")
    test_transaction(400, "Test Store", "Local", "1234567890123456", "Sequential pattern")
    test_transaction(500, "Test Store", "Local", "1234123412341234", "Repeated pattern")
    test_transaction(600, "Test Store", "Local", "0101010101010101", "Alternating pattern")
    test_transaction(700, "Test Store", "Local", "2222222222222222", "All twos pattern")
    test_transaction(800, "Test Store", "Local", "9999999999999999", "All nines pattern")
    
    # Test edge cases
    print("\n=== EDGE CASES ===")
    test_transaction(1000, "Normal Store", "Local", "4111111111111111", "Known test card")
    test_transaction(2000, "Normal Store", "Local", "5105105105105100", "Known test card")
    test_transaction(3000, "Normal Store", "Local", "123456789012345", "Invalid length")

if __name__ == "__main__":
    main() 