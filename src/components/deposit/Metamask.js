import { InfuraProvider } from "@ethersproject/providers";
import { Button, Grid, TextField } from "@mui/material";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ENDPOINT_GET_ADDRESS } from "../../settings/endpoint";
import { deleteText, formatAddress } from "../../settings/format";
import { _getBalance } from "../../store/actions/userActions";
import { get } from "../../utils/api";

// const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

// const usdc = {
//   address: "0x516de3a7A567d81737e3a46ec4FF9cFD1fcb0136",
//   abi: [
//     "function gimmeSome() external",
//     "function balanceOf(address _owner) public view returns (uint256 balance)",
//     "function transfer(address _to, uint256 _value) public returns (bool success)",
//   ],
// };

// async function mintUsdc() {
//   await provider.send("eth_requestAccounts", []);
//   const signer = provider.getSigner();
//   let userAddress = await signer.getAddress();
//   const usdcContract = new ethers.Contract(usdc.address, usdc.abi, signer);

//   const tx = await usdcContract.gimmeSome({ gasPrice: 20e9 });
//   console.log(`Transaction hash: ${tx.hash}`);

//   const receipt = await tx.wait();
//   console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
//   console.log(`Gas used: ${receipt.gasUsed.toString()}`);
// }

export default function Metamask() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState(null);
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  let [amount, setAmount] = useState("");

  // useEffect(() => {
  //   get(
  //     ENDPOINT_GET_ADDRESS + "?network=TRC20",
  //     (data) => {
  //       console.log(data);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }, []);

  const usdc = {
    address: "0x516de3a7A567d81737e3a46ec4FF9cFD1fcb0136",
    abi: [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function gimmeSome() external",
      "function balanceOf(address _owner) public view returns (uint256 balance)",
      "function transfer(address _to, uint256 _value) public returns (bool success)",
    ],
  };

  async function main() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();
    setAddress(userAddress);
    const usdcContract = new ethers.Contract(usdc.address, usdc.abi, signer);
    let usdcBalance = await usdcContract.balanceOf(userAddress);
    usdcBalance = ethers.utils.formatUnits(usdcBalance, 6);
    setBalance(usdcBalance);
  }

  useEffect(() => {
    main();
  }, []);

  async function transferUsdc() {
    let receiver = "TML5Gpkr58o4c4C7hz4ZzegrETDtao4JQN";
    // let amount = amount;
    let response;

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();

    const usdcContract = new ethers.Contract(usdc.address, usdc.abi, signer);

    try {
      receiver = ethers.utils.getAddress(receiver);
    } catch {
      response = `Invalid address: ${receiver}`;
      document.getElementById("transferResponse").innerText = response;
      document.getElementById("transferResponse").style.display = "block";
    }

    try {
      amount = ethers.utils.parseUnits(amount, 6);
      if (amount.isNegative()) {
        throw new Error();
      }
    } catch {
      console.error(`Invalid amount: ${amount}`);
      response = `Invalid amount: ${amount}`;
      document.getElementById("transferResponse").innerText = response;
      document.getElementById("transferResponse").style.display = "block";
    }

    const balance = await usdcContract.balanceOf(userAddress);

    if (balance.lt(amount)) {
      let amountFormatted = ethers.utils.formatUnits(amount, 6);
      let balanceFormatted = ethers.utils.formatUnits(balance, 6);
      console.error(
        `Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`
      );

      response = `Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`;
      document.getElementById("transferResponse").innerText = response;
      document.getElementById("transferResponse").style.display = "block";
    }
    let amountFormatted = ethers.utils.formatUnits(amount, 6);

    response = `Transferring ${amountFormatted} USDC receiver ${receiver.slice(
      0,
      6
    )}...`;
    document.getElementById("transferResponse").innerText = response;
    document.getElementById("transferResponse").style.display = "block";

    const tx = await usdcContract.transfer(receiver, amount, {
      gasPrice: 20e9,
    });
    document.getElementById(
      "transferResponse"
    ).innerText += `Transaction hash: ${tx.hash}`;

    const receipt = await tx.wait();
    document.getElementById(
      "transferResponse"
    ).innerText += `Transaction confirmed in block ${receipt.blockNumber}`;
  }

  return (
    <div>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div>Balance: {balance} USDT</div>
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder={`Max: ${balance} USDT`}
              label="Amount"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(deleteText(e.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={transferUsdc} fullWidth variant="outlined">
              Send
            </Button>
          </Grid>
          <Grid item xs={12}>
            <div id="transferResponse"></div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
