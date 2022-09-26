import { PROJECT_LOCATION } from "../../settings";
import { BoxType } from "../../settings/constants";
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
        let totalSupply = 0;
        const index = list.findIndex((l) => l.boxType === item.boxType);
        const itemLikeType = locationFilterItems.filter(
          (i) => i.boxType === item.boxType
        );
        itemLikeType.forEach((item) => {
          totalSold += item.sold;
          totalSupply += item.supply;
        });
        item.totalSold = totalSold;
        item.totalSupply = totalSupply;
        item.roundNumber = round.roundNumber;
        if (index < 0) {
          const information = BoxType[item.boxType];
          list.push({
            boxType: item.boxType,
            totalSupply,
            totalSold,
            startTime: item.startTime,
            endTime: item.endTime,
            items: [item],
            information,
            roundNumber: round.roundNumber,
          });
        } else {
          list[index].items.push(item);
        }
      });
      const angel = list.find((item) => item.boxType === "ANGEL");
      const angelTotalSold = angel.items[0].totalSold;
      const angelTotalSupply = angel.items[0].totalSupply;
      const angelStartTime = angel.items[0].startTime;
      const angelEndTime = angel.items[0].endTime;
      temp.push({
        roundNumber: round.roundNumber,
        angelTotalSold,
        angelTotalSupply,
        angelStartTime,
        angelEndTime,
        boxes: list,
      });
    });
    dispatch({
      type: GET_MINTING_BOX_LIST,
      payload: temp,
    });
    // console.log(temp);
  });
  // get(ENDPOINT_MINTING_BOX_PRODUCTS, (data) => {
  //   const tempData = [];
  //   data.forEach((element) => {
  //     const list = [];
  //     element.items.forEach((item) => {
  //       if (item.location === PROJECT_LOCATION) {
  //         let totalSold = 0;
  //         element.items.forEach((elm) => {
  //           if (elm.boxType === item.boxType) {
  //             if (elm.location === PROJECT_LOCATION) {
  //               totalSold += elm.sold;
  //             }
  //           }
  //         });
  //         const index = list.findIndex((l) => l.boxType === item.boxType);
  //         item.roundNumber = element.roundNumber;
  //         item.totalSold = totalSold;
  //         if (index < 0) {
  //           list.push({
  //             ...item,
  //             productByPrice: [item],
  //           });
  //         } else {
  //           list[index].productByPrice.push(item);
  //         }
  //       }
  //     });
  //     element.filterItems = list;
  //     tempData.push(element);
  //   });
  //   dispatch({
  //     type: GET_MINTING_BOX_LIST,
  //     payload: tempData,
  //   });
  // });
};

export const _getMintingComboList = () => (dispatch) => {
  get(ENDPOINT_MINTING_BOX_COMBOS, (data) => {
    data.forEach((element) => {
      const list = [];
      element.items.forEach((item) => {
        if (item.location === PROJECT_LOCATION) {
          if (item.comboType) {
            let totalSold = 0;
            element.items.forEach((elm) => {
              if (elm.comboType === item.comboType) {
                if (elm.location === PROJECT_LOCATION) {
                  totalSold += elm.sold;
                }
              }
            });
            const index = list.findIndex((l) => l.comboType === item.comboType);
            item.roundNumber = element.roundNumber;
            item.totalSold = totalSold;
            if (index < 0) {
              list.push({
                ...item,
                productByPrice: [item],
              });
            } else {
              list[index].productByPrice.push(item);
            }
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
