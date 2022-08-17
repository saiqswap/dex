export const domain = {
  name: "SIGN FOR SELL",
  version: "1",
  chainId: 97,
  verifyingContract: "marketplaceContract",
};

export const config = {
  CHAIN_INFO: {
    chainId: "0x61",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: { name: "Binance", decimals: 18, symbol: "BNB" },
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  // CHAIN_INFO: {
  //   chainId: "0x61",
  //   rpcUrls: [
  //     "https://speedy-nodes-nyc.moralis.io/87193da02cc482fe925a274d/bsc/testnet",
  //   ],
  //   chainName: "BSC Testnet",
  //   nativeCurrency: { name: "Binance", decimals: 18, symbol: "TBNB" },
  //   blockExplorerUrls: ["https://testnet.bscscan.com"],
  // },
  GET_ORDER_INPUT: "getOrderInput",
  LISTING: "listing",
  BASE_URI: "http://localhost:4000/api/v1",
  EXCHANGE_ADDRESS: domain.verifyingContract,
  PURCHASE_BOX_ADDRESS: "0x04E59EC7496238578c65aAB9FBd91F59FF0d71A9",
  PURCHASE_TOKEN_ADDRESS: "0x79710EAcB353Fc236D784eCD6157A2d9385B4F7B",
  LOGIN_MESSAGE: "This is sign message",
  // LISTING_PARAMS: (message) => {
  //     return {
  //         types: {
  //             EIP712Domain: [
  //                 { name: "name", type: "string"},
  //                 { name: "version", type: "string"},
  //                 { name: 'chainId', type: 'uint256' },
  //                 { name: 'verifyingContract', type: 'address' }
  //             ],
  //             Detail: [
  //                 { name: 'tokenId', type: 'uint256' },
  //                 { name: 'tokenContract', type: 'address' },
  //                 { name: 'price', type: 'uint256' },
  //                 { name: 'decimals', type: 'uint256' },
  //                 { name: 'paymentContract', type: 'address' },
  //                 { name: 'foundationFeePercent', type: 'uint256' },
  //                 { name: 'royaltyFeePercent', type: 'uint256' },
  //                 { name: 'tokenCreator', type: 'address' }
  //             ],
  //             Order: [
  //                 { name: 'more', type: 'Detail' },
  //             ],
  //         },
  //         primaryType: "Order",
  //         domain,
  //         message
  //     }
  // }
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
    domain,
    message: {
      ...message,
    },
  }),
};
