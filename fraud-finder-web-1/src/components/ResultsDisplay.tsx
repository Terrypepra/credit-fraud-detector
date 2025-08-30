
// ResultsDisplay.tsx - Transaction Results Overview
// ------------------------------------------------
// Displays summary and detailed results for analyzed transactions.
// Refined for clarity, maintainability, and a human touch.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/services/fraudDetectionService";
import { AlertTriangle, CheckCircle, CreditCard, MapPin, Store, Calendar, Shield, TrendingUp, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable method
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: {
      head: string[][];
      body: (string | number)[][];
      startY: number;
      styles: { fontSize: number };
      headStyles: { fillColor: number[] };
    }) => jsPDF;
  }
}

interface ResultsDisplayProps {
  transactions: Transaction[];
}

export const ResultsDisplay = ({ transactions }: ResultsDisplayProps) => {
  // Empty state
  if (transactions.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Transactions Analyzed</h3>
          <p className="text-blue-200 text-center">
            Start by analyzing individual transactions or uploading a batch file to see results here.
          </p>
        </CardContent>
      </Card>
    );
  }
  // Utility: badge color for risk score
  const getRiskBadgeColor = (riskScore: number) => {
    if (riskScore >= 80) return "bg-red-600 text-white";
    if (riskScore >= 60) return "bg-orange-600 text-white";
    if (riskScore >= 40) return "bg-yellow-600 text-black";
    return "bg-green-600 text-white";
  };
  // Utility: format date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  // Utility: Export results as CSV
  const downloadResults = () => {
    if (transactions.length === 0) return;
    const csvContent = [
      ['ID', 'Amount', 'Merchant', 'Location', 'Timestamp', 'Card Number', 'Fraud Probability', 'Risk Score', 'Is Genuine', 'Factors'],
      ...transactions.map(t => [
        t.id,
        t.amount,
        t.merchant,
        t.location,
        t.timestamp,
        t.cardNumber,
        t.fraudProbability,
        t.riskScore,
        t.isGenuine ? 'Yes' : 'No',
        t.factors.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  // Utility: Export results as PDF
  const downloadResultsPDF = () => {
    if (transactions.length === 0) return;
    const doc = new jsPDF();
    doc.text("Fraud Detection Results", 14, 16);
    doc.autoTable({
      head: [[
        'ID', 'Amount', 'Merchant', 'Location', 'Timestamp', 'Card Number', 'Fraud Probability', 'Risk Score', 'Is Genuine', 'Factors'
      ]],
      body: transactions.map(t => [
        t.id,
        t.amount,
        t.merchant,
        t.location,
        t.timestamp,
        t.cardNumber,
        (t.fraudProbability * 100).toFixed(1) + '%',
        t.riskScore,
        t.isGenuine ? 'Yes' : 'No',
        t.factors.join('; ')
      ]),
      startY: 22,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 64, 175] },
    });
    doc.save(`fraud_results_${new Date().toISOString().split('T')[0]}.pdf`);
  };
  return (
    <div className="space-y-6">
      {/* Download Button */}
      <div className="flex justify-end gap-2">
        <button
          onClick={downloadResults}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Results CSV
        </button>
        <button
          onClick={downloadResultsPDF}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Results PDF
        </button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{transactions.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Fraudulent</p>
                <p className="text-2xl font-bold text-red-400">
                  {transactions.filter(t => !t.isGenuine).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Legitimate</p>
                <p className="text-2xl font-bold text-green-400">
                  {transactions.filter(t => t.isGenuine).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Avg Risk Score</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {(transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length).toFixed(1)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Transaction List */}
      <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-400" />
            Transaction Analysis Results
          </CardTitle>
          <CardDescription className="text-blue-200">
            Detailed fraud detection results for all analyzed transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-6 rounded-lg border-l-4 ${
                  transaction.isGenuine 
                    ? 'bg-green-900/20 border-l-green-500' 
                    : 'bg-red-900/20 border-l-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.isGenuine ? 'bg-green-600' : 'bg-red-600'}`}>
                      {transaction.isGenuine ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        ${transaction.amount.toLocaleString()}
                      </h3>
                      <p className={`text-sm ${transaction.isGenuine ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.isGenuine ? 'LEGITIMATE' : 'POTENTIAL FRAUD'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getRiskBadgeColor(transaction.riskScore)}>
                      Risk: {transaction.riskScore}%
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {(transaction.fraudProbability * 100).toFixed(1)}% Fraud Probability
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-blue-200">
                    <Store className="h-4 w-4 mr-2" />
                    <span className="text-sm">{transaction.merchant}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{transaction.location}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="text-sm">{transaction.cardNumber}</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(transaction.timestamp)}</span>
                  </div>
                </div>
                {transaction.factors.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Risk Factors:</h4>
                    <div className="flex flex-wrap gap-2">
                      {transaction.factors.map((factor, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-yellow-400 border-yellow-400"
                        >
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
