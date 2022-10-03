import { en } from "../../languages/en";
import {
  ADD_CONFIG,
  CHANGE_MODE,
  CHANGE_VERSION,
  CHANGE_VOLUME_STATUS,
  SAVE_CURRENT_ROUTE,
  SAVE_OFFSET,
  SAVE_ROUTE,
  SIDEBAR_PROFILE_STATUS,
  TOGGLE_RANKING_FORM,
  UPDATE_LEFT_MENU_STATUS,
  GET_TEMPLATES,
  CHANGE_LANGUAGE,
  UPDATE_LOADING_STATUS,
  ReduxConstant,
} from "../constants";

const initialState = {
  library: en,
  openLeftMenu: false,
  showSidebarProfile: true,
  darkMode: true,
  previousRoute: "",
  activeFeedId: 0,
  videoMuted: true,
  showRankingForm: false,
  currentRank: null,
  pageYOffset: {},
  currentRoute: {
    type: "guest",
  },
  config: null,
  templates: null,
  loading: true,
  applicationConfig: null,
};

export const SettingReducer = (state = initialState, action) => {
  const { type, payload } = action;
  const { pageYOffset } = state;
  switch (type) {
    case ReduxConstant.GET_APPLICATION_CONFIG:
      return { ...state, applicationConfig: payload };
    case UPDATE_LOADING_STATUS:
      return { ...state, loading: payload };
    case CHANGE_LANGUAGE:
      return { ...state, library: payload };
    case GET_TEMPLATES:
      return { ...state, templates: payload };
    case ADD_CONFIG:
      return { ...state, config: payload };
    case CHANGE_VERSION:
      return { ...state, version: payload };
    case SAVE_CURRENT_ROUTE:
      return { ...state, currentRoute: payload };
    case SAVE_OFFSET:
      pageYOffset[payload.key] = payload.value;
      return { ...state, pageYOffset };
    case SIDEBAR_PROFILE_STATUS:
      return { ...state, showSidebarProfile: payload };
    case CHANGE_MODE:
      return { ...state, darkMode: payload };
    case SAVE_ROUTE:
      return {
        ...state,
        previousRoute: payload,
      };
    case UPDATE_LEFT_MENU_STATUS:
      return { ...state, openLeftMenu: payload };
    case CHANGE_VOLUME_STATUS:
      return { ...state, videoMuted: payload };
    case TOGGLE_RANKING_FORM:
      return {
        ...state,
        showRankingForm: payload.isShow,
        currentRank: payload.currentRank,
      };
    default:
      return { ...state };
  }
};
