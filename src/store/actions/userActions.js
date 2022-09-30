import { ethers } from "ethers";
import { _getVestingBalance } from "../../onchain";
import { ERC20_ABI } from "../../onchain/abi-bytecode";
import { prefix } from "../../onchain/onchain";
import { ADDRESS_0, PRE_SALE_ROUNDS } from "../../settings/constants";
import { ENDPOINT_GET_PROFILE, ENDPOINT_MY_NFT } from "../../settings/endpoint";
import { get } from "../../utils/api";
import { logout } from "../../utils/auth";
import {
  ADD_MY_ITEMS,
  ADD_WALLET_ADDRESS,
  ADD_WALLET_SIGNATURE,
  FETCH_USER,
  GET_BALANCE,
  GET_ONCHAIN_BALANCE,
  GET_PRE_SALE_BALANCE,
  UPDATE_PARTNER_REF,
  UPDATE_REF,
  UPDATE_WALLET_NAME,
} from "../constants";

export const _handleLogout = () => (dispatch) => {
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
  dispatch({
    type: ADD_WALLET_SIGNATURE,
    payload: null,
  });
};

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

export const _getOnchainBalance =
  (assets, walletAddress, metamaskProvider) => async (dispatch) => {
    const balances = [...assets];
    let preSaleTokenBalances = await _getVestingBalance(walletAddress);
    for (let index = 0; index < preSaleTokenBalances.length; index++) {
      const staticDetailData = PRE_SALE_ROUNDS.find(
        (round) => round.roundId === preSaleTokenBalances[index].vestingId
      );
      preSaleTokenBalances[index] = {
        ...preSaleTokenBalances[index],
        ...staticDetailData,
      };
    }
    const vestingDetail = preSaleTokenBalances.filter(
      (e) => e.totalLockAmount > 0
    );
    dispatch({
      type: GET_PRE_SALE_BALANCE,
      payload: vestingDetail,
    });
    for (let e of balances) {
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
        } catch (error) {}
      }
      if (e.asset === "ING") {
        let tempBalance = 0;
        const vestingList = await _getVestingBalance(walletAddress);
        vestingList.forEach((element) => {
          tempBalance = tempBalance + parseFloat(element?.totalLockAmount);
        });
        e.vestingBalance = tempBalance;
      }
      balance = balance ? Number(ethers.utils.formatEther(balance)) : 0;
      e.onChainBalance = balance;
    }
    dispatch({
      type: GET_ONCHAIN_BALANCE,
      payload: balances,
    });
  };

// export const _getBalance = () => (dispatch) => {
//   get(ENDPOINT_GET_BALANCE, (data) => {
//     // dispatch({
//     //   type: GET_BALANCE,
//     //   payload: [],
//     // });
//     const balances = data;
//     balances.forEach((e) => {
//       dispatch({
//         type: GET_BALANCE,
//         payload: balances,
//       });
//     });
//   });
// };

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

export const _removeWalletSignature = () => (dispatch) => {
  window.localStorage.removeItem("wallet-signature");
  dispatch({
    type: ADD_WALLET_SIGNATURE,
    payload: null,
  });
};

export const _getWalletInformation = () => (dispatch) => {
  const walletName = window.localStorage.getItem("wallet-name")
    ? window.localStorage.getItem("wallet-name")
    : null;
  dispatch({
    type: UPDATE_WALLET_NAME,
    payload: walletName,
  });
  const walletSignature = window.localStorage.getItem("wallet-signature")
    ? window.localStorage.getItem("wallet-signature")
    : null;
  dispatch({
    type: ADD_WALLET_SIGNATURE,
    payload: walletSignature,
  });
};

export const _handleProfileLogout = () => (dispatch) => {
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

export const _addRef = () => (dispatch) => {
  let ref = window.localStorage.getItem("ref");
  ref = ref ? ref : null;
  dispatch({
    type: UPDATE_REF,
    payload: ref,
  });
};

export const _addPartnerRef = () => (dispatch) => {
  let ref = window.localStorage.getItem("partner-ref");
  ref = ref ? ref : null;
  dispatch({
    type: UPDATE_PARTNER_REF,
    payload: ref,
  });
};
