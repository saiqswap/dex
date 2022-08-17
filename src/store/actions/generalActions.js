import {
  ENDPOINT_GET_ALL_USER,
  ENDPOINT_GET_COMMENT,
  ENDPOINT_GET_FOLLOWED,
  ENDPOINT_GET_FOLLOWER,
  ENDPOINT_GET_FOLLOWING,
  ENDPOINT_MARKETPLACE,
  ENDPOINT_USER,
} from "../../settings/endpoint";
import { get, post } from "../../utils/api";
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
  UPDATE_COMMENT,
  UPDATE_FOLLOW,
} from "../constants";

export const _getPopularUsers = (page, pageSize, filters) => (dispatch) => {
  post(
    ENDPOINT_GET_ALL_USER,
    {
      page,
      pageSize,
      search: "",
      orderBy: "FollowCount",
      isDesc: true,
      responseMeta: false,
      filters,
    },
    (data) =>
      dispatch({
        type: GET_TOP_POPULAR,
        payload: data,
      })
  );
};

export const _getNewestUsers = (page, pageSize, filters) => (dispatch) => {
  dispatch({
    type: GET_USERS,
    payload: null,
  });
  post(
    ENDPOINT_GET_ALL_USER,
    {
      page,
      pageSize,
      search: "",
      orderBy: "MemberCount",
      isDesc: true,
      responseMeta: false,
      filters,
    },
    (data) =>
      dispatch({
        type: GET_NEWEST_USERS,
        payload: data,
      })
  );
};

export const _getUsers = (page, pageSize, orderBy, filters) => (dispatch) => {
  dispatch({
    type: GET_USERS,
    payload: null,
  });
  post(
    ENDPOINT_GET_ALL_USER,
    {
      page,
      pageSize,
      search: "",
      // orderBy,
      isDesc: true,
      responseMeta: true,
      filters,
    },
    (data) =>
      dispatch({
        type: GET_USERS,
        payload: data,
      })
  );
};

export const _getFollowed = () => (dispatch) => {
  get(ENDPOINT_GET_FOLLOWED, (result) =>
    dispatch({
      type: GET_FOLLOWED,
      payload: result,
    })
  );
};

export const _getFollowers =
  (page, pageSize, orderBy, filters) => (dispatch) => {
    dispatch({
      type: GET_FOLLOWERS,
      payload: null,
    });
    post(
      ENDPOINT_GET_FOLLOWER,
      {
        page,
        pageSize,
        search: "",
        orderBy,
        isDesc: true,
        responseMeta: true,
        filters,
      },
      (data) =>
        dispatch({
          type: GET_FOLLOWERS,
          payload: data,
        })
    );
  };

export const _getFollowing =
  (page, pageSize, orderBy, filters) => (dispatch) => {
    dispatch({
      type: GET_FOLLOWING,
      payload: null,
    });
    post(
      ENDPOINT_GET_FOLLOWING,
      {
        page,
        pageSize,
        search: "",
        orderBy,
        isDesc: true,
        responseMeta: true,
        filters,
      },
      (data) =>
        dispatch({
          type: GET_FOLLOWING,
          payload: data,
        })
    );
  };

export const _getNetworks = (page, pageSize, filters) => (dispatch) => {
  dispatch({
    type: GET_NETWORKS,
    payload: null,
  });
  post(
    ENDPOINT_GET_ALL_USER,
    {
      page,
      pageSize,
      search: "",
      orderBy: "Rank",
      isDesc: true,
      responseMeta: true,
      filters,
    },
    (data) =>
      dispatch({
        type: GET_NETWORKS,
        payload: data,
      })
  );
};

export const _getNewsFeed =
  (page = 1, pageSize = 10, account = "") =>
  (dispatch) => {
    post(
      ENDPOINT_MARKETPLACE,
      {
        page,
        pageSize,
        filters: {
          account,
        },
      },
      (data) => {
        dispatch({
          type: GET_NEWS_FEED,
          payload: data,
        });
      }
    );
  };

export const _getMyNewsFeed =
  (page = 1, pageSize = 10, account = "") =>
  (dispatch) => {
    post(
      ENDPOINT_MARKETPLACE,
      {
        page,
        pageSize,
        filters: {
          account,
        },
      },
      (data) => {
        console.log(data);
        dispatch({
          type: GET_MY_NEWS_FEED,
          payload: data,
        });
      }
    );
  };

export const _updateFollow = (id, isFollow) => (dispatch) => {
  dispatch({
    type: UPDATE_FOLLOW,
    payload: { isFollow: isFollow, id: id },
  });
};

export const _addAccount =
  (loadedAccount, items, page, pageSize) => (dispatch) => {
    //add seller
    const itemsByPage = items.slice((page - 1) * pageSize, items.length);
    const seen = new Set();
    const noneDuplicateItems = itemsByPage.filter((el) => {
      const duplicate = seen.has(el.seller);
      seen.add(el.seller);
      return !duplicate;
    });
    noneDuplicateItems.forEach((element) => {
      const found = loadedAccount.findIndex(
        (item) => item.account === element.seller
      );
      if (found < 0) {
        get(`${ENDPOINT_USER}?account=${element.seller}`, (data) => {
          dispatch({
            type: ADD_ACCOUNT,
            payload: data,
          });
        });
      }
    });
    //add buyer
    const itemsByPage_buyer = items.slice((page - 1) * pageSize, items.length);
    const seen_buyer = new Set();
    const noneDuplicateItems_buyer = itemsByPage_buyer.filter((el) => {
      const duplicate = seen_buyer.has(el.buyer);
      seen_buyer.add(el.buyer);
      return !duplicate;
    });
    noneDuplicateItems_buyer.forEach((element) => {
      const found = loadedAccount.findIndex(
        (item) => item.account === element.buyer
      );
      if (found < 0 && element.buyer) {
        get(`${ENDPOINT_USER}?account=${element.buyer}`, (data) => {
          dispatch({
            type: ADD_ACCOUNT,
            payload: data,
          });
        });
      }
    });
  };

export const _addAccountFromMoralis = (loadedAccount, items) => (dispatch) => {
  //add seller
  const seen = new Set();
  const noneDuplicateItems = items.filter((el) => {
    const duplicate = seen.has(el.owner_of);
    seen.add(el.owner_of);
    return !duplicate;
  });
  noneDuplicateItems.forEach((element) => {
    const found = loadedAccount.findIndex(
      (item) => item.account === element.owner_of
    );
    if (found < 0 && element.owner_of) {
      get(`${ENDPOINT_USER}?account=${element.owner_of}`, (data) => {
        if (data) {
          dispatch({
            type: ADD_ACCOUNT,
            payload: data,
          });
        }
      });
    }
  });
};

export const _getComments = (params, successCallback) => (dispatch) => {
  post(ENDPOINT_GET_COMMENT, params, (data) => {
    if (successCallback) successCallback();
    dispatch({
      type: GET_COMMENT_SUCCESS,
      payload: data,
      params: params,
    });
  });
};

export const _resetComments = () => (dispatch) => {
  dispatch({
    type: RESET_COMMENTS,
    payload: null,
  });
};

export const _updateComment = (comment) => (dispatch) => {
  dispatch({
    type: UPDATE_COMMENT,
    payload: comment,
  });
};

export const _deleteComment = (comment) => (dispatch) => {
  dispatch({
    type: DELETE_COMENT,
    payload: comment,
  });
};
