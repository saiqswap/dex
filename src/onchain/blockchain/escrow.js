import { ADDRESS_0 } from "../../settings/constants";

const ethers = require("ethers");
const config = require("../presale-config");
const common = require("../utils/common");

export class Escrow {
  constructor(nodeRpcURL, escrowAddress) {
    this.provider = new ethers.providers.JsonRpcProvider(nodeRpcURL);
    this.contract = new ethers.Contract(
      escrowAddress,
      config.ESCROW_CONTRACT_ABI,
      this.provider
    );
  }

  // EXECUTE transaction
  addFund = ({ _roundId, _receiver, _tokenSaleAddress, _amount, signer }) =>
    this.contract
      .connect(signer)
      .addFund(_roundId, _receiver, _tokenSaleAddress, _amount);

  executeRound = ({
    _roundId,
    _projectId,
    _tokenSaleAddress,
    _minUSD,
    _startAt,
    _endAt,
    _isPause,
    signer,
  }) =>
    this.contract
      .connect(signer)
      .executeRound(
        _roundId,
        _projectId,
        _tokenSaleAddress,
        _minUSD,
        _startAt,
        _endAt,
        _isPause
      );

  purchase = ({ _roundId, _ref, _paymentToken, _paymentAmount, signer }) => {
    let options = {};
    if (_paymentToken === ADDRESS_0) {
      options.value = _paymentAmount;
    }
    return this.contract
      .connect(signer)
      .purchase(_roundId, _ref, _paymentToken, _paymentAmount, { ...options });
  };

  getListRound = async () => {
    const arrRoundId = await this.contract.getListRound();
    return arrRoundId;
  };

  rounds = async ({ _roundId }) => {
    const arrParseShort = [
      "minUSD",
      "currentSold",
      "totalSupply",
      "nativeTokenPrice",
      "USDPrice",
    ];
    const detailRound = await this.contract.rounds(_roundId);
    return (await common.convertOutput([detailRound], arrParseShort))[0];
  };

  // // get specific token balance
  // getBalance = async (investor) => {
  //   const balance = await this.contract.getBalance(investor);
  //   return common.convertLongToShortNumber(balance);
  // };

  // round = async () => {
  //   const data = await this.contract.round();
  //   return (await common.convertOutput([data]))[0];
  // };

  // // Purchase Token
  // purchaseToken = async (referral, bnbAmount) => {
  //   const options = {
  //     value: common.convertShortToLongNumber(bnbAmount),
  //   };
  //   const tx = await this.contract.purchaseToken(referral, options);
  //   return common.getReceiptFromTxHash(tx.hash);
  // };
}

// test

export const _testEscrow = async () => {
  try {
    const ESCROW = new Escrow(
      config.NODE_RPC_URL,
      config.ESCROW_CONTRACT_ADDRESS
    );

    // ------ get list round ------
    const arrRounds = await ESCROW.getListRound();
    console.log("ESCROW.getListRound: ", arrRounds);

    // ------ get detail round ------
    const roundsInput = {
      _roundId: "0x0000000000000000000000000000000000000001",
    };
    const detailRound = await ESCROW.rounds(roundsInput);
    console.log("ESCROW.rounds: ", detailRound);

    // ------ purchase token ------
    const signerBuyer_privatekey =
      "251427a704d4c578c00f3126af1a23e1fad00db69222248ed346eda1d00e02ac";
    const signerBuyer = new ethers.Wallet(
      signerBuyer_privatekey,
      ESCROW.provider
    );
    console.log("Buyer: ", signerBuyer.address);
    const purchaseInput = {
      _roundId: "0x0000000000000000000000000000000000000001",
      _ref: "1108b3c3e02e6b8857aacb9a04b37c7d",
      _paymentToken: "0x267d372CfD1C28f347cBeE9e2ff7a1315F06d2a2",
      _paymentAmount: "6000000000000000000",
      signer: signerBuyer,
    };
    const txPurchase = await ESCROW.purchase(purchaseInput);
    const rsPurchase = await common.getReceiptFromTxHash(
      ESCROW.provider,
      txPurchase.hash
    );
    console.log("ESCROW.purchase: ", rsPurchase);

    // ------ create or update round ------
    const signerOnwer_privatekey =
      "172e30ccbf4f740aae885b7b9eb6120a2009b25055c7234150ea96473183d267";
    const signerOnwer = new ethers.Wallet(
      signerOnwer_privatekey,
      ESCROW.provider
    );
    const executeRoundInput = {
      _roundId: "0x0000000000000000000000000000000000000001",
      _projectId: "297758f45780c6106cfd928a1bd68b12",
      _tokenSaleAddress: "0x18a74a76dFB3A2c1373C227705980C1748B3b70E",
      _minUSD: "500000000000000000",
      _startAt: "1662660701",
      _endAt: "1662747101",
      _isPause: false,
      signer: signerOnwer,
    };
    const txExecuteRound = await ESCROW.executeRound(executeRoundInput);
    const rsExecuteRound = await common.getReceiptFromTxHash(
      ESCROW.provider,
      txExecuteRound.hash
    );
    console.log("ESCROW.executeRound: ", rsExecuteRound);

    // purchase 100$ -> 15000 ING

    //

    // special vesting with another thông số
    // tạo ra 1 round riêng để trả vesting đặt biệt
    // ------ add fund to anyone for vesting ------
    const addFundInput = {
      _roundId: "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c",
      _receiver: "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c",
      _tokenSaleAddress: "0x18a74a76dFB3A2c1373C227705980C1748B3b70E",
      _amount: "24000000000000000000",
      signer: signerOnwer,
    };
    const txAddFund = await ESCROW.addFund(addFundInput);
    const rsAddFund = await common.getReceiptFromTxHash(
      ESCROW.provider,
      txAddFund.hash
    );
    console.log("ESCROW.addFund: ", rsAddFund);
  } catch (error) {
    console.log(common.parseEthereumError(error));
  }
};
