import { constants, ethers } from "ethers";
import { toast } from "react-toastify";
import { AppConfig } from "../settings";
import { ADDRESS_0 } from "../settings/constants";

export let prefix = null;
export let provider = null;
export let signer = null;

export const _checkLogin = async (walletName, _updateAddress, _handleError) => {
  _setProvider(walletName, async () => {
    try {
      const address = await signer.getAddress();
      _updateAddress(address, walletName);
    } catch (error) {
      console.log(error);
    }
  });
};

export const _setProvider = async (walletName, _callback) => {
  if (walletName === "bitkeep") {
    prefix = window.bitkeep.ethereum;
  } else {
    prefix = window.ethereum;
  }
  provider = new ethers.providers.Web3Provider(prefix, "any");
  signer = provider.getSigner();
  _callback();
};

export const _checkOldWalletAddress = async (walletAddress = "", _callback) => {
  try {
    const address = await signer.getAddress();
    if (address === walletAddress) {
      _callback(true);
    } else {
      _callback(false);
    }
  } catch (error) {
    _callback(false);
  }
};

export const _connectToMetamaskWallet = (walletName, _updateAddress) => {
  _setProvider(walletName, async () => {
    if (prefix) {
      try {
        const accounts = await prefix.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        _updateAddress(address, walletName);
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error("Please install wallet");
    }
  });
};

//change network when wrong BSC chain
export const _changeChain = async (_handleSuccess) => {
  await prefix.request({
    method: "wallet_addEthereumChain",
    params: [AppConfig.BLOCKCHAIN.config.CHAIN_INFO],
  });
  _handleSuccess();
};

export const checkBeforeBuy = async (
  addressApproved,
  tokenERC20Address,
  amountNeeded,
  walletAddress,
  _handleErrorCallback
) => {
  try {
    if (tokenERC20Address === constants.AddressZero) return true;

    const contractInstance = new ethers.Contract(
      tokenERC20Address,
      AppConfig.BLOCKCHAIN.ERC20_ABI,
      provider
    );

    var balance = await contractInstance.balanceOf(walletAddress);

    var approveAmount = await contractInstance.allowance(
      walletAddress,
      addressApproved
    );

    if (
      Number(ethers.utils.formatEther(approveAmount.toString())) >=
      Number(ethers.utils.formatEther(amountNeeded))
    ) {
      return true;
    }

    if (
      Number(ethers.utils.formatEther(balance)) >=
      Number(ethers.utils.formatEther(amountNeeded))
    ) {
      const contractWithSigner = new ethers.Contract(
        tokenERC20Address,
        AppConfig.BLOCKCHAIN.ERC20_ABI,
        signer
      );

      const tx = await contractWithSigner.approve(
        addressApproved,
        amountNeeded
      );

      var approveSuccess = await getReceipt(tx.hash);

      if (!approveSuccess) {
        _handleErrorCallback();
        return false;
      }

      if (approveSuccess) return true;

      // approveAmount = await contractInstance.allowance(
      //   walletAddress,
      //   addressApproved
      // );
      return false;
    } else {
      toast.error(`Unavailable balance`);
      _handleErrorCallback();
    }
  } catch (error) {
    console.log(error);
    _handleErrorCallback(error);
  }
};

export const purchaseBox = async (
  inputData,
  value,
  paymentContract,
  config,
  _handleErrorCallback
) => {
  try {
    const contractInstance = new ethers.Contract(
      config.purchaseContract,
      AppConfig.BLOCKCHAIN.PURCHASE_ITEM_ABI,
      signer
    );

    const tx =
      paymentContract === ADDRESS_0
        ? await contractInstance.purchase(inputData, { value })
        : await contractInstance.purchase(inputData);

    return tx.hash;
  } catch (error) {
    _handleErrorCallback();
    console.log(error);
  }
};

export const purchaseSlot = async (
  inputData,
  value,
  paymentContract,
  config,
  _handleErrorCallback
) => {
  try {
    console.log({
      inputData,
      value,
      paymentContract,
      config,
    });

    const contractInstance = new ethers.Contract(
      config.purchaseContract,
      AppConfig.BLOCKCHAIN.PURCHASE_ITEM_ABI,
      signer
    );

    const tx =
      paymentContract === ADDRESS_0
        ? await contractInstance.purchase(inputData, { value })
        : await contractInstance.purchase(inputData);
    return tx.hash;
  } catch (error) {
    console.log(error);
    _handleErrorCallback();
  }
};

export const getReceipt = async (txHash) => {
  try {
    const receipt = await provider.waitForTransaction(txHash);
    if (receipt.status === 1) {
      return true;
    } else {
      console.log("Transaction error with status code 0");
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const purchaseECR721 = async (
  inputData,
  value,
  paymentContract,
  config,
  _handleErrorCallback
) => {
  try {
    const contractInstance = new ethers.Contract(
      config.marketplaceContract,
      AppConfig.BLOCKCHAIN.EXCHANGE_ABI,
      signer
    );

    const tx =
      paymentContract === ADDRESS_0
        ? await contractInstance.purchaseERC721(inputData, { value })
        : await contractInstance.purchaseERC721(inputData);

    return tx.hash;
  } catch (error) {
    if (error?.data?.code === -32000) {
      toast.error(`Unavailable balance`);
    }
    _handleErrorCallback();
  }
};

export const _addToken = async ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
}) => {
  try {
    console.log({
      tokenAddress,
      tokenSymbol,
      tokenDecimals,
      tokenImage,
    });
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await prefix.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });
    if (wasAdded) {
      console.log("Thanks for your interest!");
    } else {
      console.log("Your loss!");
    }
  } catch (error) {
    console.log(error);
  }
};
