import { config } from ".";

export const ACCESS_TOKEN_KEY = "CBt3gpbqeMdWPNG1";
export const SCOPES_KEY = "AhBcmvr1EkMdPnL5";
export const DEFAULT_PROJECT_TITLE = `NFT Marketplace - Create and sell digital collectibles secured with blockchain`;
export const LOGIN_MESSAGE = "This is sign message";
export const RI_SLOT_LIMIT = 6;
export const ADDRESS_0 = "0x0000000000000000000000000000000000000000";
export const CAPTCHA_KEY = config.CAPTCHA_KEY;
export const GOOGLE_SIGN_IN_CLIENT_KEY = config.GOOGLE_SIGN_IN_CLIENT_KEY;
export const PRE_SALE_TOKEN = "ING";
export const SUPPORT_TOKENS = [
  {
    contractAddress: ADDRESS_0,
    asset: "BNB",
  },
  {
    contractAddress: `0x55d398326f99059fF775485246999027B3197955`,
    // contractAddress: "0xaB45dE984925d49CC189Ed734Ec628091D1C7918", //testnet
    asset: "USDT",
    decimals: 18,
    image: "https://marketplace.megdev.co/images/coins/USDT.png",
  },
  {
    contractAddress: `0xAe7c682Ba26AD6835B6150FfB35F22Db9987f509`,
    // contractAddress: `0xeF92cc5adcF971f7C2976131B4Fe3E2000Df53a7`, //testnet
    asset: "ING",
    decimals: 18,
    image: "https://marketplace.megdev.co/images/coins/ING.png",
  },
  // {
  //   contractAddress: `0x1d996E6A143F8581690f4CFCE44345c29ABB0c8c`,
  //   asset: "INC",
  //   decimals: 18,
  //   image: "https://marketplace.megdev.co/images/coins/INC.png",
  // },
];
export const PRE_SALE_ROUNDS = [
  {
    key: 0,
    roundId: `0x1000000000000000000000000000000000000000`,
    name: `${PRE_SALE_TOKEN} Token OG Pre-sale`,
    notices: ["PRESALE_ROUND_O_TIME", "PRESALE_ROUND_0_VESTING_INFORMATION"],
    time: "19:00 ~ 23:00 September 17, 2022 (UTC+9)",
    totalSupply: 2857142.86,
    currentSold: 0,
    USDPrice: 0.0141,
    startAt: 1663408800,
    endAt: 1663423200,
    minUSD: 400,
    isSync: true,
    isStaticEnd: true,
  },
  {
    key: 1,
    roundId: `0x1000000000000000000000000000000000000001`,
    name: `${PRE_SALE_TOKEN} Token Pre-sale Round 1`,
    notices: ["PRESALE_ROUND_1_TIME", "PRESALE_ROUND_1_VESTING_INFORMATION"],
    time: "19:00 September 20 ~ 23:00 September 21, 2022 (UTC+9)",
    totalSupply: 33333333.3,
    currentSold: 0,
    USDPrice: 0.015,
    startAt: 1663668000,
    endAt: 1663768800,
    minUSD: 800,
    isSync: true,
    isStaticEnd: true,
  },
  {
    key: 2,
    roundId: `0x1000000000000000000000000000000000000002`,
    name: `${PRE_SALE_TOKEN} Token Pre-sale Round 2`,
    notices: [
      "PRESALE_ROUND_2_TIME",
      "PRESALE_ROUND_2_BENEFIT",
      "PRESALE_ROUND_2_VESTING_INFORMATION",
    ],
    time: "15:00 September 23 ~ 23:00 September 27, 2022 (UTC+9)",
    totalSupply: 93750000,
    currentSold: 0,
    USDPrice: 0.016,
    startAt: 1663912800,
    endAt: 1664287200,
    isSync: false,
  },
  // {
  //   key: 3,
  //   roundId: `0x2000000000000000000000000000000000000000`,
  //   name: `${PRE_SALE_TOKEN} Token Pre-sale Round 3`,
  //   notices: [
  //     "PRESALE_ROUND_3_TIME",
  //     "PRESALE_ROUND_3_BENEFIT",
  //     "PRESALE_ROUND_3_VESTING_INFORMATION",
  //   ],
  //   time: "19:00 September 29 ~ 23:00 October 6, 2022 (UTC+9)",
  //   staticTotalSupply: 88235294.1,
  //   staticPrice: 0.017,
  //   isSync: true,
  // },
];
export const ERROR = {
  INSUFFICIENT_FUNDS: "Insufficient funds ",
  RI_SLOT_IS_OVER: "R-I slot is over",
};
export const ranks = {
  BEGINNER: {
    title: "BEGINNER",
    image: "/assets/ranks/Rank-1.png",
    friendCondition: 0,
  },
  TALENTED: {
    title: "TALENTED",
    image: "/assets/ranks/Rank-2.png",
    friendCondition: 5,
  },
  ADVANCED: {
    title: "ADVANCED",
    image: "/assets/ranks/Rank-3.png",
    friendCondition: 10,
  },
  EXERT: {
    title: "EXERT",
    image: "/assets/ranks/Rank-4.png",
    friendCondition: 20,
  },
  LEGENDARY: {
    title: "LEGENDARY",
    image: "/assets/ranks/Rank-5.png",
    friendCondition: 50,
  },
  ALMIGHTY: {
    title: "Almighty",
    image: "/assets/ranks/Rank-6.png",
    friendCondition: 100,
  },
};
const staticMintingStartTime = 1664100000000;
const staticMintingEndTime = 1664200800000;

