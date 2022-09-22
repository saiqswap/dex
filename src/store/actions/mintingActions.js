import {
  ENDPOINT_MINTING_BOX_COMBOS,
  ENDPOINT_MINTING_BOX_PRODUCTS,
  ENDPOINT_PRESALE_GET_TRANSACTION_LIST,
} from "../../settings/endpoint";
import { get, post } from "../../utils/api";
import {
  GET_MINTING_BOX_LIST,
  GET_MINTING_COMBO_LIST,
  GET_USER_MINTING_BOX,
} from "../constants";

export const _getMintingBoxList = () => (dispatch) => {
  get(ENDPOINT_MINTING_BOX_PRODUCTS, (data) => {
    data.forEach((element) => {
      const list = [];
      element.items.forEach((item) => {
        const index = list.findIndex((l) => l.boxType === item.boxType);
        if (index < 0) {
          list.push({
            ...item,
            productByPrice: [item],
          });
        } else {
          list[index].productByPrice.push(item);
        }
      });
      element.filterItems = list;
    });
    dispatch({
      type: GET_MINTING_BOX_LIST,
      payload: data,
    });
  });
};

export const _getMintingComboList = () => (dispatch) => {
  get(ENDPOINT_MINTING_BOX_COMBOS, (data) => {
    data.forEach((element) => {
      const list = [];
      element.items.forEach((item) => {
        if (item.name) {
          const index = list.findIndex((l) => l.name === item.name);
          if (index < 0) {
            list.push({
              ...item,
              productByPrice: [item],
            });
          } else {
            list[index].productByPrice.push(item);
          }
        }
      });
      element.filterItems = list;
    });
    dispatch({
      type: GET_MINTING_COMBO_LIST,
      payload: data,
    });
  });
};

export const _getUserMintingBoxes = () => (dispatch) => {
  post(
    `${ENDPOINT_PRESALE_GET_TRANSACTION_LIST}`,
    {
      page: 1,
      pageSize: 10,
      search: "",
      orderBy: "",
      getMeta: true,
      filters: {
        // TxHash: "",
      },
    },
    (data) => {
      dispatch({
        type: GET_USER_MINTING_BOX,
        payload: data,
      });
    },
    (error) => console.log(error)
  );
};
