export const TESTNET_DOMAIN = {
  name: "SIGN FOR SELL",
  version: "1",
  chainId: 97,
  verifyingContract: "marketplaceContract",
};

export const TESTNET_CONFIG = {
  CHAIN_INFO: {
    chainId: "0x61",
    rpcUrls: ["https://data-seed-prebsc-2-s2.binance.org:8545"],
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: { name: "Binance", decimals: 18, symbol: "tBNB" },
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  GET_ORDER_INPUT: "getOrderInput",
  LISTING: "listing",
  BASE_URI: "http://localhost:4000/api/v1",
  EXCHANGE_ADDRESS: TESTNET_DOMAIN.verifyingContract,
  PURCHASE_BOX_ADDRESS: "0x04E59EC7496238578c65aAB9FBd91F59FF0d71A9",
  PURCHASE_TOKEN_ADDRESS: "0x79710EAcB353Fc236D784eCD6157A2d9385B4F7B",
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
