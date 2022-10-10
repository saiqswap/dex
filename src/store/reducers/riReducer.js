import { ReduxConstant } from "../constants";

const initialState = {
  endTimeServer: null,
};

export const RiReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ReduxConstant.GET_RI_COUNTDOWN:
      console.log(payload);
      return { ...state, endTimeServer: payload };
    default:
      return { ...state };
  }
};
