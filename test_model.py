import joblib
import numpy as np
from datetime import datetime

def test_model():
    try:
        # Load the model and scaler
        print("Loading model and scaler...")
        model = joblib.load('fraud_model.pkl')
        scaler = joblib.load('scaler.pkl')
        print("✅ Model and scaler loaded successfully!")
        
        # Test with sample data
        print("\nTesting with sample transaction data...")
        
        # Sample transaction features (time, v1-v28, amount)
        sample_features = [0.0] + [0.0] * 28 + [100.0]  # Normal transaction
        sample_features_scaled = scaler.transform([sample_features])
        prediction = model.predict(sample_features_scaled)[0]
        
        print(f"Sample transaction (amount: $100): {'Fraud' if prediction == 1 else 'Legitimate'}")
        
        # Test with high-risk transaction
        high_risk_features = [0.0] + [2.0] * 28 + [5000.0]  # High amount, suspicious features
        high_risk_scaled = scaler.transform([high_risk_features])
        high_risk_prediction = model.predict(high_risk_scaled)[0]
        
        print(f"High-risk transaction (amount: $5000): {'Fraud' if high_risk_prediction == 1 else 'Legitimate'}")
        
        # Test model info
        print(f"\nModel type: {type(model).__name__}")
        print(f"Model features: {len(sample_features)}")
        print(f"Scaler type: {type(scaler).__name__}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing model: {e}")
        return False

if __name__ == "__main__":
    print("=== Machine Learning Model Test ===")
    success = test_model()
    if success:
        print("\n✅ Model is working properly!")
    else:
        print("\n❌ Model has issues!") 