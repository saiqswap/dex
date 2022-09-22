import { MAINNET_ABI } from "../onchain/mainnet-abi";
import { MAINNET_CONFIG, MAINNET_DOMAIN } from "../onchain/mainnet-config";
import { TESTNET_ABI } from "../onchain/testnet-abi";
import { TESTNET_CONFIG, TESTNET_DOMAIN } from "../onchain/testnet-config";

//develop environment
export const develop = {
  API: `https://apiinfinity.feliciastation.com/api/v1`,
  // API: `https://marketplace_api.megdev.co/api/v1`,
  CAPTCHA_KEY: `6LfFLgIeAAAAAAclTDxmyP3juN4Wj-TeNI_7jl30`,
  GOOGLE_SIGN_IN_CLIENT_KEY: `655245171305-0pfnhphdi1gp33s1ejpgo2qem4matjc7.apps.googleusercontent.com`,
  MAIN_MENUS: [
    // {
    //   title: "HOME",
    //   url: ["/"],
    // },
    {
      title: "MINTING",
      url: ["/minting-box"],
    },
    {
      title: "MARKETPLACE",
      url: ["/marketplace"],
    },
    {
      title: "BOXES",
      url: ["/boxes"],
    },
    {
      title: "SUMMON",
      url: ["/summon"],
      isLogged: true,
    },
    {
      title: "R - I",
      url: [
        "/research-institute/R-I",
        "/research-institute/slot",
        "/research-institute/history",
      ],
      isLogged: true,
    },
  ],
  ETHERSCAN_LINK: "https://testnet.bscscan.com",
  BLOCKCHAIN: {
    ...TESTNET_ABI,
    domain: TESTNET_DOMAIN,
    config: TESTNET_CONFIG,
  },
};

//staging environment
export const staging = {
  API: `https://marketplace_api.megdev.co/api/v1`,
  CAPTCHA_KEY: `6LfFLgIeAAAAAAclTDxmyP3juN4Wj-TeNI_7jl30`,
  GOOGLE_SIGN_IN_CLIENT_KEY: `655245171305-0pfnhphdi1gp33s1ejpgo2qem4matjc7.apps.googleusercontent.com`,
  MAIN_MENUS: [
    {
      title: "HOME",
      url: ["/"],
    },
    // {
    //   title: "MINTING",
    //   url: ["/minting-box"],
    // },
    {
      title: "MARKETPLACE",
      url: ["/marketplace"],
    },
    {
      title: "BOXES",
      url: ["/boxes"],
    },
    {
      title: "SUMMON",
      url: ["/summon"],
      isLogged: true,
    },
    {
      title: "R - I",
      url: [
        "/research-institute/R-I",
        "/research-institute/slot",
        "/research-institute/history",
      ],
      isLogged: true,
    },
  ],
  ETHERSCAN_LINK: "https://bscscan.com",
  BLOCKCHAIN: {
    ...MAINNET_ABI,
    domain: MAINNET_DOMAIN,
    config: MAINNET_CONFIG,
  },
};

//production environment
export const production = {
  API: `https://marketplace.infinityangel.io/api/v1`,
  CAPTCHA_KEY: `6LdPQqMhAAAAANaFCYo54sl0FTq5_LtbZnX4a9n9`,
  GOOGLE_SIGN_IN_CLIENT_KEY: `655245171305-0pfnhphdi1gp33s1ejpgo2qem4matjc7.apps.googleusercontent.com`,
  MAIN_MENUS: [],
  ETHERSCAN_LINK: "https://bscscan.com",
  BLOCKCHAIN: {
    ...MAINNET_ABI,
    domain: MAINNET_DOMAIN,
    config: MAINNET_CONFIG,
  },
};
