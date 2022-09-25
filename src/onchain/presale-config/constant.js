const config = require("./index");
const { utils } = require("ethers");

const START_BLOCK = 28066135;

module.exports = {
  EVENT_ExecuteRound: (latestBlock, eventName = "ExecuteRound") => ({
    filter: {
      fromBlock: START_BLOCK,
      toBlock: Number(latestBlock),
      topics: [config.ESCROW_VESTING_CONTRACT_IFACE.getEventTopic(eventName)],
      address: [config.ESCROW_VESTING_CONTRACT_ADDRESS],
    },
    eventName,
    arrParseShort: ["minUSD"],
    arrDefault: ["isPause"],
  }),
  EVENT_ExecuteVesting: (latestBlock, eventName = "ExecuteVesting") => ({
    filter: {
      fromBlock: START_BLOCK,
      toBlock: Number(latestBlock),
      topics: [config.ESCROW_VESTING_CONTRACT_IFACE.getEventTopic(eventName)],
      address: [config.ESCROW_VESTING_CONTRACT_ADDRESS],
    },
    eventName,
    arrParseShort: [],
    arrDefault: [],
  }),

  EVENT_AddFund: (latestBlock, eventName = "AddFund") => ({
    filter: {
      fromBlock: START_BLOCK,
      toBlock: Number(latestBlock),
      topics: [config.ESCROW_VESTING_CONTRACT_IFACE.getEventTopic(eventName)],
      address: [config.ESCROW_VESTING_CONTRACT_ADDRESS],
    },
    eventName,
    arrParseShort: ["amount"],
    arrDefault: [],
  }),

  EVENT_Purchase: (latestBlock, userAddress, eventName = "Purchase") => ({
    filter: {
      fromBlock: START_BLOCK,
      toBlock: Number(latestBlock),
      topics: [
        config.ESCROW_VESTING_CONTRACT_IFACE.getEventTopic(eventName),
        null,
        null,
        utils.hexZeroPad(userAddress, 32),
      ],
      address: [config.ESCROW_VESTING_CONTRACT_ADDRESS],
    },
    eventName,
    arrParseShort: ["paymentAmout", "tokenAmount"],
    arrDefault: ["ref", "isReceiveToken"],
  }),

  EVENT_Withdraw: (latestBlock, userAddress, eventName = "Withdraw") => ({
    filter: {
      fromBlock: START_BLOCK,
      toBlock: Number(latestBlock),
      topics: [
        config.ESCROW_VESTING_CONTRACT_IFACE.getEventTopic(eventName),
        null,
        utils.hexZeroPad(userAddress, 32),
      ],
      address: [config.ESCROW_VESTING_CONTRACT_ADDRESS],
    },
    eventName,
    arrParseShort: ["totalUnlockAmount", "totalLockAmount"],
    arrDefault: [],
  }),
};
