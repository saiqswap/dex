import {
  ADD_METAMASK_PROVIDER,
  ADD_MY_ITEMS,
  ADD_WALLET_ADDRESS,
  ADD_WALLET_SIGNATURE,
  FETCH_USER,
  GET_BALANCE,
  GET_ONCHAIN_BALANCE,
  GET_PRE_SALE_BALANCE,
  ReduxConstant,
  UPDATE_PARTNER_REF,
  UPDATE_REF,
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
  ref: null,
  partnerRef: null,
  preSaleTokenBalances: null,
  onChainBalances: null,
  lockBalances: null,
};

export const UserReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ReduxConstant.GET_USER_LOCK_BALANCE:
      return { ...state, lockBalances: payload };
    case GET_ONCHAIN_BALANCE:
      return { ...state, onChainBalances: payload };
    case GET_PRE_SALE_BALANCE:
      return { ...state, preSaleTokenBalances: payload };
    case UPDATE_PARTNER_REF:
      return { ...state, partnerRef: payload };
    case UPDATE_REF:
      return { ...state, ref: payload };
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
