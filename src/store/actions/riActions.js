import moment from "moment";
import { EndpointConstant } from "../../settings/endpoint";
import { get } from "../../utils/api";
import { ReduxConstant } from "../constants";

export const _getRICountdown = () => (dispatch) => {
  get(EndpointConstant.NFT_RE_COUNTDOWN, (data) => {
    if (data[0]) {
      console.log(
        "Serer end time:",
        moment(data[0].lockTime).format("YYYY-MM-DD hh:mm:ss")
      );
      dispatch({
        type: ReduxConstant.GET_RI_COUNTDOWN,
        payload: data[0].lockTime,
      });
    }
  });
};
