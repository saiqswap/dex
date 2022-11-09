import moment from "moment";
import { secondsPerDay } from "../../settings/constants";
import { EndpointConstant } from "../../settings/endpoint";
import { get } from "../../utils/api";
import { ReduxConstant } from "../constants";

export const _getRICountdown = () => (dispatch) => {
  let now = moment().utcOffset(0);
  now.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  now = (now.unix() + secondsPerDay) * 1000;
  console.log("R-I reset time:", moment(now).utc().toISOString(), now);
  dispatch({
    type: ReduxConstant.GET_RI_COUNTDOWN,
    payload: now,
  });
  // get(EndpointConstant.NFT_RE_COUNTDOWN, (data) => {
  //   if (data[0]) {
  //     console.log(
  //       "Serer end time:",
  //       moment(data[0].lockTime).format("YYYY-MM-DD hh:mm:ss")
  //     );
  //     dispatch({
  //       type: ReduxConstant.GET_RI_COUNTDOWN,
  //       payload: data[0].lockTime,
  //     });
  //   }
  // });
};
