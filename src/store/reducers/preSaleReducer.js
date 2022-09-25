import { GET_PRE_SALE_ROUND_LIST } from "../constants";

const initialState = {
  preSaleRoundList: null,
};

export const PreSaleReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PRE_SALE_ROUND_LIST:
      return { ...state, preSaleRoundList: payload };
    default:
      return { ...state };
  }
};
