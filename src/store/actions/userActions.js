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
import {
  ADD_MY_ITEMS,
  ADD_WALLET_ADDRESS,
  ADD_WALLET_SIGNATURE,
  FETCH_USER,
  GET_BALANCE,
  UPDATE_WALLET_NAME,
} from "../constants";

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

export const _setWalletName = (value) => (dispatch) => {
  window.localStorage.setItem("wallet-name", value);
  dispatch({
    type: UPDATE_WALLET_NAME,
    payload: value,
  });
};

export const _setWalletAddress = (value) => (dispatch) => {
  window.localStorage.setItem("wallet-address", value);
  dispatch({
    type: ADD_WALLET_ADDRESS,
    payload: value,
  });
};

export const _setWalletSignature = (value) => (dispatch) => {
  window.localStorage.setItem("wallet-signature", value);
  dispatch({
    type: ADD_WALLET_SIGNATURE,
    payload: value,
  });
};

export const _getWalletInformation = () => (dispatch) => {
  const walletName = window.localStorage.getItem("wallet-name")
    ? window.localStorage.getItem("wallet-name")
    : null;
  const walletAddress = window.localStorage.getItem("wallet-address")
    ? window.localStorage.getItem("wallet-address")
    : null;
  const walletSignature = window.localStorage.getItem("wallet-signature")
    ? window.localStorage.getItem("wallet-signature")
    : null;
  dispatch({
    type: UPDATE_WALLET_NAME,
    payload: walletName,
  });
  dispatch({
    type: ADD_WALLET_ADDRESS,
    payload: walletAddress,
  });
  dispatch({
    type: ADD_WALLET_SIGNATURE,
    payload: walletSignature,
  });
};

export const _getWalletLogout = () => (dispatch) => {
  window.localStorage.removeItem("wallet-name");
  window.localStorage.removeItem("wallet-address");
  window.localStorage.removeItem("wallet-signature");
  dispatch({
    type: UPDATE_WALLET_NAME,
    payload: null,
  });
  dispatch({
    type: ADD_WALLET_ADDRESS,
    payload: null,
  });
  dispatch({
    type: ADD_WALLET_SIGNATURE,
    payload: null,
  });
  dispatch({
    type: FETCH_USER,
    payload: null,
  });
  dispatch({
    type: GET_BALANCE,
    payload: null,
  });
  dispatch({
    type: ADD_MY_ITEMS,
    payload: null,
  });
};
