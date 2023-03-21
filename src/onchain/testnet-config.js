export const TESTNET_DOMAIN = {
  name: "SIGN FOR SELL",
  version: "1",
  chainId: 97,
  verifyingContract: "marketplaceContract",
};

export const TESTNET_CONFIG = {
  CHAIN_INFO: {
    chainId: "0x61",
    rpcUrls: ["https://endpoints.omniatech.io/v1/bsc/testnet/public"],
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: { name: "Binance", decimals: 18, symbol: "tBNB" },
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  LISTING_PARAMS: (message) => ({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Detail: [
        { name: "tokenId", type: "uint256" },
        { name: "tokenContract", type: "address" },
        { name: "price", type: "uint256" },
        { name: "decimals", type: "uint256" },
        { name: "paymentContract", type: "address" },
        { name: "foundationFeePercent", type: "uint256" },
      ],
    },
    primaryType: "Detail",
    domain: TESTNET_DOMAIN,
    message: {
      ...message,
    },
  }),
};
