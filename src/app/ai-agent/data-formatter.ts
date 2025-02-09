type RiskFactor = {
  name: string;
  description: string;
  weight: number;
};

type Asset = {
  symbol: string;
  risk_score: number;
  risk_factors: RiskFactor[];
};

type Risk = {
  assets: Asset[];
};

type Recommendation = {
  asset: string;
  signal: string;
  reason: string;
  suggested_action: string;
};

type FormattedData = {
  risk: Risk[];
  recommendation: Recommendation[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatData(input: any): FormattedData {
  const rawData = JSON.parse((Object.values(input)[0] as string).replace("json\n", ""));
  
  const formattedData: FormattedData = {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    risk: rawData.risk.map((r: any) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assets: r.assets.map((asset: any) => ({
        symbol: asset.symbol,
        risk_score: asset.risk_score, // Keep dynamic risk score
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        risk_factors: asset.risk_factors.map((factor: any) => ({
          name: factor.name,
          description: factor.description,
          weight: factor.weight
        }))
      }))
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recommendation: rawData.recommendation.map((rec: any) => ({
      asset: rec.asset,
      signal: rec.signal,
      reason: rec.reason,
      suggested_action: rec.suggested_action
    }))
  };
  return formattedData;
}
