import { BalanceData } from '@/app/types';

export const BalanceInfo = ({ balance }: { balance: BalanceData }) => {
  return (
    <>
      <h3 className="text-2xl font-bold mb-4">ETH : {balance.ethBalance}</h3>
      <ul>
        {balance.tokens.map((b) => (
          <li key={b.tokenMetadata.symbol}>
            {b.tokenMetadata.symbol}: {b.hrBalance} {b.tokenMetadata.name} ({b.balance})
          </li>
        ))}
      </ul>
    </>
  )
}