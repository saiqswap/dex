const config = require("../config");
const constant = require("../config/constant");
const common = require("../utils/common");

(async () => {
    const latestBlock = await config.PROVIDER.getBlockNumber();

    // ExecuteRound
    const ExecuteRound = await common.convertEvent(constant.EVENT_ExecuteRound(latestBlock));
    console.log("ExecuteRound: ", ExecuteRound);

    // ExecuteVesting
    const ExecuteVesting = await common.convertEvent(constant.EVENT_ExecuteVesting(latestBlock));
    console.log("ExecuteVesting: ", ExecuteVesting);

    // AddFund
    const AddFund = await common.convertEvent(constant.EVENT_AddFund(latestBlock));
    console.log("AddFund: ", AddFund);

    // Purchase
    const userAddress_Purchase = "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c";
    const Purchase = await common.convertEvent(constant.EVENT_Purchase(latestBlock, userAddress_Purchase));
    console.log("Purchase: ", Purchase);

    // Withdraw
    const userAddress_Withdraw = "0x9f473D349B1f38e7fd6EAa02D82b53B970Fa580c";
    const Withdraw = await common.convertEvent(constant.EVENT_Withdraw(latestBlock, userAddress_Withdraw));
    console.log("Withdraw: ", Withdraw);
})();
