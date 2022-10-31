import { StoreStakingConstant } from "../constants";

const initialState = {
  packageList: null,
  myStakes: null,
};

export const StakingReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case StoreStakingConstant.GET_MY_STAKES:
      return { ...state, myStakes: payload };
    case StoreStakingConstant.GET_STAKING_PACKAGES:
      return { ...state, packageList: payload };
    default:
      return { ...state };
  }
};
