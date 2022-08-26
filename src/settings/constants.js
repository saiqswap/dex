import { config } from ".";

export const ACCESS_TOKEN_KEY = "CBt3gpbqeMdWPNG1";
export const SCOPES_KEY = "AhBcmvr1EkMdPnL5";
export const DEFAULT_PROJECT_TITLE = `NFT Marketplace - Create and sell digital collectibles secured with blockchain`;
export const LOGIN_MESSAGE = "This is sign message";
export const RI_SLOT_LIMIT = 6;
export const ADDRESS_0 = "0x0000000000000000000000000000000000000000";
export const CAPTCHA_KEY = config.CAPTCHA_KEY;
export const GOOGLE_SIGN_IN_CLIENT_KEY = config.GOOGLE_SIGN_IN_CLIENT_KEY;

export const MAIN_MENUS = config.MAIN_MENU;

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
