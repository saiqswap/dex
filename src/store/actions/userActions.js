import { ethers } from "ethers";
import moment from "moment";
import { _getVestingBalance } from "../../onchain";
import { ERC20_ABI } from "../../onchain/abi-bytecode";
import { prefix } from "../../onchain/onchain";
import { SpecialPresale } from "../../onchain/special-presale";
import {
  ADDRESS_0,
  PRE_SALE_ROUNDS,
  RI_USER_TYPE,
  secondsPerDay,
  StatusList,
} from "../../settings/constants";
import {
  EndpointConstant,
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
  GET_ONCHAIN_BALANCE,
  GET_PRE_SALE_BALANCE,
  ReduxConstant,
  UPDATE_PARTNER_REF,
  UPDATE_REF,
  UPDATE_WALLET_NAME,
} from "../constants";

export const _getRIUserType = () => (dispatch) => {
  get(EndpointConstant.CHECK_RI_FACTORY_USER, (data) => {
    let payload = RI_USER_TYPE.NORMAL;
    if (data.isMember) {
      payload = RI_USER_TYPE.MEMBER;
    }
    if (data.isRoot) {
      payload = RI_USER_TYPE.ROOT;
    }
    dispatch({
      type: ReduxConstant.SET_RI_USER_TYPE,
      payload,
    });
  });
};

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
  dispatch({
    type: ReduxConstant.SET_USER_PROFILE_LOADING,
    payload: true,
  });
  get(
    ENDPOINT_GET_PROFILE,
    (data) => {
      dispatch({
        type: FETCH_USER,
        payload: data,
      });
      dispatch({
        type: ReduxConstant.SET_USER_PROFILE_LOADING,
        payload: false,
      });
    },
    (error) => {
      console.log(error);
      dispatch({
        type: ReduxConstant.SET_USER_PROFILE_LOADING,
        payload: false,
      });
      logout();
    }
  );
};

export const _getLockBalances = () => (dispatch) => {
  get(EndpointConstant.FUND_LOCK_AMOUNT, (data) =>
    dispatch({
      type: ReduxConstant.GET_USER_LOCK_BALANCE,
      payload: data,
    })
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

export const _getBalance = () => (dispatch) => {
  get(ENDPOINT_GET_BALANCE, (data) => {
    const balances = data;
    dispatch({
      type: GET_BALANCE,
      payload: balances,
    });
  });
};

export const _getPresaleVesting = (walletAddress) => async (dispatch) => {
  dispatch({
    type: GET_PRE_SALE_BALANCE,
    payload: null,
  });
  //get vesting information
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
  const vestingDetail = preSaleTokenBalances?.filter(
    (e) => e.totalLockAmount > 0
  );
  //special vesting
  let specialOnchainVestingBalance = await SpecialPresale._getVestingBalance(
    walletAddress
  );
  let specialVestingBalance = [];
  if (Array.isArray(specialOnchainVestingBalance)) {
    specialVestingBalance = specialOnchainVestingBalance;
  } else {
    specialVestingBalance.push(specialOnchainVestingBalance);
  }
  specialVestingBalance = specialVestingBalance?.filter(
    (e) => e.totalLockAmount > 0
  );
  for (const iterator of specialVestingBalance) {
    iterator.isSpecialRound = true;
    iterator.information = await SpecialPresale._getVestingInfo(
      iterator.vestingId
    );
  }
  // console.log(specialVestingBalance);
  //special vesting
  dispatch({
    type: GET_PRE_SALE_BALANCE,
    payload: [...vestingDetail, ...specialVestingBalance],
  });
};

export const _getMyItems = (successCallback) => async (dispatch) => {
  let now = moment().utcOffset(0);
  now.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  now = (now.unix() + secondsPerDay) * 1000;
  const countdownListPromise = new Promise((resolve) => {
    get(EndpointConstant.NFT_RE_COUNTDOWN, (bcConfigurations) => {
      resolve(bcConfigurations);
    });
  });
  const myItemsPromise = new Promise((resolve) => {
    get(ENDPOINT_MY_NFT, (data) => {
      resolve(data);
    });
  });
  let [countdownList, myItems] = await Promise.all([
    countdownListPromise,
    myItemsPromise,
  ]);
  myItems.forEach((item) => {
    const find = countdownList.find(
      (c) =>
        c?.angel?.tokenId === item.tokenId ||
        c?.minion?.tokenId === item.tokenId ||
        c?.skin?.tokenId === item.tokenId
    );
    item.riNextTime = find ? find.lockTime : now;
  });
  if (successCallback) {
    successCallback(myItems);
  }
  dispatch({
    type: ADD_MY_ITEMS,
    payload: myItems,
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
    : StatusList.UNKNOWN;
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
    payload: "UNKNOWN",
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
