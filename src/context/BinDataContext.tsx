
import React, { createContext, useContext, useState, useEffect } from "react";
import { BinData } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface BinDataContextType {
  bins: BinData[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const BinDataContext = createContext<BinDataContextType | undefined>(undefined);

export const BinDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<BinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBinData = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would fetch data from an API
      // For this demo, we'll generate mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data
      const mockBins: BinData[] = [
        {
          id: "1",
          name: "Main Building Bin",
          location: "Floor 1",
          fillPercentage: Math.floor(Math.random() * 100),
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Cafeteria Bin",
          location: "Dining Area",
          fillPercentage: Math.floor(Math.random() * 100),
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Office Bin",
          location: "Room 203",
          fillPercentage: Math.floor(Math.random() * 100),
          lastUpdated: new Date().toISOString(),
        },
      ];
      
      setBins(mockBins);
      setError(null);
    } catch (err) {
      console.error("Error fetching bin data:", err);
      setError("Failed to fetch bin data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch bin data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBinData();
    
    // Setup periodic data refresh (every 10 seconds)
    const intervalId = setInterval(() => {
      fetchBinData();
    }, 10000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <BinDataContext.Provider
      value={{
        bins,
        loading,
        error,
        refreshData: fetchBinData,
      }}
    >
      {children}
    </BinDataContext.Provider>
  );
};

export const useBinData = () => {
  const context = useContext(BinDataContext);
  if (context === undefined) {
    throw new Error("useBinData must be used within a BinDataProvider");
  }
  return context;
};
