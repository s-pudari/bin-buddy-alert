
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BinLevelGaugeProps {
  fillPercentage: number;
  name: string;
  alertThreshold?: number;
}

const BinLevelGauge: React.FC<BinLevelGaugeProps> = ({
  fillPercentage,
  name,
  alertThreshold = 69,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertAnimationClass, setAlertAnimationClass] = useState("");
  
  // Determine color based on fill percentage
  const getColor = (percentage: number) => {
    if (percentage < 40) return "bg-bin-low";
    if (percentage < alertThreshold) return "bg-bin-medium";
    return "bg-bin-high";
  };

  useEffect(() => {
    if (fillPercentage >= alertThreshold) {
      setShowAlert(true);
      setAlertAnimationClass("animate-pulse-alert");
    } else {
      setShowAlert(false);
      setAlertAnimationClass("");
    }
  }, [fillPercentage, alertThreshold]);

  // Calculate remaining space
  const remainingSpace = 100 - fillPercentage;

  // Render bin graphic
  const renderBin = () => (
    <div className="relative w-20 h-32 mx-auto">
      {/* Bin container */}
      <div className="absolute inset-0 border-2 border-gray-400 rounded-sm rounded-t-none overflow-hidden">
        {/* Fill level - dynamic height based on percentage */}
        <div 
          style={{ height: `${fillPercentage}%` }} 
          className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ease-in-out ${getColor(fillPercentage)}`}
        />
      </div>
      
      {/* Bin top rim */}
      <div className="absolute top-0 left-0 right-0 h-3 transform -translate-y-2 border-2 border-gray-400 rounded-sm" />
    </div>
  );

  return (
    <div className={cn(
      "p-6 rounded-lg shadow-md bg-white transition-all",
      showAlert ? "ring-2 ring-red-400" : ""
    )}>
      <div className="flex flex-col items-center">
        <h3 className="font-medium text-lg mb-2">{name}</h3>
        
        <div className="flex items-center justify-center mb-4">
          {renderBin()}
        </div>
        
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Fill Level</span>
            <span 
              className={cn(
                "font-bold",
                fillPercentage < 40 ? "text-bin-low" : 
                fillPercentage < alertThreshold ? "text-bin-medium" : 
                "text-bin-high"
              )}
            >
              {fillPercentage}%
            </span>
          </div>
          
          <Progress 
            value={fillPercentage} 
            className="h-3"
            indicatorClassName={getColor(fillPercentage)}
          />
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        {showAlert && (
          <div className={`flex items-center gap-1.5 text-bin-high mt-4 ${alertAnimationClass}`}>
            <AlertTriangle size={16} />
            <span className="font-medium">Bin needs attention!</span>
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-4">
          <span>Remaining capacity: {remainingSpace}%</span>
        </div>
      </div>
    </div>
  );
};

export default BinLevelGauge;
