import { ENPOINT_PRESALE_GET_TRANSACTION_LIST } from "../../settings/endpoint";
import { get, post } from "../../utils/api";
import { GET_MINTING_BOX_LIST, GET_USER_MINTING_BOX } from "../constants";

export const _getMintingBoxList = () => (dispatch) => {
  get(`/presale/products-for-sell`, (data) => {
    dispatch({
      type: GET_MINTING_BOX_LIST,
      payload: data,
    });
  });
};

export const _getUserMintingBoxes = () => (dispatch) => {
  post(
    `${ENPOINT_PRESALE_GET_TRANSACTION_LIST}`,
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
