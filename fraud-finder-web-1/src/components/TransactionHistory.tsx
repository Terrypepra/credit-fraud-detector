// TransactionHistory.tsx - User's Analysis History
// -------------------------------------------------
// Displays transaction analysis history with search, filter, and export features.

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fraudDetectionService, RealTimeStats } from "@/services/fraudDetectionService";
import { Transaction } from "@/services/fraudDetectionService";
import { 
  History, 
  Search, 
  Download, 
  Filter, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TransactionHistoryProps {
  onTransactionSelect?: (transaction: Transaction) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  onTransactionSelect 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "fraudulent" | "legitimate">("all");
  const [stats, setStats] = useState<RealTimeStats | null>(null);

  // Load transaction history
  useEffect(() => {
    loadTransactionHistory();
    loadRealTimeStats();
  }, []);

  // Filter transactions based on search and filter
  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus === "fraudulent") {
      filtered = filtered.filter(t => !t.isGenuine);
    } else if (filterStatus === "legitimate") {
      filtered = filtered.filter(t => t.isGenuine);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterStatus]);

  const loadTransactionHistory = async () => {
    try {
      setLoading(true);
      const response = await fraudDetectionService.getTransactionHistory();
      setTransactions(response.transactions || []);
    } catch (err) {
      setError('Failed to load transaction history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeStats = async () => {
    try {
      const response = await fraudDetectionService.getRealTimeStats();
      setStats(response);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await fraudDetectionService.exportTransactionHistory();
      
      // Create and download CSV file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transaction_history_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Transaction history exported successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export transaction history",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
          <span className="text-blue-200">Loading transaction history...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-red-400 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button onClick={loadTransactionHistory} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <Card className="bg-slate-800/50 border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Real-time Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-white">{stats.total_transactions}</div>
                <div className="text-sm text-blue-200">Total Analyzed</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{stats.fraudulent_count}</div>
                <div className="text-sm text-blue-200">Fraudulent</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{stats.legitimate_count}</div>
                <div className="text-sm text-blue-200">Legitimate</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{stats.avg_risk_score}</div>
                <div className="text-sm text-blue-200">Avg Risk Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="bg-slate-800/50 border-blue-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <History className="h-5 w-5 mr-2 text-blue-400" />
            Transaction History
          </CardTitle>
          <CardDescription className="text-blue-200">
            View and search your transaction analysis history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by merchant, location, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "fraudulent" ? "default" : "outline"}
                  onClick={() => setFilterStatus("fraudulent")}
                  size="sm"
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  Fraudulent
                </Button>
                <Button
                  variant={filterStatus === "legitimate" ? "default" : "outline"}
                  onClick={() => setFilterStatus("legitimate")}
                  size="sm"
                  className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                >
                  Legitimate
                </Button>
              </div>
              <Button onClick={handleExport} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-blue-200">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>

            {/* Transaction List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-blue-200">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No transactions found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <Card 
                    key={transaction.id} 
                    className="bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => onTransactionSelect?.(transaction)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white">{transaction.merchant}</h3>
                            <Badge 
                              variant={transaction.isGenuine ? "default" : "destructive"}
                              className={transaction.isGenuine ? "bg-green-600" : "bg-red-600"}
                            >
                              {transaction.isGenuine ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Legitimate
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Fraudulent
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="flex items-center text-blue-200">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatAmount(transaction.amount)}
                            </div>
                            <div className="flex items-center text-blue-200">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(transaction.timestamp)}
                            </div>
                            <div className="text-blue-200">
                              Risk: {transaction.riskScore}%
                            </div>
                            <div className="text-blue-200">
                              ID: {transaction.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 