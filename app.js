const CONTRACT_ADDRESS = "TRDrVmYDYBDGAPZo6Htp9mJ8cxJnYPukbB";

const CONTRACT_ABI = [
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
			{ "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
			{ "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "to", "type": "address" },
			{ "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" },
			{ "indexed": false, "internalType": "uint256", "name": "expiry", "type": "uint256" }
		],
		"name": "Mint",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "from", "type": "address" },
			{ "indexed": true, "internalType": "address", "name": "to", "type": "address" },
			{ "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{ "internalType": "address", "name": "", "type": "address" },
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"name": "allowance",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{ "internalType": "address", "name": "_spender", "type": "address" },
			{ "internalType": "uint256", "name": "_value", "type": "uint256" }
		],
		"name": "approve",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }],
		"name": "balanceOf",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [{ "internalType": "address", "name": "", "type": "address" }],
		"name": "balances",
		"outputs": [
			{ "internalType": "uint256", "name": "amount", "type": "uint256" },
			{ "internalType": "uint256", "name": "expiry", "type": "uint256" }
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{ "internalType": "address", "name": "_to", "type": "address" },
			{ "internalType": "uint256", "name": "_amount", "type": "uint256" },
			{ "internalType": "uint256", "name": "_durationInSeconds", "type": "uint256" }
		],
		"name": "mint",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [{ "internalType": "string", "name": "", "type": "string" }],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [{ "internalType": "address", "name": "", "type": "address" }],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [{ "internalType": "string", "name": "", "type": "string" }],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{ "internalType": "address", "name": "_to", "type": "address" },
			{ "internalType": "uint256", "name": "_value", "type": "uint256" }
		],
		"name": "transfer",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{ "internalType": "address", "name": "_from", "type": "address" },
			{ "internalType": "address", "name": "_to", "type": "address" },
			{ "internalType": "uint256", "name": "_value", "type": "uint256" }
		],
		"name": "transferFrom",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let contract;
let userAddress;

window.addEventListener("load", async () => {
  if (window.tronWeb && window.tronWeb.ready) {
    userAddress = window.tronWeb.defaultAddress.base58;
    document.getElementById("wallet").innerText = `Wallet: ${userAddress}`;
    contract = await window.tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  } else {
    document.getElementById("wallet").innerText = "Wallet: Not Connected";
  }
});

// Connect Button
document.getElementById("connect").addEventListener("click", async () => {
  if (window.tronLink) {
    await window.tronLink.request({ method: "tron_requestAccounts" });
    userAddress = window.tronWeb.defaultAddress.base58;
    document.getElementById("wallet").innerText = `Wallet: ${userAddress}`;
    contract = await window.tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  } else {
    alert("TronLink is not installed.");
  }
});

// Mint Button
document.getElementById("mint").addEventListener("click", async () => {
  const amountInput = document.getElementById("mint-amount");
  const statusDiv = document.getElementById("mint-status");
  const rawAmount = amountInput.value;

  if (!rawAmount || isNaN(rawAmount) || parseFloat(rawAmount) <= 0) {
    statusDiv.innerText = "❌ Invalid amount!";
    return;
  }

  const amount = window.tronWeb.toSun(rawAmount); // 6 decimals
  const duration = 3600; // 1 hour expiry

  try {
    statusDiv.innerText = "⏳ Minting...";
    await contract.mint(userAddress, amount, duration).send();
    statusDiv.innerText = `✅ Successfully minted ${rawAmount} FUSDT!`;
  } catch (err) {
    console.error(err);
    statusDiv.innerText = "❌ Mint failed.";
  }
});

// Balance Button
document.getElementById("check-balance").addEventListener("click", async () => {
  if (!contract || !userAddress) return;

  try {
    const balance = await contract.methods.balanceOf(userAddress).call();
    document.getElementById("balance").innerText = `Balance: ${window.tronWeb.fromSun(balance)} FUSDT`;
  } catch (err) {
    console.error(err);
    document.getElementById("balance").innerText = "Balance: Error";
  }
});
