// TransactionForm.tsx - Transaction Entry & ML Analysis
// ----------------------------------------------------
// Handles both merchant-based and direct ML input for fraud analysis.
// Refined for clarity, maintainability, and a human touch.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fraudDetectionService } from "@/services/fraudDetectionService";
import { Transaction } from "@/services/fraudDetectionService";
import { CreditCard, MapPin, Store, DollarSign, Calendar, Brain, Database } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
}

export const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  // State for merchant form
  const [formData, setFormData] = useState({
    amount: "",
    merchant: "",
    location: "",
    cardNumber: "",
  });
  // State for direct ML input
  const [mlFormData, setMlFormData] = useState({
    time: "",
    amount: "",
    v_values: Array(28).fill("") as string[],
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("merchant");
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate fields
    if (activeTab === "merchant") {
      if (!formData.amount || !formData.merchant || !formData.location || !formData.cardNumber) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!mlFormData.time || !mlFormData.amount || mlFormData.v_values.some(v => !v)) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields including V1-V28 values",
          variant: "destructive",
        });
        return;
      }
    }
    setIsAnalyzing(true);
    try {
      let transactionData;
      if (activeTab === "merchant") {
        transactionData = {
          amount: parseFloat(formData.amount),
          merchant: formData.merchant,
          location: formData.location,
          cardNumber: formData.cardNumber,
          timestamp: new Date().toISOString(),
        };
      } else {
        transactionData = {
          time: parseFloat(mlFormData.time),
          amount: parseFloat(mlFormData.amount),
          v_values: mlFormData.v_values.map(v => parseFloat(v)),
          timestamp: new Date().toISOString(),
        };
      }
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Fix isGeunine typo in result usage
      const result = await fraudDetectionService.analyzeTransaction(transactionData);
      onSubmit(result);
      toast({
        title: "Analysis Complete",
        description: result.isGenuine 
          ? "Transaction appears legitimate" 
          : "Potential fraud detected!",
        variant: result.isGenuine ? "default" : "destructive",
      });
      // Reset form
      if (activeTab === "merchant") {
        setFormData({
          amount: "",
          merchant: "",
          location: "",
          cardNumber: "",
        });
      } else {
        setMlFormData({
          time: "",
          amount: "",
          v_values: Array(28).fill("") as string[],
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing the transaction",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle merchant form input
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  // Handle ML form input
  const handleMlInputChange = (field: string, value: string, index?: number) => {
    if (field === 'v_values' && index !== undefined) {
      setMlFormData(prev => ({
        ...prev,
        v_values: prev.v_values.map((v, i) => i === index ? value : v)
      }));
    } else {
      setMlFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  // Generate random values for ML input
  const generateRandomValues = () => {
    const randomVValues = Array(28).fill(0).map(() => (Math.random() - 0.5) * 2);
    setMlFormData(prev => ({
      ...prev,
      time: Math.floor(Math.random() * 100000).toString(),
      amount: (Math.random() * 1000).toFixed(2),
      v_values: randomVValues.map(v => v.toFixed(6))
    }));
  };

  // Load sample data for merchant form
  const loadSampleData = () => {
    setFormData({
      amount: "299.99",
      merchant: "Amazon.com",
      location: "Seattle, WA",
      cardNumber: "****-****-****-1234",
    });
  };

  return (
    <div className="space-y-6">
      {/* Advanced Mode Toggle */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setShowAdvancedMode(!showAdvancedMode)}
          variant="outline"
          size="sm"
          className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
        >
          <Brain className="h-4 w-4 mr-2" />
          {showAdvancedMode ? "Hide Advanced Mode" : "Show Advanced Mode"}
        </Button>
      </div>

      {showAdvancedMode ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-blue-800/30">
            <TabsTrigger value="merchant" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Store className="h-4 w-4 mr-2" />
              Merchant Form (ML)
            </TabsTrigger>
            <TabsTrigger value="ml" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              Direct ML Input (V1-V28)
            </TabsTrigger>
          </TabsList>
        {/* Merchant Form Tab */}
        <TabsContent value="merchant">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4 p-4 bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-blue-200 text-sm">
                  <Brain className="h-4 w-4 inline mr-2 text-blue-400" />
                  This form uses machine learning to analyze transaction characteristics and detect fraud patterns.
                </p>
                <Button
                  type="button"
                  onClick={loadSampleData}
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                >
                  Load Sample Data
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                  Transaction Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                  required
                />
              </div>
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-white flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-blue-400" />
                  Card Number (Last 4 digits)
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="****-****-****-1234"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                  required
                />
              </div>
              {/* Merchant Name */}
              <div className="space-y-2">
                <Label htmlFor="merchant" className="text-white flex items-center">
                  <Store className="h-4 w-4 mr-2 text-purple-400" />
                  Merchant Name
                </Label>
                <Input
                  id="merchant"
                  type="text"
                  placeholder="e.g., Amazon, Walmart, etc."
                  value={formData.merchant}
                  onChange={(e) => handleInputChange("merchant", e.target.value)}
                  className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                  required
                />
              </div>
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-400" />
                  Transaction Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                  required
                />
              </div>
            </div>
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Transaction...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Analyze for Fraud
                  </div>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
        {/* Direct ML Input Tab */}
        <TabsContent value="ml">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Direct ML Model Input</h3>
                <p className="text-blue-200 text-sm">
                  Enter the exact V1-V28 values for precise ML model prediction (for advanced users with raw transaction data).
                </p>
              </div>
              <Button
                type="button"
                onClick={generateRandomValues}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                Generate Random Values
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="ml-time" className="text-white flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                    Time
                  </Label>
                  <Input
                    id="ml-time"
                    type="number"
                    placeholder="0"
                    value={mlFormData.time}
                    onChange={(e) => handleMlInputChange("time", e.target.value)}
                    className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                    required
                  />
                </div>
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="ml-amount" className="text-white flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                    Amount
                  </Label>
                  <Input
                    id="ml-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={mlFormData.amount}
                    onChange={(e) => handleMlInputChange("amount", e.target.value)}
                    className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-white flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-purple-400" />
                  V1-V28 Values (Principal Components)
                </Label>
                <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-14 gap-2">
                  {mlFormData.v_values.map((value, index) => (
                    <div key={index} className="space-y-1">
                      <Label htmlFor={`v${index + 1}`} className="text-xs text-blue-200">
                        V{index + 1}
                      </Label>
                      <Input
                        id={`v${index + 1}`}
                        type="number"
                        step="0.000001"
                        placeholder="0.000000"
                        value={value}
                        onChange={(e) => handleMlInputChange("v_values", e.target.value, index)}
                        className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400 text-xs"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isAnalyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Running ML Analysis...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Run ML Prediction
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        {/* Direct ML Input Tab */}
        <TabsContent value="ml">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Direct ML Model Input</h3>
                <p className="text-blue-200 text-sm">
                  Enter the exact V1-V28 values for precise ML model prediction (for advanced users with raw transaction data).
                </p>
              </div>
              <Button
                type="button"
                onClick={generateRandomValues}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <Database className="h-4 w-4 mr-2" />
                Generate Random Values
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="ml-time" className="text-white flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-yellow-400" />
                    Time
                  </Label>
                  <Input
                    id="ml-time"
                    type="number"
                    placeholder="0"
                    value={mlFormData.time}
                    onChange={(e) => handleMlInputChange("time", e.target.value)}
                    className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                    required
                  />
                </div>
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="ml-amount" className="text-white flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                    Amount
                  </Label>
                  <Input
                    id="ml-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={mlFormData.amount}
                    onChange={(e) => handleMlInputChange("amount", e.target.value)}
                    className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-white flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-purple-400" />
                  V1-V28 Values (Principal Components)
                </Label>
                <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-14 gap-2">
                  {mlFormData.v_values.map((value, index) => (
                    <div key={index} className="space-y-1">
                      <Label htmlFor={`v${index + 1}`} className="text-xs text-blue-200">
                        V{index + 1}
                      </Label>
                      <Input
                        id={`v${index + 1}`}
                        type="number"
                        step="0.000001"
                        placeholder="0.000000"
                        value={value}
                        onChange={(e) => handleMlInputChange("v_values", e.target.value, index)}
                        className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400 text-xs"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isAnalyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 text-lg"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Running ML Analysis...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Run ML Prediction
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        </Tabs>
      ) : (
        /* Simple Merchant Form (Default View) */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4 p-4 bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-blue-200 text-sm">
                <Brain className="h-4 w-4 inline mr-2 text-blue-400" />
                This form uses machine learning to analyze transaction characteristics and detect fraud patterns.
              </p>
              <Button
                type="button"
                onClick={loadSampleData}
                variant="outline"
                size="sm"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              >
                Load Sample Data
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                Transaction Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                required
              />
            </div>
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-white flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-blue-400" />
                Card Number (Last 4 digits)
              </Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="****-****-****-1234"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                required
              />
            </div>
            {/* Merchant Name */}
            <div className="space-y-2">
              <Label htmlFor="merchant" className="text-white flex items-center">
                <Store className="h-4 w-4 mr-2 text-purple-400" />
                Merchant Name
              </Label>
              <Input
                id="merchant"
                type="text"
                placeholder="e.g., Amazon, Walmart, etc."
                value={formData.merchant}
                onChange={(e) => handleInputChange("merchant", e.target.value)}
                className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                required
              />
            </div>
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-400" />
                Transaction Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., New York, NY"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="bg-slate-700/50 border-blue-800/30 text-white placeholder-slate-400"
                required
              />
            </div>
          </div>
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg"
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Transaction...
                </div>
              ) : (
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Analyze for Fraud
                </div>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