export const STATIC_MINTING_BOXES = [
  {
    roundNumber: 1,
    items: [
      {
        id: 48,
        location: "GLOBAL",
        useWhitelist: false,
        boxType: "ANGEL",
        paymentContract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        paymentCurrency: "USDT",
        unitPrice: 100,
        supply: 800,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 10,
      },
      {
        id: 53,
        location: "GLOBAL",
        useWhitelist: false,
        boxType: "MINION_PARTS_COMMON",
        paymentContract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        paymentCurrency: "USDT",
        unitPrice: 50,
        supply: 400,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 100,
        maxOrder: 1,
      },
      {
        id: 54,
        location: "GLOBAL",
        useWhitelist: false,
        boxType: "MINION_PARTS_EPIC",
        paymentContract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        paymentCurrency: "USDT",
        unitPrice: 60,
        supply: 400,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 10,
      },
      {
        id: 55,
        location: "GLOBAL",
        useWhitelist: false,
        boxType: "COSTUME_COMMON",
        paymentContract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        paymentCurrency: "USDT",
        unitPrice: 50,
        supply: 400,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 10,
      },
      {
        id: 56,
        location: "GLOBAL",
        useWhitelist: false,
        boxType: "COSTUME_EPIC",
        paymentContract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        paymentCurrency: "USDT",
        unitPrice: 60,
        supply: 400,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 10,
      },
    ],
  },
];
export const STATIC_MINTING_COMBOS = [
  {
    roundNumber: 1,
    items: [
      {
        id: 1,
        name: "COMBO_1",
        location: "GLOBAL",
        useWhitelist: false,
        products: [
          {
            product: {
              boxType: "ANGEL",
            },
          },
          {
            product: {
              boxType: "MINION_PARTS_COMMON",
            },
          },
          {
            product: {
              boxType: "COSTUME_COMMON",
            },
          },
        ],
        paymentContract: "0x0000000000000000000000000000000000000000",
        paymentCurrency: "USDT",
        unitPrice: 200,
        supply: 800,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 30,
        roundNumber: 1,
      },
      {
        id: 2,
        name: "COMBO_2",
        location: "GLOBAL",
        useWhitelist: false,
        products: [
          {
            product: {
              boxType: "ANGEL",
            },
          },
          {
            product: {
              boxType: "MINION_PARTS_EPIC",
            },
          },
          {
            product: {
              boxType: "COSTUME_COMMON",
            },
          },
        ],
        paymentContract: "0x0000000000000000000000000000000000000000",
        paymentCurrency: "USDT",
        unitPrice: 210,
        supply: 800,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 30,
        roundNumber: 1,
      },
      {
        id: 3,
        name: "COMBO_3",
        location: "GLOBAL",
        useWhitelist: false,
        products: [
          {
            product: {
              boxType: "ANGEL",
            },
          },
          {
            product: {
              boxType: "MINION_PARTS_COMMON",
            },
          },
          {
            product: {
              boxType: "COSTUME_EPIC",
            },
          },
        ],
        paymentContract: "0x0000000000000000000000000000000000000000",
        paymentCurrency: "USDT",
        unitPrice: 210,
        supply: 800,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 30,
        roundNumber: 1,
      },
      {
        id: 4,
        name: "COMBO_4",
        location: "GLOBAL",
        useWhitelist: false,
        products: [
          {
            product: {
              boxType: "ANGEL",
            },
          },
          {
            product: {
              boxType: "MINION_PARTS_EPIC",
            },
          },
          {
            product: {
              boxType: "COSTUME_EPIC",
            },
          },
        ],
        paymentContract: "0x0000000000000000000000000000000000000000",
        paymentCurrency: "USDT",
        unitPrice: 220,
        supply: 800,
        available: 0,
        startTime: staticMintingStartTime,
        endTime: staticMintingEndTime,
        isActive: true,
        minOrder: 1,
        maxOrder: 30,
        roundNumber: 1,
      },
    ],
  },
];
export const BoxType = {
  ANGEL: {
    value: "ANGEL",
    image: "/images/boxes/box-1.png",
    card: "/images/boxes/box-card-1.png",
    light: "/images/boxes/box-card-1-1.png",
    color: "#F6B323",
    rate: [
      {
        name: "Tier 1",
        rate: 35.27,
      },
      {
        name: "Tier 2",
        rate: 23.56,
      },
      {
        name: "Tier 3",
        rate: 19.05,
      },
      {
        name: "Tier 4",
        rate: 13.8,
      },
      {
        name: "Tier 5",
        rate: 8.32,
      },
    ],
  },
  MINION_PARTS_EPIC: {
    value: "MINION_PARTS_EPIC",
    image: "/images/boxes/box-2.png",
    card: "/images/boxes/box-card-2.png",
    light: "/images/boxes/box-card-2-1.png",
    color: "#5EDCD1",
    rate: [
      {
        name: "Tier 1",
        rate: 2,
      },
      {
        name: "Tier 2",
        rate: 5.2,
      },
      {
        name: "Tier 3",
        rate: 39.9,
      },
      {
        name: "Tier 4",
        rate: 29.6,
      },
      {
        name: "Tier 5",
        rate: 23.3,
      },
    ],
  },
  MINION_PARTS_COMMON: {
    value: "MINION_PARTS_COMMON",
    image: "/images/boxes/box-3.png",
    card: "/images/boxes/box-card-3.png",
    light: "/images/boxes/box-card-3-1.png",
    color: "#A1DF70",
    rate: [
      {
        name: "Tier 1",
        rate: 38.4,
      },
      {
        name: "Tier 2",
        rate: 26.6,
      },
      {
        name: "Tier 3",
        rate: 18.9,
      },
      {
        name: "Tier 4",
        rate: 10.6,
      },
      {
        name: "Tier 5",
        rate: 5.5,
      },
    ],
  },
  COSTUME_EPIC: {
    value: "COSTUME_EPIC",
    image: "/images/boxes/box-4.png",
    card: "/images/boxes/box-card-4.png",
    light: "/images/boxes/box-card-4-1.png",
    color: "#FC7090",
    rate: [
      {
        name: "Tier 1",
        rate: 2,
      },
      {
        name: "Tier 2",
        rate: 5.2,
      },
      {
        name: "Tier 3",
        rate: 39.9,
      },
      {
        name: "Tier 4",
        rate: 29.6,
      },
      {
        name: "Tier 5",
        rate: 23.3,
      },
    ],
  },
  COSTUME_COMMON: {
    value: "COSTUME_COMMON",
    image: "/images/boxes/box-5.png",
    card: "/images/boxes/box-card-5.png",
    light: "/images/boxes/box-card-5-1.png",
    color: "#8F61BE",
    rate: [
      {
        name: "Tier 1",
        rate: 38.4,
      },
      {
        name: "Tier 2",
        rate: 26.6,
      },
      {
        name: "Tier 3",
        rate: 18.9,
      },
      {
        name: "Tier 4",
        rate: 10.6,
      },
      {
        name: "Tier 5",
        rate: 5.5,
      },
    ],
  },
};
export const MINTING_COMBOS = {
  COMBO_1: {
    value: "Compo 1",
    image: "/images/boxes/combo-1.png",
    color: "#1588d6",
  },
  COMBO_2: {
    value: "Compo 2",
    image: "/images/boxes/combo-2.png",
    color: "#1588d6",
  },
  COMBO_3: {
    value: "Compo 3",
    image: "/images/boxes/combo-3.png",
    color: "#1588d6",
  },
  COMBO_4: {
    value: "Compo 4",
    image: "/images/boxes/combo-4.png",
    color: "#1588d6",
  },
};

