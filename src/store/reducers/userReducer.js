import {
  ADD_METAMASK_PROVIDER,
  ADD_MY_ITEMS,
  ADD_WALLET_ADDRESS,
  ADD_WALLET_SIGNATURE,
  FETCH_USER,
  GET_BALANCE,
  UPDATE_WALLET_NAME,
} from "../constants";

const initialState = {
  information: null,
  balances: null,
  myFeeds: null,
  metamaskProvider: null,
  myItems: null,
  walletName: null,
  walletSignature: null,
  walletAddress: null,
};

export const UserReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_WALLET_SIGNATURE:
      return { ...state, walletSignature: payload };
    case ADD_MY_ITEMS:
      return { ...state, myItems: payload };
    case ADD_METAMASK_PROVIDER:
      return { ...state, metamaskProvider: payload };
    case ADD_WALLET_ADDRESS:
      return { ...state, walletAddress: payload };
    case GET_BALANCE:
      return { ...state, balances: payload };
    case FETCH_USER:
      return {
        ...state,
        information: payload,
      };
    case UPDATE_WALLET_NAME:
      return {
        ...state,
        walletName: payload,
      };
    default:
      return { ...state };
  }
};
