import { convertOutput } from "../utils/common";

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

// test

// const test = async () => {
//   try {
//     const ESCROW_VESTING = new EscrowVesting(
//       config.PROVIDER,
//       config.ESCROW_VESTING_CONTRACT_ADDRESS
//     );

//     // ------ getListRound ------
//     const arr_round = await ESCROW_VESTING.getListRound();
//     console.log("ESCROW_VESTING.getListRound: ", arr_round);

//     // // ------ getListVesting ------
//     const arr_vesting = await ESCROW_VESTING.getListVesting();
//     console.log("ESCROW_VESTING.getListVesting: ", arr_vesting);

//     // // ------ getRound ------
//     const detailRound = await ESCROW_VESTING.getRound({
//       roundId: "0x0000000000000000000000000000000000000006",
//     });
//     console.log("ESCROW_VESTING.getRound: ", detailRound);

//     // ------ getVestingInfo ------
//     const detailVesting = await ESCROW_VESTING.getVestingInfo({
//       roundId: "0x0000000000000000000000000000000000000006",
//     });
//     console.log("ESCROW_VESTING.getVestingInfo: ", detailVesting);

//     // ------ getVestingBalance ------
//     const detailBalance = await ESCROW_VESTING.getVestingBalance({
//       investor: "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c",
//     });
//     console.log("ESCROW_VESTING.getVestingBalance: ", detailBalance[3]);

//     ////////////////////////   ADMIN   /////////////////////
//     const signerOnwer_privatekey =
//       "172e30ccbf4f740aae885b7b9eb6120a2009b25055c7234150ea96473183d267";
//     const signerOnwer = new ethers.Wallet(
//       signerOnwer_privatekey,
//       ESCROW_VESTING.provider
//     );

//     // // ------ create or update round ------
//     // const txExecuteRound = await ESCROW_VESTING.executeRound(
//     //     {
//     //         roundId: "0x0000000000000000000000000000000000000006",
//     //         projectId: "297758f45780c6106cfd928a1bd68b12",
//     //         tokenSaleAddress: "0x18a74a76dFB3A2c1373C227705980C1748B3b70E",
//     //         minUSD: "10000000000000000",
//     //         startAt: 1663091400,
//     //         endAt: 1663127400,
//     //         isPause: false,
//     //         signer: signerOnwer,
//     //     },
//     //     {
//     //         vestingId: "0x0000000000000000000000000000000000000006",
//     //         vestingToken: "0x18a74a76dFB3A2c1373C227705980C1748B3b70E",
//     //         TGETime: 1663128000,
//     //         TGEUnlockPercent: 20,
//     //         cliffMonths: 3,
//     //         number0fLinearMonth: 6,
//     //     },
//     //     signerOnwer
//     // );
//     // const rsExecuteRound = await common.getReceiptFromTxHash(ESCROW_VESTING.provider, txExecuteRound.hash);
//     // console.log("ESCROW_VESTING.executeRound: ", rsExecuteRound);

//     // ------ tx_executeVesting ------
//     // const tx_executeVesting = await ESCROW_VESTING.executeVesting(
//     //     {
//     //         vestingId: "0x0000000000000000000000000000000000000006",
//     //         vestingToken: "0x18a74a76dFB3A2c1373C227705980C1748B3b70E",
//     //         TGETime: 1663128001,
//     //         TGEUnlockPercent: 22,
//     //         cliffMonths: 4,
//     //         number0fLinearMonth: 7,
//     //     },
//     //     signerOnwer
//     // );
//     // const rs_executeVesting = await common.getReceiptFromTxHash(ESCROW_VESTING.provider, tx_executeVesting.hash);
//     // console.log("ESCROW_VESTING.executeVesting: ", rs_executeVesting);

//     // ------ tx_addFund ------
//     // const tx_addFund = await ESCROW_VESTING.addFund(
//     //     {
//     //         vestingId: "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c",
//     //         vestingToken: "0x18a74a76dFB3A2c1373C227705980C1748B3b70E",
//     //         TGETime: 1662970206,
//     //         TGEUnlockPercent: 12,
//     //         cliffMonths: 3,
//     //         number0fLinearMonth: 19,
//     //     },
//     //     "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c",
//     //     "124000000000000000000",
//     //     signerOnwer
//     // );
//     // const rs_addFund = await common.getReceiptFromTxHash(ESCROW_VESTING.provider, tx_addFund.hash);
//     // console.log("ESCROW_VESTING.addFund: ", rs_addFund);

//     ////////////////////////   USER   /////////////////////
//     const signerUser_privatekey =
//       "251427a704d4c578c00f3126af1a23e1fad00db69222248ed346eda1d00e02ac";
//     const signerUser = new ethers.Wallet(
//       signerUser_privatekey,
//       ESCROW_VESTING.provider
//     );

//     // // ------ purchase ------
//     // const tx_purchase = await ESCROW_VESTING.purchase(
//     //     {
//     //         roundId: "0x0000000000000000000000000000000000000006",
//     //         ref: "1108b3c3e02e6b8857aacb9a04b37c7d",
//     //         paymentToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//     //         paymentAmount: "30000000000000000",
//     //         nationId: 234,
//     //     },
//     //     signerUser
//     // );
//     // const rs_purchase = await common.getReceiptFromTxHash(ESCROW_VESTING.provider, tx_purchase.hash);
//     // console.log("ESCROW_VESTING.purchase: ", rs_purchase);

//     // // ------ withdraw ------
//     // const tx_withdraw = await ESCROW_VESTING.withdraw(
//     //     {
//     //         vestingId: "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c",
//     //     },
//     //     signerUser
//     // );
//     // const rs_withdraw = await common.getReceiptFromTxHash(ESCROW_VESTING.provider, tx_withdraw.hash);
//     // console.log("ESCROW_VESTING.withdraw: ", rs_withdraw);
//   } catch (error) {
//     console.log(parseEthereumError(error));
//   }
// };

// test();
