
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/TransactionForm";
import FileUploader from "@/components/FileUploader";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Dashboard } from "@/components/Dashboard";
import { ModelEvaluation } from "@/components/ModelEvaluation";
import { TransactionHistory } from "@/components/TransactionHistory";
import { AuthWrapper } from "@/components/AuthWrapper";
import { CreditCard, Shield, AlertTriangle, TrendingUp, Brain, History } from "lucide-react";
import { Transaction } from "@/services/fraudDetectionService";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const addBatchTransactions = (newTransactions: Transaction[]) => {
    setTransactions(prev => [...newTransactions, ...prev]);
  };

  const fraudulentCount = transactions.filter(t => !t.isGenuine).length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgRiskScore = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length 
    : 0;

  return (
    <AuthWrapper>
      {/* Main page container with responsive padding */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation tabs with responsive grid layout */}
          <TabsList
            className="w-full flex flex-col sm:grid sm:grid-cols-6 bg-slate-800/50 border-blue-800/30 overflow-x-auto"
            aria-label="Main navigation tabs"
          >
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="single" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Single Transaction
            </TabsTrigger>
            <TabsTrigger value="batch" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Batch Upload
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <History className="h-4 w-4 mr-2" />
              Transaction History
            </TabsTrigger>
            {/* Model Info tab hidden for now */}
            {/* <TabsTrigger value="model" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              Model Info
            </TabsTrigger> */}
          </TabsList>

          {/* Dashboard tab content */}
          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard transactions={transactions} />
          </TabsContent>

          {/* Single transaction analysis tab */}
          <TabsContent value="single" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
                  Analyze Single Transaction
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Enter transaction details for real-time fraud detection analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm onSubmit={addTransaction} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch upload tab */}
          <TabsContent value="batch" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-800/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Batch Transaction Analysis
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Upload a CSV file containing multiple transactions for ML model analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onUpload={addBatchTransactions} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results display tab */}
          <TabsContent value="results" className="space-y-6">
            <ResultsDisplay transactions={transactions} />
          </TabsContent>

          {/* Transaction History tab */}
          <TabsContent value="history" className="space-y-6">
            <TransactionHistory />
          </TabsContent>

          {/* <TabsContent value="model" className="space-y-6">
            <ModelEvaluation />
          </TabsContent> */}
        </Tabs>
      </div>
    </AuthWrapper>
  );
};

export default Index;
