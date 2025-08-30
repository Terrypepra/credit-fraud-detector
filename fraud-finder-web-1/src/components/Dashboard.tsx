// Dashboard.tsx - Analytics Dashboard for Credit Fraud Detector
// -------------------------------------------------------------
// This component displays key metrics and charts for transaction analytics.
// Refined for clarity, maintainability, and a human touch.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/services/fraudDetectionService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Activity, DollarSign } from "lucide-react";

interface DashboardProps {
  transactions: Transaction[];
}

// Utility: Card style for dashboard sections
const dashboardCardClass =
  "bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl";

export const Dashboard = ({ transactions }: DashboardProps) => {
  // Handle empty state
  if (transactions.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={dashboardCardClass}>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-16 w-16 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
            <p className="text-blue-200 text-center">
              Analyze some transactions to see dashboard analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate metrics
  const totalTransactions = transactions.length;
  // Typo fix: isGeunine -> isGenuine
  const fraudulentTransactions = transactions.filter(t => !t.isGenuine).length;
  const legitimateTransactions = totalTransactions - fraudulentTransactions;
  const fraudRate = (fraudulentTransactions / totalTransactions) * 100;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const fraudAmount = transactions.filter(t => !t.isGenuine).reduce((sum, t) => sum + t.amount, 0);

  // Prepare chart data
  const riskDistribution = [
    { name: 'Low Risk (0-25)', value: transactions.filter(t => t.riskScore <= 25).length, color: '#10B981' },
    { name: 'Medium Risk (26-50)', value: transactions.filter(t => t.riskScore > 25 && t.riskScore <= 50).length, color: '#F59E0B' },
    { name: 'High Risk (51-75)', value: transactions.filter(t => t.riskScore > 50 && t.riskScore <= 75).length, color: '#EF4444' },
    { name: 'Critical Risk (76-100)', value: transactions.filter(t => t.riskScore > 75).length, color: '#DC2626' },
  ];

  const transactionStatus = [
    { name: 'Legitimate', value: legitimateTransactions, color: '#10B981' },
    { name: 'Fraudulent', value: fraudulentTransactions, color: '#EF4444' },
  ];

  // Group by hour for time analysis
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourTransactions = transactions.filter(t => {
      const transactionHour = new Date(t.timestamp).getHours();
      return transactionHour === hour;
    });
    return {
      hour: `${hour}:00`,
      total: hourTransactions.length,
      fraud: hourTransactions.filter(t => !t.isGenuine).length,
    };
  }).filter(data => data.total > 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-600/30 card-shadow rounded-xl hover:scale-[1.02] transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-white">{totalTransactions}</p>
                <p className="text-blue-300 text-xs mt-1">All time</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-full shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Rate */}
        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-600/30 card-shadow rounded-xl hover:scale-[1.02] transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Fraud Rate</p>
                <p className="text-3xl font-bold text-white">{fraudRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-red-400 mr-1" />
                  <p className="text-red-300 text-xs">{fraudulentTransactions} fraudulent</p>
                </div>
              </div>
              <div className="p-3 bg-red-600 rounded-full shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Volume */}
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-600/30 card-shadow rounded-xl hover:scale-[1.02] transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Total Volume</p>
                <p className="text-3xl font-bold text-white">${totalAmount.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                  <p className="text-green-300 text-xs">Protected</p>
                </div>
              </div>
              <div className="p-3 bg-green-600 rounded-full shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Amount */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-600/30 card-shadow rounded-xl hover:scale-[1.02] transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Fraud Amount</p>
                <p className="text-3xl font-bold text-white">${fraudAmount.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-purple-400 mr-1" />
                  <p className="text-purple-300 text-xs">Blocked</p>
                </div>
              </div>
              <div className="p-3 bg-purple-600 rounded-full shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Status Pie Chart */}
        <Card className={dashboardCardClass}>
          <CardHeader>
            <CardTitle className="text-white">Transaction Status Distribution</CardTitle>
            <CardDescription className="text-blue-200">
              Breakdown of legitimate vs fraudulent transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transactionStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Score Bar Chart */}
        <Card className={dashboardCardClass}>
          <CardHeader>
            <CardTitle className="text-white">Risk Score Distribution</CardTitle>
            <CardDescription className="text-blue-200">
              Transaction count by risk level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#93c5fd', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#93c5fd' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Analysis Line Chart */}
      {hourlyData.length > 0 && (
        <Card className={dashboardCardClass}>
          <CardHeader>
            <CardTitle className="text-white">Hourly Transaction Analysis</CardTitle>
            <CardDescription className="text-blue-200">
              Transaction volume and fraud detection by hour of day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" tick={{ fill: '#93c5fd' }} />
                <YAxis tick={{ fill: '#93c5fd' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Total Transactions"
                />
                <Line 
                  type="monotone" 
                  dataKey="fraud" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Fraudulent Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
