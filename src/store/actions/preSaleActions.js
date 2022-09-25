import { _getPreSaleRounds } from "../../onchain";
import { GET_PRE_SALE_ROUND_LIST } from "../constants";

export const _getPreSaleRoundList = () => (dispatch) => {
  _getPreSaleRounds((roundList) => {
    dispatch({
      type: GET_PRE_SALE_ROUND_LIST,
      payload: roundList,
    });
  });
};
