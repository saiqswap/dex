import {
  ADD_ACCOUNT,
  DELETE_COMENT,
  GET_COMMENT_SUCCESS,
  GET_FOLLOWED,
  GET_FOLLOWERS,
  GET_FOLLOWING,
  GET_MY_NEWS_FEED,
  GET_NETWORKS,
  GET_NEWEST_USERS,
  GET_NEWS_FEED,
  GET_TOP_POPULAR,
  GET_USERS,
  RESET_COMMENTS,
  SAVE_PREVIEW_LINK,
  SELECT_FEED,
  UPDATE_COMMENT,
  UPDATE_FOLLOW,
  UPDATE_LOCAL_ACCOUNT_FEED,
  UPDATE_LOCAL_FEED,
  UPDATE_MIN_HEIGHT,
} from "../constants";

const initialState = {
  users: null,
  followers: null,
  following: null,
  followed: [],
  networks: null,
  newsFeed: [],
  newsFeedPage: 1,
  pageSize: 8,
  newsFeedItemCount: 0,
  loadedAccount: [],
  newestUsers: null,
  selectedFeed: null,
  popularUsers: null,
  commentMeta: {
    commentCount: 0,
    comments: [],
  },
  accountNewsFeed: [],
  accountNewsFeedItemCount: 0,
  loadedLinkPreview: [],
  minHeight: 0,
};

export const GeneralReducer = (state = initialState, action) => {
  const { type, payload } = action;
  const { newsFeed, accountNewsFeed, loadedLinkPreview, minHeight } = state;
  switch (type) {
    case UPDATE_MIN_HEIGHT:
      return { ...state, minHeight: minHeight + payload + 16 };
    case SAVE_PREVIEW_LINK:
      loadedLinkPreview.push(payload);
      return { ...state, loadedLinkPreview };
    case UPDATE_LOCAL_ACCOUNT_FEED:
      accountNewsFeed.unshift(payload);
      return { ...state, accountNewsFeed };
    case UPDATE_LOCAL_FEED:
      newsFeed.unshift(payload);
      return {
        ...state,
        newsFeed,
      };
    case GET_MY_NEWS_FEED:
      return {
        ...state,
        accountNewsFeed: accountNewsFeed.concat(payload.items),
        accountNewsFeedItemCount: payload.itemCount,
      };
    case GET_TOP_POPULAR:
      return { ...state, popularUsers: payload };
    case SELECT_FEED:
      return { ...state, selectedFeed: payload };
    case GET_NEWEST_USERS:
      return { ...state, newestUsers: payload };
    case ADD_ACCOUNT:
      const temp = [...state.loadedAccount, payload];
      return { ...state, loadedAccount: temp };
    case GET_NEWS_FEED:
      return {
        ...state,
        newsFeed: newsFeed.concat(payload.items),
        newsFeedPage: payload.page,
        newsFeedItemCount: payload.itemCount,
      };
    case GET_USERS:
      return { ...state, users: payload };
    case GET_FOLLOWERS:
      return { ...state, followers: payload };
    case GET_FOLLOWING:
      return { ...state, following: payload };
    case GET_NETWORKS:
      return { ...state, networks: payload };
    case GET_FOLLOWED:
      return { ...state, followed: payload };
    case UPDATE_FOLLOW:
      const { isFollow, id } = payload;
      var array = state.followed;
      if (isFollow) {
        array.push(id);
      } else {
        // eslint-disable-next-line eqeqeq
        array = array.filter((item) => item != id);
      }
      return { ...state, followed: array };
    case GET_COMMENT_SUCCESS:
      var tempMeta = {
        commentCount: 0,
        comments: [],
      };
      if (action.params.page === 1) {
        let temp = state.commentMeta.comments;
        temp.splice(0, action.params.pageSize);
        tempMeta = {
          commentCount: action.payload.itemCount,
          comments: action.payload.items
            .concat(temp)
            .slice(0, action.payload.pageSize),
        };
      } else {
        tempMeta = {
          commentCount: action.payload.itemCount,
          comments: state.commentMeta.comments.concat(action.payload.items),
        };
      }
      return { ...state, commentMeta: tempMeta };
    case RESET_COMMENTS:
      tempMeta = {
        commentCount: 0,
        comments: [],
      };
      return { ...state, commentMeta: tempMeta };
    case UPDATE_COMMENT:
      const newComment = action.payload;
      var comments = state.commentMeta.comments;
      var commentCount = state.commentMeta.commentCount;
      const foundCommentIndex = comments.findIndex(
        (item) =>
          (item.id && item.id === newComment.id) ||
          (item.key && item.key === newComment.key)
      );
      if (foundCommentIndex >= 0) {
        comments[foundCommentIndex] = {
          ...comments[foundCommentIndex],
          ...newComment,
        };
      } else {
        comments = [newComment].concat(comments);
        commentCount++;
      }

      tempMeta = {
        commentCount: commentCount,
        comments: comments,
      };
      return { ...state, commentMeta: tempMeta };
    case DELETE_COMENT:
      comments = state.commentMeta.comments;
      commentCount = state.commentMeta.commentCount;
      var index = comments.findIndex(
        (item) => item.id && item.id === action.payload.id
      );
      if (index >= 0) {
        commentCount--;
        comments = comments.filter((item) => item.id !== action.payload.id);
      }
      tempMeta = {
        commentCount: commentCount,
        comments: comments,
      };
      return { ...state, commentMeta: tempMeta };
    default:
      return { ...state };
  }
};
