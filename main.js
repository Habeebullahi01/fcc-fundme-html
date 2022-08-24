import { Contract, ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connectButton");
const fundBtn = document.getElementById("fundButton");
const balanceBtn = document.getElementById("balance");
const withdrawButton = document.getElementById("withdrawButton");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectBtn.innerHTML = "Connected";
  } else {
    console.log("Metamask not found");
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    console.log(`Funding contract with ${ethAmount} ETH`);
    // provider/connection to the blockchain (ethers)
    // Signer/an account with gas (metamask connected account)
    // Contract to interact with (contract address deployed on the blochain(hardhat local node/rinkeby/ethereum mainnet))
    // ABI and address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTxMined(txResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  console.log("Withdrawing...");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txResponse = await contract.Withdraw();
      await listenForTxMined(txResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTxMined(txResponse, provider) {
  console.log(`Mining ${txResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (txReceipt) => {
      console.log(`Completed with ${txReceipt.confirmations} confirmations.`);
      resolve();
    });
  });
}

connectBtn.onclick = connect;

fundBtn.onclick = fund;

balanceBtn.onclick = getBalance;

withdrawButton.onclick = withdraw;
