import { GET_MINTING_BOX_LIST, GET_USER_MINTING_BOX } from "../constants";

const initialState = {
  mintingBoxList: null,
  userMintingBox: null,
};

export const MintingReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USER_MINTING_BOX:
      return { ...state, userMintingBox: payload };
    case GET_MINTING_BOX_LIST:
      return { ...state, mintingBoxList: payload };
    default:
      return { ...state };
  }
};
