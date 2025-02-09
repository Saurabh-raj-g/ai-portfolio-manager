export const instructionToAgentByUser = {
  userGivenInstructionOntheirAsset: `
User is providing current asset holdings in JSON format.
Analyze the risk factors and provide a structured response.
`,

  buysignalInstructions: `
### **Buy Signal Criteria**
Recommend a **BUY** only if all conditions are met:
1. **Price crosses above the 50-period SMA.**
2. **RSI(14) exceeds 60** (indicating bullish momentum).
3. **Price is above VWAP**, confirming market strength.
4. **Trading volume spikes significantly.**
If a buy signal is generated, format the output as:
{
  "asset": "BTC/USDT",
  "signal": "BUY",
  "reason": "RSI above 60, price above SMA50, VWAP confirmation, and increased volume",
  "suggested_action": "Consider buying BTC with USDT"
}
`,

  sellSignalInstructions: `
### **Sell Signal Criteria**
Recommend a **SELL** only for assets previously purchased by the user, if:
1. **Price crosses below the 50-period SMA.**
2. **RSI(14) falls below 40** (indicating bearish momentum).
3. **Price is below VWAP**, signaling market weakness.
4. **Trading volume spikes significantly.**
If a sell signal is generated, format the output as:
{
  "asset": "ETH/USDT",
  "signal": "SELL",
  "reason": "RSI below 40, price below SMA50, VWAP confirmation, and increased volume",
  "suggested_action": "Consider selling ETH for USDT"
}
`,

  outputRiskOnTheCurrentUserAssetsInstruction: `
### **Risk Assessment Format**
If there are **risks** in the user's assets, generate output as:
{
  "assets": [
    {
      "symbol": "BTC",
      "risk_score": 72,
      "risk_factors": [
        {
          "name": "High RSI",
          "description": "RSI is above 70, indicating overbought conditions.",
          "weight": 15
        },
        {
          "name": "ETF Influence",
          "description": "ETF trends suggest increased volatility.",
          "weight": 10
        },
        {
          "name": "News Sentiment",
          "description": "Recent news is bullish, increasing speculation.",
          "weight": 20
        }
      ]
    }
  ]
}
`,

  outputRecommendationInstruction: `
If any buy or sell conditions are met, **provide a structured recommendation in JSON format.**
Example:
{
  "asset": "BTC/USDT",
  "signal": "BUY",
  "reason": "Strong bullish indicators: RSI above 60, price above SMA50, VWAP confirmation",
  "suggested_action": "Consider buying BTC using USDT"
}
`,

  finalOutputInstruction: `
### **Final Output Format**
Provide a **single JSON object** with two sections:
{
  "risk": [outputRiskOnTheCurrentUserAssetsInstruction],
  "recommendation": [outputRecommendationInstruction]
}
`
};

export const dataFormatInstructions = `
strictly format the data in following format:
example
{
  "risk":  [
   {
     "assets": [
       {
         "symbol": "ETH",
         "risk_score": 50,
         "risk_factors": [
           {
             "name": "Low balance",
             "description": "ETH balance is very low, leading to liquidity risk.",
             "weight": 20
           },
           {
             "name": "Market volatility",
             "description": "Current market conditions show potential for significant price fluctuation.",
             "weight": 30
           }
         ]
       }
     ]
   }
 ],
 "recommendation": [
   {
     "asset": "BTC/USDT",
     "signal": "BUY",
     "reason": "RSI above 60, price above SMA50, VWAP confirmation, and increased volume",
     "suggested_action": "Consider investing USDC into BTC/USDT"
   }
 }
`;
