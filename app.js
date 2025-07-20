const contractAddress = "TLL3Ez552j5WqQx3LDBdr55W2C4MWH3Lcv"; // ✅ Updated contract address

let userAddress = null;

const CONTRACT_ABI = [
  // ✅ Only essential ABI entries needed for frontend interactions
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_amount", "type": "uint256" },
      { "name": "_durationInSeconds", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

window.addEventListener("load", async () => {
  if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
    alert("Please install TronLink and login first.");
    return;
  }

  userAddress = window.tronWeb.defaultAddress.base58;
  document.getElementById("wallet").innerText = `Wallet: ${userAddress}`;
});

document.getElementById("connect").addEventListener("click", async () => {
  try {
    if (window.tronLink) {
      await window.tronLink.request({ method: 'tron_requestAccounts' });
      userAddress = window.tronWeb.defaultAddress.base58;
      document.getElementById("wallet").innerText = `Wallet: ${userAddress}`;
    }
  } catch (e) {
    console.error(e);
  }
});

document.getElementById("check-balance").addEventListener("click", async () => {
  try {
    const contract = await window.tronWeb.contract(CONTRACT_ABI, contractAddress);
    const balance = await contract.balanceOf(userAddress).call();
    const decimals = await contract.decimals().call();
    const formatted = window.tronWeb.toBigNumber(balance).dividedBy(10 ** decimals).toString();
    document.getElementById("balance").innerText = `Balance: ${formatted} FUSDT`;
  } catch (err) {
    console.error(err);
    document.getElementById("balance").innerText = `Error reading balance`;
  }
});

document.getElementById("mint").addEventListener("click", async () => {
  try {
    const amount = document.getElementById("mint-amount").value;
    if (!amount || isNaN(amount)) return alert("Invalid amount");

    const contract = await window.tronWeb.contract(CONTRACT_ABI, contractAddress);
    const decimals = await contract.decimals().call();
    const amountToMint = window.tronWeb.toBigNumber(amount).multipliedBy(10 ** decimals);
    const duration = 120; // seconds

    const tx = await contract.mint(userAddress, amountToMint.toFixed(), duration).send();
    console.log("Mint TX: ", tx);
    document.getElementById("mint-status").innerText = `Minted ${amount} FUSDT. TX: ${tx}`;
  } catch (err) {
    console.error(err);
    document.getElementById("mint-status").innerText = `Mint failed: ${err.message}`;
  }
});
