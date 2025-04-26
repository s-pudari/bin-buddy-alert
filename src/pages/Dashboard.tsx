
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBinData } from "@/context/BinDataContext";
import BinLevelGauge from "@/components/BinLevelGauge";
import { RefreshCw, LogOut, Gauge, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { bins, loading, refreshData } = useBinData();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Check for bins over threshold and show toast notification
  useEffect(() => {
    const alertThreshold = 69;
    const binsOverThreshold = bins.filter(bin => bin.fillPercentage >= alertThreshold);
    
    if (binsOverThreshold.length > 0) {
      binsOverThreshold.forEach(bin => {
        toast({
          title: `Alert: ${bin.name}`,
          description: `Fill level at ${bin.fillPercentage}% - Bin needs emptying!`,
          variant: "destructive",
        });
      });
    }
  }, [bins, toast]);

  // Calculate statistics
  const totalBins = bins.length;
  const binsNeedingAttention = bins.filter(bin => bin.fillPercentage >= 69).length;
  const averageFillLevel = bins.length > 0
    ? Math.round(bins.reduce((acc, bin) => acc + bin.fillPercentage, 0) / bins.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Gauge className="mr-2 h-8 w-8 text-blue-600" />
              Bin Buddy Alert
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || 'User'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Bins</CardDescription>
              <CardTitle>{totalBins}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Fill Level</CardDescription>
              <CardTitle>{averageFillLevel}%</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className={binsNeedingAttention > 0 ? "bg-red-50 border-red-200" : ""}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                {binsNeedingAttention > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                Bins Needing Attention
              </CardDescription>
              <CardTitle className={binsNeedingAttention > 0 ? "text-red-600" : ""}>
                {binsNeedingAttention}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        {/* Bins Grid */}
        <h2 className="text-xl font-semibold mb-4">Bin Status</h2>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bins.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p>No bins found. Add bins to start monitoring.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bins.map((bin) => (
              <BinLevelGauge
                key={bin.id}
                fillPercentage={bin.fillPercentage}
                name={bin.name}
                alertThreshold={69}
              />
            ))}
          </div>
        )}
        
        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
