export const MAINNET_DOMAIN = {
  name: "SIGN FOR SELL",
  version: "1",
  chainId: 56,
  verifyingContract: "marketplaceContract",
};

export const MAINNET_CONFIG = {
  CHAIN_INFO: {
    chainId: "0x38",
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: { name: "Binance", decimals: 18, symbol: "BNB" },
    blockExplorerUrls: ["https://bscscan.com"],
  },
  GET_ORDER_INPUT: "getOrderInput",
  LISTING: "listing",
  BASE_URI: "http://localhost:4000/api/v1",
  EXCHANGE_ADDRESS: MAINNET_DOMAIN.verifyingContract,
  PURCHASE_BOX_ADDRESS: "0xf02a2FA3D8fF904Ec5d970132465C6B104F64B71",
  PURCHASE_TOKEN_ADDRESS: "0xf02a2FA3D8fF904Ec5d970132465C6B104F64B71",
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
    domain: MAINNET_DOMAIN,
    message: {
      ...message,
    },
  }),
};