export const Angels = {
  ALICE: {
    image: "/images/character/body/Alice_1.png",
    skills: [1, 2, 3, 4, 5, 6],
  },
  CECI: {
    image: "/images/character/body/Ceci_1.png",
    skills: [1, 2, 3, 4, 5, 6],
  },
  EMILY: {
    image: "/images/character/body/Emily_1.png",
    skills: [1, 2, 3, 4, 5, 6],
  },
  DASHA: {
    image: "/images/character/body/Dasha_1.png",
    skills: [1, 2, 3, 4, 5, 6],
  },
  BESTIE: {
    image: "/images/character/body/Bestie_1.png",
    skills: [1, 2, 3, 4, 5, 6],
  },
};
export const Minions = {
  DEATH_BLUE: {
    image: "/images/character/body/Alice_1.png",
  },
};
export const tierAngelDescription = [
  "Tier 1: ability to earn 10 - 30 INC/10 mins in R - I.",
  "Tier 2: ability to earn 10 - 40 INC/10 mins in R - I.",
  "Tier 3: ability to earn 10 - 50 INC/10 mins in R - I.",
  "Tier 4: ability to earn 20 - 60 INC/10 mins in R - I.",
  "Tier 5: ability to earn 20 - 90 INC/10 mins in R - I.",
];
export const tierMinionPartDescription = [
  "Minion parts will have corresponding Effects, and have a durability limit for PVE matches that have the ability to seek INC.",
  "Using a minion parts while research (R-I) will increase the time it can be researched in R-I based on the rarity of the minion parts.",
  "- Tier 1: 3% increase research time in R - I.",
  "- Tier 2: 6% increase research time in R - I.",
  "- Tier 3: 9% increase research time in R - I.",
  "- Tier 4: 12% increase research time in R - I.",
  "- Tier 5: 15% increase research time in R - I.",
];
export const tierCostumeDescription = [
  "All Costumes when worn as a set have the same bonus features and stats, however, if you own an NFT Costume, you will gain additional stats when participating in INC earning activities such as research in R-I.",
  "- Tier 1: 2% increase earn $INC at R - I.",
  "- Tier 2: 4% increase earn $INC at R - I.",
  "- Tier 3: 6 % increase earn $INC at R - I.",
  "- Tier 4: 8% increase earn $INC at R - I.",
  "- Tier 5: 10% increase earn $INC at R - I.",
];
