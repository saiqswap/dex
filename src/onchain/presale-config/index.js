const { providers, utils } = require("ethers");
const ABI = require("./abi");

module.exports = {
  // ESCROW_VESTING_CONTRACT_ADDRESS: "0xaF9Cbc0B8BCd86660f83e71fac20c72D1f924E53", //testnet
  ESCROW_VESTING_CONTRACT_ADDRESS: "0xd1DDAe37c9Cf35c52742b9a5643D386B8930d3C2",
  ESCROW_VESTING_CONTRACT_ABI: ABI.Escrow_Vesting,
  ESCROW_VESTING_CONTRACT_IFACE: new utils.Interface(ABI.Escrow_Vesting),

  // PROVIDER: new providers.JsonRpcProvider(
  //   "https://matic-mumbai.chainstacklabs.com/"
  // ),
  PROVIDER: new providers.JsonRpcProvider("https://rpc.ankr.com/bsc"),
  // PROVIDER: new providers.JsonRpcProvider("http://65.108.226.152:8545"),
};
