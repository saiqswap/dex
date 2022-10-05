import { ethers } from "ethers";
import { toast } from "react-toastify";
import { config } from "../settings";
import { BIT_BULL_ADDRESS_0, PRE_SALE_ROUNDS } from "../settings/constants";
import { EscrowVesting } from "./blockchain/Escrow_Vesting";
import { provider, signer } from "./onchain";
import { getReceiptFromTxHash, parseEthereumError } from "./utils/common";

const ESCROW_VESTING = new EscrowVesting(
  config.DEFAULT_PROVIDER,
  config.ESCROW_VESTING_CONTRACT_ADDRESS
);

export const _getPreSaleRounds = async (_callback) => {
  try {
    const roundList = [];
    for (let staticDetailData of PRE_SALE_ROUNDS) {
      const roundsInput = {
        roundId: staticDetailData.roundId,
      };
      const onchainDetailRound = await ESCROW_VESTING.getRound(roundsInput);
      if (staticDetailData.roundId === onchainDetailRound.roundId) {
        const detailRound = { ...staticDetailData, ...onchainDetailRound };
        roundList.push(detailRound);
      } else {
        roundList.push(staticDetailData);
      }
    }
    _callback(roundList);
  } catch (error) {
    console.log(error);
    _showError(error);
  }
};

export const _checkBeforePurchase = async (
  addressApproved,
  tokenERC20Address,
  amountNeeded,
  walletAddress,
  _handleErrorCallback
) => {
  try {
    if (tokenERC20Address === BIT_BULL_ADDRESS_0) return true;

    const contractInstance = new ethers.Contract(
      tokenERC20Address,
      config.BLOCKCHAIN.ERC20_ABI,
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
        config.BLOCKCHAIN.ERC20_ABI,
        signer
      );

      const tx = await contractWithSigner.approve(
        addressApproved,
        amountNeeded
      );

      var approveSuccess = await _getReceipt(tx.hash);

      if (!approveSuccess) {
        _handleErrorCallback();
        return false;
      }

      if (approveSuccess) return true;

      return false;
    } else {
      toast.error(`Unavailable balance`);
      _handleErrorCallback();
    }
  } catch (error) {
    console.log(error);
    _showError(error);
    _handleErrorCallback(error);
  }
};

export const _getReceipt = async (txHash) => {
  try {
    const receipt = await provider.waitForTransaction(txHash);
    if (receipt.status === 1) {
      return true;
    } else {
      console.log("Transaction error with status code 0");
      return false;
    }
  } catch (error) {
    _showError(error);
  }
};

export const _purchase = async (
  roundId,
  ref,
  paymentToken,
  paymentAmount,
  _handleErrorCallback
) => {
  try {
    const purchaseInput = {
      roundId,
      ref,
      paymentToken,
      paymentAmount,
      nationId: 0,
    };
    const tx = await ESCROW_VESTING.purchase(purchaseInput, signer);
    return tx.hash;
  } catch (error) {
    console.log(error);
    _showError(error);
    _handleErrorCallback();
  }
};

export const _showError = (error) => {
  console.log(error);
  toast.error(parseEthereumError(error));
};

export const _getVestingBalance = async (investor) => {
  try {
    const detailBalance = await ESCROW_VESTING.getVestingBalance({
      investor: investor,
    });
    return detailBalance;
  } catch (error) {
    return 0;
  }
};

export const _claimToken = async (vestingId, _handleSuccess, _handleError) => {
  try {
    const tx_withdraw = await ESCROW_VESTING.withdraw(
      {
        vestingId,
      },
      signer
    );
    const rs_withdraw = await getReceiptFromTxHash(
      ESCROW_VESTING.provider,
      tx_withdraw.hash
    );
    console.log("ESCROW_VESTING.withdraw: ", rs_withdraw);
    if (rs_withdraw.isSuccess) {
      _handleSuccess();
    } else {
      _handleError();
    }
  } catch (error) {
    _handleError();
    this._showError(error);
  }
};
