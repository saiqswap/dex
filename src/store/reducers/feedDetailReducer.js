import {
  SET_FEED_DETAIL_IMAGE_INDEX,
  SET_FEED_DETAIL_POPUP,
  UPDATE_FEED_DETAIL_FLAG,
} from "../constants";

const initialState = {
  feedDetail: null,
  imageIndex: 0,
  photoIndex: null,
  isFeedDetailFlag: false,
};

export const FeedDetailReducer = (state = initialState, action) => {
  const { type, payload } = action;
  const { isFeedDetailFlag } = state;
  switch (type) {
    case UPDATE_FEED_DETAIL_FLAG:
      return { ...state, isFeedDetailFlag: !isFeedDetailFlag };
    case SET_FEED_DETAIL_IMAGE_INDEX:
      return { ...state, imageIndex: payload };
    case SET_FEED_DETAIL_POPUP:
      return { ...state, feedDetail: payload };
    default:
      return { ...state };
  }
};
