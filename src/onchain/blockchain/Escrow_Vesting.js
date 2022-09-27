import { convertOutput, parseEthereumError } from "../utils/common";

const { ethers, BigNumber } = require("ethers");
const config = require("../presale-config");

export class EscrowVesting {
  constructor(provider, escrowAddress) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      escrowAddress,
      config.ESCROW_VESTING_CONTRACT_ABI,
      this.provider
    );
  }

  executeRound = (
    { roundId, projectId, tokenSaleAddress, minUSD, startAt, endAt, isPause },
    {
      vestingId,
      vestingToken,
      TGETime,
      TGEUnlockPercent,
      cliffMonths,
      number0fLinearMonth,
    },
    signer
  ) =>
    this.contract
      .connect(signer)
      .executeRound(
        [roundId, projectId, tokenSaleAddress, minUSD, startAt, endAt, isPause],
        [
          vestingId,
          vestingToken,
          TGETime,
          TGEUnlockPercent,
          cliffMonths,
          number0fLinearMonth,
        ]
      );

  executeVesting = (
    {
      vestingId,
      vestingToken,
      TGETime,
      TGEUnlockPercent,
      cliffMonths,
      number0fLinearMonth,
    },
    signer
  ) =>
    this.contract
      .connect(signer)
      .executeVesting([
        vestingId,
        vestingToken,
        TGETime,
        TGEUnlockPercent,
        cliffMonths,
        number0fLinearMonth,
      ]);

  addFund = (
    {
      vestingId,
      vestingToken,
      TGETime,
      TGEUnlockPercent,
      cliffMonths,
      number0fLinearMonth,
    },
    receiver,
    amount,
    signer
  ) =>
    this.contract
      .connect(signer)
      .addFund(
        [
          vestingId,
          vestingToken,
          TGETime,
          TGEUnlockPercent,
          cliffMonths,
          number0fLinearMonth,
        ],
        receiver,
        amount
      );

  purchase = (
    { roundId, ref, paymentToken, paymentAmount, nationId },
    signer
  ) => {
    let options = {};
    if (paymentToken === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
      options.value = BigNumber.from(paymentAmount);
    }
    return this.contract
      .connect(signer)
      .purchase(roundId, ref, paymentToken, paymentAmount, nationId, {
        ...options,
      });
  };

  withdraw = ({ vestingId }, signer) =>
    this.contract.connect(signer).withdraw(vestingId);

  getListRound = () => this.contract.getListRound();

  getListVesting = () => this.contract.getListVesting();

  getRound = async ({ roundId }) => {
    const arrParseShort = [
      "minUSD",
      "currentSold",
      "totalSupply",
      "nativeTokenPrice",
      "USDPrice",
    ];
    const arrDefault = ["isPause"];
    const [roundData, presaleData] = await Promise.all([
      this.contract
        .mapRound(roundId)
        .then((roundInfo) =>
          convertOutput(roundInfo, arrParseShort, arrDefault)
        ),
      this.contract
        .mapPresaleData(roundId)
        .then((presaleInfo) => convertOutput(presaleInfo, arrParseShort)),
    ]);
    return {
      ...roundData,
      ...presaleData,
    };
  };

  getVestingInfo = ({ roundId }) =>
    this.contract
      .mapVesting(roundId)
      .then((vestingInfo) => convertOutput(vestingInfo));

  getVestingBalance = async ({ investor }) => {
    const arrParseShort = [
      "totalLockAmount",
      "totalUnlockAmount",
      "unlockAmount",
      "percentage",
    ];
    const arrDefault = ["isWithdrawal"];
    const balanceData = await this.contract
      .getVestingBalance(investor)
      .then((balanceInfo) =>
        convertOutput(balanceInfo, arrParseShort, arrDefault)
      );
    return balanceData;
  };
}
