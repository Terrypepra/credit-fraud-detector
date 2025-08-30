import { authService } from './authService';

// TODO: Use environment variable for API_BASE_URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  location: string;
  timestamp: string;
  cardNumber: string;
  fraudProbability: number;
  riskScore: number;
  isGenuine: boolean;
  factors: string[];
}

export interface CSVUploadResponse {
  message: string;
  results: Transaction[];
  total_rows: number;
  processed_rows: number;
}

export interface VValues {
  v_values: number[];
  time: number;
  amount: number;
}

export interface ModelInfo {
  name: string;
  modelType: string;
  featureCount: number;
  status: string;
  version: string;
  lastUpdated: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface ModelEvaluation {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    trueNegatives: number;
    falsePositives: number;
    falseNegatives: number;
    truePositives: number;
  };
  featureImportance: Array<{
    feature: string;
    importance: number;
  }>;
  rocAuc: number;
  prAuc: number;
}

export interface TransactionHistory {
  transactions: Transaction[];
  totalCount: number;
  fraudulentCount: number;
  genuineCount: number;
  averageAmount: number;
  totalAmount: number;
}

export interface RealTimeStats {
  totalTransactions: number;
  fraudulentTransactions: number;
  genuineTransactions: number;
  averageRiskScore: number;
  totalAmount: number;
  averageAmount: number;
  recentActivity: Array<{
    timestamp: string;
    amount: number;
    isGenuine: boolean;
  }>;
}

export interface MerchantTransaction {
  amount: number;
  merchant: string;
  location: string;
  cardNumber: string;
  timestamp: string;
}

class FraudDetectionService {
  private getHeaders(): Record<string, string> {
    const authHeaders = authService.getAuthHeaders();
    return {
      ...authHeaders,
      'Content-Type': 'application/json',
    };
  }

  async analyzeTransaction(transaction: MerchantTransaction): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/analyze-transaction`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze transaction');
    }

    return response.json();
  }

  async predictWithVValues(vValues: VValues): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(vValues),
    });

    if (!response.ok) {
      throw new Error('Failed to predict with V values');
    }

    return response.json();
  }

  async analyzeBatch(transactions: MerchantTransaction[]): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/analyze-batch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ transactions }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze batch');
    }

    return response.json();
  }

  async uploadCSV(file: File): Promise<CSVUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-csv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload CSV');
    }

    return response.json();
  }

  async getModelInfo(): Promise<ModelInfo> {
    const response = await fetch(`${API_BASE_URL}/model-info`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get model info');
    }

    return response.json();
  }

  async getModelEvaluation(): Promise<ModelEvaluation> {
    const response = await fetch(`${API_BASE_URL}/model-evaluation`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get model evaluation');
    }

    return response.json();
  }

  async getTransactionHistory(): Promise<TransactionHistory> {
    const response = await fetch(`${API_BASE_URL}/transaction-history`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get transaction history');
    }

    return response.json();
  }

  async exportTransactionHistory(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/export-history`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to export transaction history');
    }

    return response.blob();
  }

  async getRealTimeStats(): Promise<RealTimeStats> {
    const response = await fetch(`${API_BASE_URL}/real-time-stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get real-time stats');
    }

    return response.json();
  }
}

export const fraudDetectionService = new FraudDetectionService();
