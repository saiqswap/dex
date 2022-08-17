import { en } from "../../languages/en";
import { jp } from "../../languages/jp";
import { kr } from "../../languages/kr";
import { get, post } from "../../utils/api";
import {
  ADD_CONFIG,
  CHANGE_LANGUAGE,
  CHANGE_MODE,
  CHANGE_VERSION,
  CHANGE_VOLUME_STATUS,
  GET_TEMPLATES,
  SIDEBAR_PROFILE_STATUS,
  TOGGLE_RANKING_FORM,
  UPDATE_LEFT_MENU_STATUS,
} from "../constants";

export const _handleLeftMenu = (toggle) => (dispatch) => {
  if (toggle) {
    dispatch({
      type: UPDATE_LEFT_MENU_STATUS,
      payload: toggle,
    });
    setTimeout(() => {
      dispatch({
        type: SIDEBAR_PROFILE_STATUS,
        payload: toggle,
      });
    }, 150);
  } else {
    dispatch({
      type: SIDEBAR_PROFILE_STATUS,
      payload: toggle,
    });
    setTimeout(() => {
      dispatch({
        type: UPDATE_LEFT_MENU_STATUS,
        payload: toggle,
      });
    }, 150);
  }
};

export const _changeThemeMode = (e) => (dispatch) => {
  localStorage.setItem("dark-mode", e);
  dispatch({
    type: CHANGE_MODE,
    payload: e,
  });
};

export const _changeVolumeStatus = (isMuted) => (dispatch) => {
  dispatch({
    type: CHANGE_VOLUME_STATUS,
    payload: isMuted,
  });
};

export const _toggleRankingForm = (props) => (dispatch) => {
  dispatch({
    type: TOGGLE_RANKING_FORM,
    payload: props,
  });
};

export const _selectVersion = (version) => (dispatch) => {
  dispatch({
    type: CHANGE_VERSION,
    payload: version,
  });
};

export const _getConfig = () => (dispatch) => {
  get(`/config`, (data) =>
    get(
      `/market/get-price`,
      (res) => {
        dispatch({
          type: ADD_CONFIG,
          payload: { ...data, listingLimitPrice: res },
        });
      },
      () => {
        dispatch({
          type: ADD_CONFIG,
          payload: data,
        });
      }
    )
  );
};

export const _getTemplates = () => (dispatch) => {
  const param = {
    page: 1,
    pageSize: 200,
    getMeta: false,
  };
  post(
    "/nft/templates",
    param,
    (result) => {
      dispatch({
        type: GET_TEMPLATES,
        payload: result.items,
      });
    },
    () => {}
  );
};

export const _changeLanguage =
  (lang = "en") =>
  (dispatch) => {
    localStorage.setItem("lang", lang);
    let payload;
    switch (lang) {
      case "kr":
        payload = kr;
        break;
      case "jp":
        payload = jp;
        break;
      default:
        payload = en;
        break;
    }
    dispatch({
      type: CHANGE_LANGUAGE,
      payload,
    });
  };
