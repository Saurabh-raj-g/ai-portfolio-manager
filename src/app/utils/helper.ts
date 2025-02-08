export const formatAddress = (address: string |null) => {
  if (!address) return "";
  return `${address.slice(0, 16)}...${address.slice(-6)}`;
};
