import { ethers } from "ethers";
import { ERC20_ABI } from "../../onchain/abi-bytecode";
import { prefix } from "../../onchain/onchain";
import { ADDRESS_0 } from "../../settings/constants";
import {
  ENDPOINT_GET_BALANCE,
  ENDPOINT_GET_PROFILE,
  ENDPOINT_MY_NFT,
} from "../../settings/endpoint";
import { get } from "../../utils/api";
import { logout } from "../../utils/auth";
import { ADD_MY_ITEMS, FETCH_USER, GET_BALANCE } from "../constants";

export const _getNewProfile = () => (dispatch) => {
  get(
    ENDPOINT_GET_PROFILE,
    (data) => {
      dispatch({
        type: FETCH_USER,
        payload: data,
      });
    },
    (error) => {
      console.log(error);
      logout();
    }
  );
};

export const _getBalance = (walletAddress, metamaskProvider) => (dispatch) => {
  get(ENDPOINT_GET_BALANCE, (data) => {
    (async () => {
      dispatch({
        type: GET_BALANCE,
        payload: [],
      });
      const balances = data;
      // let count = 1;
      balances.forEach((e) => {
        (async () => {
          var balance = null;
          if (e.contractAddress === ADDRESS_0 && prefix) {
            balance = await prefix.request({
              method: "eth_getBalance",
              params: [walletAddress, "latest"],
            });
          } else {
            try {
              const contractInstance = new ethers.Contract(
                e.contractAddress,
                ERC20_ABI,
                metamaskProvider
              );
              balance = await contractInstance.balanceOf(walletAddress);
            } catch (error) {
              console.log(error);
            }
          }
          balance = Number(ethers.utils.formatEther(balance));
          e.onChainBalance = balance;
        })().then(() => {
          // if (count === balances.length) {
          dispatch({
            type: GET_BALANCE,
            payload: balances,
          });
          // count++;
        });
      });
    })();
  });
};

export const _getMyItems = (successCallback) => (dispatch) => {
  get(ENDPOINT_MY_NFT, (data) => {
    if (successCallback) {
      successCallback(data);
    }
    dispatch({
      type: ADD_MY_ITEMS,
      payload: data,
    });
  });
};
