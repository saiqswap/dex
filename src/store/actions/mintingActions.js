import { PROJECT_LOCATION } from "../../settings";
import { BoxType, MINTING_COMBOS } from "../../settings/constants";
import {
  ENDPOINT_MINTING_BOX_COMBOS,
  ENDPOINT_MINTING_BOX_INFORMATION,
  ENDPOINT_MINTING_BOX_PRODUCTS,
  ENDPOINT_PRESALE_GET_TRANSACTION_LIST,
} from "../../settings/endpoint";
import { get, post } from "../../utils/api";
import {
  GET_MINTING_BOX_INFORMATION,
  GET_MINTING_BOX_LIST,
  GET_MINTING_COMBO_LIST,
  GET_USER_MINTING_BOX,
} from "../constants";

export const _getMintingBoxInformation = (address) => (dispatch) => {
  get(`${ENDPOINT_MINTING_BOX_INFORMATION}?address=${address}`, (data) => {
    dispatch({ type: GET_MINTING_BOX_INFORMATION, payload: data });
  });
};

export const _getMintingBoxList = () => (dispatch) => {
  get(ENDPOINT_MINTING_BOX_PRODUCTS, (rounds) => {
    const temp = [];
    rounds.forEach((round) => {
      const { items } = round;
      const locationFilterItems = items.filter(
        (item) => item.location === PROJECT_LOCATION
      );
      const list = [];
      locationFilterItems.forEach((item) => {
        let totalSold = 0;
        const index = list.findIndex((l) => l.boxType === item.boxType);
        const itemLikeType = locationFilterItems.filter(
          (i) => i.boxType === item.boxType
        );
        itemLikeType.forEach((item) => {
          totalSold += item.sold;
        });
        item.totalSold = totalSold;
        item.roundNumber = round.roundNumber;
        const tempData = {
          id: item.id,
          paymentContract: item.paymentContract,
          paymentCurrency: item.paymentCurrency,
          unitPrice: item.unitPrice,
        };
        if (index < 0) {
          const information = BoxType[item.boxType];
          list.push({
            ...item,
            information,
            totalSold: totalSold > item.available ? item.available : totalSold,
            totalSupply: item.available,
            items: [tempData],
          });
        } else {
          list[index].items.push(tempData);
        }
      });
      if (list.length > 0) {
        const angel = list.find((item) => item.boxType === "ANGEL");
        const angelTotalSold = angel.totalSold;
        const angelTotalSupply = angel.totalSupply;
        const angelStartTime = angel.startTime;
        const angelEndTime = angel.endTime;
        temp.push({
          roundNumber: round.roundNumber,
          angelTotalSold,
          angelTotalSupply,
          angelStartTime,
          angelEndTime,
          boxes: list,
        });
      }
    });
    dispatch({
      type: GET_MINTING_BOX_LIST,
      payload: temp,
    });
  });
};

export const _getMintingComboList = () => (dispatch) => {
  get(ENDPOINT_MINTING_BOX_COMBOS, (rounds) => {
    const temp = [];
    rounds.forEach((round) => {
      const { items } = round;
      const locationFilterItems = items.filter(
        (item) => item.location === PROJECT_LOCATION
      );
      const list = [];
      locationFilterItems.forEach((item) => {
        let totalSold = 0;
        const index = list.findIndex((l) => l.comboType === item.comboType);
        const itemLikeType = locationFilterItems.filter(
          (i) => i.comboType === item.comboType
        );
        itemLikeType.forEach((item) => {
          totalSold += item.sold;
        });
        item.totalSold = totalSold;
        item.roundNumber = round.roundNumber;
        const tempData = {
          id: item.id,
          paymentContract: item.paymentContract,
          paymentCurrency: item.paymentCurrency,
          unitPrice: item.unitPrice,
        };
        if (index < 0) {
          const information = MINTING_COMBOS[item.comboType];
          list.push({
            ...item,
            information,
            totalSold: totalSold > item.available ? item.available : totalSold,
            totalSupply: item.available,
            items: [tempData],
          });
        } else {
          list[index].items.push(tempData);
        }
      });
      temp.push({
        roundNumber: round.roundNumber,
        combos: list,
      });
    });
    dispatch({
      type: GET_MINTING_COMBO_LIST,
      payload: temp,
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
