'use client';
import { useState } from 'react';

interface TransactionInterfaceProps {
  account: string;
}
export default function TransactionInterface({ account }:TransactionInterfaceProps) {
  const [token, setToken] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddPosition = async () => {
    // Implement add position logic here
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Add Position</h2>
      <input
        type="text"
        placeholder="Token Address"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
      />
      <button
        onClick={handleAddPosition}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Position
      </button>
    </div>
  );
}
