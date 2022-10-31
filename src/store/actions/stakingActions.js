import { post } from "jquery";
import { EndpointConstant } from "../../settings/endpoint";
import { get } from "../../utils/api";
import { StoreStakingConstant } from "../constants";

export const _getPackageList = () => (dispatch) => {
  get(EndpointConstant.STAKING_PACKAGE_LIST, (data) =>
    dispatch({
      type: StoreStakingConstant.GET_STAKING_PACKAGES,
      payload: data,
    })
  );
};

export const _getMyStakes = (packageList) => (dispatch) => {
  get(
    `${EndpointConstant.STAKING_MY_LIST}`,
    (data) => {
      dispatch({
        type: StoreStakingConstant.GET_MY_STAKES,
        payload: data,
      });
    },
    (error) => console.error(error)
  );
};
