import Moralis from 'moralis';

try {
  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjczOGFjMWMzLWFiOGQtNGM5Ny04MDRkLWNlNWY4MjA1MTAyMyIsIm9yZ0lkIjoiNDMwMDM3IiwidXNlcklkIjoiNDQyMzUyIiwidHlwZUlkIjoiZjhkMjQ2NzQtMDRiMS00NGEyLTllZmYtZDc2YjllOWRkMDM5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzg5NDQzNjYsImV4cCI6NDg5NDcwNDM2Nn0.6zFx6NESYRprgPKA2oFEd42A2RNwdFPvPp8ydavpGOE"
  });

  const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
    "chain": "0x14a33",
    "address": "0xA8177573fCe400b0ea0E23ec51482453332C8dBF"
  });

  console.log(response.raw);
} catch (e) {
  console.error(e);
}
