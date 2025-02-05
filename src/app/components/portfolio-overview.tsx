'use client';
import { Position } from "@/app/types/Index";

interface PortfolioOverviewProps {
  portfolio: Position[]
}
export default function PortfolioOverview({ portfolio }:PortfolioOverviewProps) {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
      {/* Add portfolio visualization here */}
      {/* {portfolio} */}
    </div>
  );
}
