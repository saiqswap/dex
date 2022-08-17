export const domain = {
  name: "SIGN FOR SELL",
  version: "1",
  chainId: 56,
  verifyingContract: "marketplaceContract",
};

export const config = {
  CHAIN_INFO: {
    chainId: "0x38",
    rpcUrls: ["https://bscrpc.com"],
    chainName: "Binance Smart Chain",
    nativeCurrency: { name: "Binance", decimals: 18, symbol: "BNB" },
    blockExplorerUrls: ["https://bscscan.com"],
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
  PURCHASE_BOX_ADDRESS: "0xf02a2FA3D8fF904Ec5d970132465C6B104F64B71",
  PURCHASE_TOKEN_ADDRESS: "0xf02a2FA3D8fF904Ec5d970132465C6B104F64B71",
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
