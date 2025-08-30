// ModelEvaluation.tsx - ML Model Performance Overview
// --------------------------------------------------
// Displays model info, metrics, confusion matrix, and feature importance.
// Refined for clarity, maintainability, and a human touch.

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fraudDetectionService, ModelInfo, ModelEvaluation as ModelEvaluationData } from "@/services/fraudDetectionService";
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

export const ModelEvaluation = () => {
  // State for model info and evaluation
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [evaluation, setEvaluation] = useState<ModelEvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch model info and evaluation on mount
  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true);
        const [info, evalData] = await Promise.all([
          fraudDetectionService.getModelInfo(),
          fraudDetectionService.getModelEvaluation()
        ]);
        setModelInfo(info);
        setEvaluation(evalData);
      } catch (err) {
        setError('Failed to load model evaluation data');
        console.error('Error fetching model data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModelData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
          <span className="text-blue-200">Loading model evaluation...</span>
        </CardContent>
      </Card>
    );
  }
  // Error state
  if (error) {
    return (
      <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
        <CardContent className="flex items-center justify-center py-12">
          <AlertTriangle className="h-8 w-8 text-red-400 mr-3" />
          <span className="text-red-400">{error}</span>
        </CardContent>
      </Card>
    );
  }

  // Utility: color for metric value
  const getMetricColor = (value: number) => {
    if (value >= 0.9) return "text-green-400";
    if (value >= 0.8) return "text-yellow-400";
    return "text-red-400";
  };
  // Utility: badge color for metric
  const getMetricBadgeColor = (value: number) => {
    if (value >= 0.9) return "bg-green-600 text-white";
    if (value >= 0.8) return "bg-yellow-600 text-black";
    return "bg-red-600 text-white";
  };

  return (
    <div className="space-y-6">
      {/* Model Information */}
      <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            Model Information
          </CardTitle>
          <CardDescription className="text-blue-200">
            Details about the trained machine learning model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Model Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Name:</span>
                    <span className="text-white">{modelInfo?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Type:</span>
                    <span className="text-white">{modelInfo?.modelType || 'RandomForest'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Features:</span>
                    <span className="text-white">{modelInfo?.featureCount || 30}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Status:</span>
                    <Badge className="bg-green-600 text-white">
                      {modelInfo?.status || 'Active'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Accuracy:</span>
                    <Badge className={getMetricBadgeColor(modelInfo?.accuracy || 0)}>
                      {modelInfo?.accuracy || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Precision:</span>
                    <Badge className={getMetricBadgeColor(modelInfo?.precision || 0)}>
                      {modelInfo?.precision || 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Recall:</span>
                    <Badge className={getMetricBadgeColor(modelInfo?.recall || 0)}>
                      {modelInfo?.recall || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Detailed Evaluation */}
      {evaluation && (
        <Card className="bg-slate-800/50 border-blue-800/30 card-shadow rounded-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Detailed Model Evaluation
            </CardTitle>
            <CardDescription className="text-blue-200">
              Comprehensive performance metrics and confusion matrix
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Metrics */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className={`text-2xl font-bold ${getMetricColor(evaluation.accuracy)}`}>
                      {(evaluation.accuracy * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-200">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className={`text-2xl font-bold ${getMetricColor(evaluation.precision)}`}>
                      {(evaluation.precision * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-200">Precision</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className={`text-2xl font-bold ${getMetricColor(evaluation.recall)}`}>
                      {(evaluation.recall * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-200">Recall</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className={`text-2xl font-bold ${getMetricColor(evaluation.f1Score)}`}>
                      {(evaluation.f1Score * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-200">F1 Score</div>
                  </div>
                </div>
              </div>
              {/* Confusion Matrix */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Confusion Matrix</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-green-900/20 rounded-lg">
                    <div className="text-xl font-bold text-green-400">
                      {evaluation.confusionMatrix.trueNegatives.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-300">True Negatives</div>
                  </div>
                  <div className="text-center p-3 bg-red-900/20 rounded-lg">
                    <div className="text-xl font-bold text-red-400">
                      {evaluation.confusionMatrix.falsePositives.toLocaleString()}
                    </div>
                    <div className="text-xs text-red-300">False Positives</div>
                  </div>
                  <div className="text-center p-3 bg-red-900/20 rounded-lg">
                    <div className="text-xl font-bold text-red-400">
                      {evaluation.confusionMatrix.falseNegatives.toLocaleString()}
                    </div>
                    <div className="text-xs text-red-300">False Negatives</div>
                  </div>
                  <div className="text-center p-3 bg-green-900/20 rounded-lg">
                    <div className="text-xl font-bold text-green-400">
                      {evaluation.confusionMatrix.truePositives.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-300">True Positives</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Feature Importance */}
            {evaluation.featureImportance && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-4">Top Feature Importance</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {evaluation.featureImportance
                    .sort((a, b) => b.importance - a.importance)
                    .slice(0, 10)
                    .map((item) => (
                      <div key={item.feature} className="text-center p-3 bg-slate-700/30 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">
                          {(item.importance * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-blue-200">{item.feature}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 