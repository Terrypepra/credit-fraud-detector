// FileUploader.tsx - CSV Upload & ML Analysis for Credit Fraud Detector
// -------------------------------------------------------------
// This component handles CSV uploads, calls the ML backend, and displays results.
// Refined for clarity, maintainability, and a human touch.

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fraudDetectionService } from '../services/fraudDetectionService';
import { Transaction, CSVUploadResponse } from '@/services/fraudDetectionService';
import { Upload, FileText, AlertTriangle, CheckCircle, Download, Brain, Info, FileDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CsvTransaction {
  time: number;
  v_values: number[];
  amount: number;
}

interface FileUploaderProps {
  onUpload?: (transactions: Transaction[]) => void;
}

// Utility: Card style for uploader sections
const uploaderCardClass =
  "bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl";

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [results, setResults] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    total_rows: number;
    processed_rows: number;
    message: string;
  } | null>(null);

  // Handle file upload and call backend
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setLoading(true);
    setError(null);
    setResults([]);
    setUploadStats(null);

    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('Please upload a CSV file');
      }

      // Use the new CSV upload endpoint
      const result: CSVUploadResponse = await fraudDetectionService.uploadCSV(file);
      
      setResults(result.results);
      setUploadStats({
        total_rows: result.total_rows,
        processed_rows: result.processed_rows,
        message: result.message
      });
      
      if (onUpload) {
        onUpload(result.results);
      }

      toast({
        title: "CSV Analysis Complete",
        description: result.message,
        variant: "default",
      });

    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to process CSV file.';
      setError(errorMsg);
      toast({
        title: "Upload Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Download sample CSV template
  const downloadSampleCSV = () => {
    const sampleData = [
      ['Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 'Amount'],
      ['0.0', '-1.3598071336738', '-0.0727811733098497', '2.53634673796914', '1.37815522427443', '-0.338320769942518', '0.462387777762292', '0.239598554061257', '0.0986979012610507', '0.363786969611213', '0.0907941719789316', '-0.551599533260813', '-0.617800855762348', '-0.991389847235408', '-0.311169353699879', '1.46817697209427', '-0.470400525259478', '0.207971241929242', '0.0257905801985591', '0.403992960255733', '0.251412098239705', '-0.018306777944153', '0.277837575558899', '-0.110473910188767', '0.0669280749146731', '0.128539358273528', '-0.189114843888824', '0.133558376740387', '-0.0210530534538215', '149.62'],
      ['0.0', '1.19185711131486', '0.26615071205963', '0.16648011335321', '0.448154078460911', '0.0600176492822243', '-0.0823608088155687', '-0.0788029833323113', '0.0851016549148104', '-0.255425128319186', '-0.166974414004614', '1.61272666105479', '1.06523531137287', '0.48909501589608', '-0.143772296441519', '0.635558093258208', '0.463917041022171', '-0.114804663102346', '-0.183361270123994', '-0.145783041325259', '-0.0690831352230203', '-0.225775248033138', '-0.638671952771851', '0.101288021253234', '-0.339846475529127', '0.167170404418143', '0.125894532368176', '-0.00898309914322813', '0.0147241691934927', '2.69']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transactions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Sample CSV Downloaded",
      description: "Use this template to format your transaction data",
      variant: "default",
    });
  };

  // Download results as CSV
  const downloadResults = () => {
    if (results.length === 0) return;
    
    const csvContent = [
      ['ID', 'Amount', 'Merchant', 'Location', 'Timestamp', 'Card Number', 'Fraud Probability', 'Risk Score', 'Is Genuine', 'Factors'],
      ...results.map(t => [
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
    a.download = `fraud_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card className={uploaderCardClass}>
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-400" />
            Upload CSV File
          </CardTitle>
          <CardDescription className="text-blue-200">
            Upload a CSV file with transaction data for ML model analysis. Expected format: Time,V1,V2,...,V28,Amount
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* CSV Format Info */}
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-2">Required CSV Format:</p>
                  <p className="mb-1">• <strong>Time:</strong> Transaction timestamp (numeric)</p>
                  <p className="mb-1">• <strong>V1-V28:</strong> 28 anonymized features (numeric)</p>
                  <p className="mb-2">• <strong>Amount:</strong> Transaction amount (numeric)</p>
                  <p className="text-xs text-blue-300">Download the sample CSV below to see the exact format</p>
                </div>
              </div>
            </div>

            {/* Sample CSV Download */}
            <div className="flex justify-center">
              <Button
                onClick={downloadSampleCSV}
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Download Sample CSV
              </Button>
            </div>

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-800/30 border-dashed rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-blue-400" />
                  <p className="mb-2 text-sm text-blue-200">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-blue-300">CSV files only</p>
                </div>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            </div>

            {fileName && (
              <div className="flex items-center space-x-2 text-blue-200">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{fileName}</span>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="ml-3 text-blue-200">Processing transactions with ML model...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploadStats && (
              <div className="bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">{uploadStats.message}</span>
                </div>
                <div className="text-sm text-green-300">
                  Processed {uploadStats.processed_rows} of {uploadStats.total_rows} rows
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {results.length > 0 && (
        <Card className={uploaderCardClass}>
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-400" />
              ML Model Analysis Results
            </CardTitle>
            <CardDescription className="text-blue-200">
              Summary of batch transaction analysis using machine learning model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{results.length}</div>
                  <div className="text-sm text-blue-200">Total Analyzed</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">
                    {results.filter(r => !r.isGenuine).length}
                  </div>
                  <div className="text-sm text-blue-200">Fraudulent</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {results.filter(r => r.isGenuine).length}
                  </div>
                  <div className="text-sm text-blue-200">Legitimate</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {(results.reduce((sum, r) => sum + r.riskScore, 0) / results.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-200">Avg Risk Score</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={downloadResults}
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Results CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploader;
