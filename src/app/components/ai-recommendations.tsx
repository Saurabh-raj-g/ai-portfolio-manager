'use client';

import { Position } from "@/app/types/Index";

interface AIRecommendationsProps {
  portfolio: Position[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AIRecommendations({ portfolio }:AIRecommendationsProps) {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
      {/* Add AI recommendations here */}
    </div>
  );
}
