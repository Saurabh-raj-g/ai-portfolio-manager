'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApplicationState } from '../providers/application-state-provider';
import { useAccount } from 'wagmi';
import { useUserAsset } from '../hooks/user-asset';
import { TokenHolding } from '../types/Index';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Chain from '../value-objects/chain';

const AIRecommendations= () => {
  const {tokenHoldings} = useApplicationState();
  const [prevTokenHoldings, setPrevTokenHolding] = useState<TokenHolding[]>([]);
  const { address, chainId } = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aiData, setAiData] = useState<any>({});
  const { getAiRiskRecommendations, fetchCdpWalletData, fetchSignature, fetchStoredChainId } = useUserAsset();
  
  const tokenHoldingsChanged = JSON.stringify(tokenHoldings) !== JSON.stringify(prevTokenHoldings)
  console.log("tokenHoldingsChanged", tokenHoldings.length, prevTokenHoldings.length, tokenHoldingsChanged);
  useEffect(() => {
    const getAIRecommendation = async () => {
      const chain = Chain.fromUniqueProperty<Chain>("chainId", chainId+"");
      if(!chain.isBase()|| chain.isUnknown()) return;
      if (address && tokenHoldings.length > 0 && tokenHoldingsChanged) {
        setPrevTokenHolding(tokenHoldings);
        const cdpWalletData = fetchCdpWalletData(chain.getChainId()+"",address);
        const signature = fetchSignature(chain.getChainId()+"",address);
        const storedChain = fetchStoredChainId(chain.getChainId()+"",address);
        if(!cdpWalletData || !signature || !storedChain) return;
        try {
          const data = await getAiRiskRecommendations(address, signature, storedChain, cdpWalletData);
         
          setAiData(data);
        } catch (error) {
          console.error("Error fetching portfolio:", error);
        }
      }
    };

    getAIRecommendation();
  }, [fetchSignature, address, fetchCdpWalletData, chainId, getAiRiskRecommendations, fetchStoredChainId, tokenHoldings, tokenHoldingsChanged]);
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderContent = (content: any) => {
    if (typeof content === 'string' || typeof content === 'number') {
      return <p className="text-gray-700">{content}</p>;
    } else if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside">
          {content.map((item, index) => (
            <li key={index} className="text-gray-700">{renderContent(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <span className="font-semibold text-gray-900">{key}: </span>
              {renderContent(value)}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    // <motion.div
    //   initial={{ opacity: 0, y: 20 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.5 }}
    //   className="bg-gradient-to-r from-teal-400 to-blue-500 p-8 rounded-xl shadow-2xl"
    // >
    //   <h2 className="text-3xl font-bold mb-6 text-white">AI Recommendations</h2>
    //   <motion.div
    //     initial={{ opacity: 0, scale: 0.95 }}
    //     animate={{ opacity: 1, scale: 1 }}
    //     transition={{ duration: 0.3, delay: 0.2 }}
    //     className="bg-white rounded-lg p-6 shadow-lg"
    //   >
    //     {renderContent(aiData)}
    //   </motion.div>
    // </motion.div>

    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-xl shadow-2xl"
  >
    <h2 className="text-3xl font-bold mb-6 text-white">AI Recommendations</h2>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-lg overflow-auto max-h-[70vh]"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-6 mb-4 text-indigo-700" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-xl font-semibold mt-4 mb-2 text-purple-600" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-gray-700" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-2 text-gray-700" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
          code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md overflow-hidden my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 rounded px-1 py-0.5 text-sm" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {JSON.stringify(aiData)}
      </ReactMarkdown>
    </motion.div>
  </motion.div>
  );
};

export default AIRecommendations;

