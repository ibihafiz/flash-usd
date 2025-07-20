const contractAddress = "TRxX68zx2rpSKdNwdzXhqLWnp3jcS4k7Fa";

let userAddress = null;

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
			{"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
			{"indexed": true, "internalType": "address", "name": "spender", "type": "address"},
			{"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{"indexed": true, "internalType": "address", "name": "to", "type": "address"},
			{"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"},
			{"indexed": false, "internalType": "uint256", "name": "expiry", "type": "uint256"}
		],
		"name": "Mint",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{"indexed": true, "internalType": "address", "name": "from", "type": "address"},
			{"indexed": true, "internalType": "address", "name": "to", "type": "address"},
			{"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{"internalType": "address", "name": "", "type": "address"},
			{"internalType": "address", "name": "", "type": "address"}
		],
		"name": "allowance",
		"outputs": [
			{"internalType": "uint256", "name": "", "type": "uint256"}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{"internalType": "address", "name": "_spender", "type": "address"},
			{"internalType": "uint256", "name": "_value", "type": "uint256"}
		],
		"name": "approve",
		"outputs": [
			{"internalType": "bool", "name": "", "type": "bool"}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{"internalType": "address", "name": "_owner", "type": "address"}
		],
		"name": "balanceOf",
		"outputs": [
			{"internalType": "uint256", "name": "", "type": "uint256"}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{"internalType": "address", "name": "", "type": "address"}
		],
		"name": "balances",
		"outputs": [
			{"internalType": "uint256", "name": "amount", "type": "uint256"},
			{"internalType": "uint256", "name": "expiry", "type": "uint256"}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{"internalType": "uint8", "name": "", "type": "uint8"}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{"internalType": "address", "name": "_to", "type": "address"},
			{"internalType": "uint256", "name": "_amount", "type": "uint256"},
			{"internalType": "uint256", "name": "_durationInSeconds", "type": "uint256"}
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
		"outputs": [
			{"internalType": "string", "name": "", "type": "string"}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{"internalType": "string", "name": "", "type": "string"}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{"internalType": "uint256", "name": "", "type": "uint256"}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{"internalType": "address", "name": "_to", "type": "address"},
			{"internalType": "uint256", "name": "_value", "type": "uint256"}
		],
		"name": "transfer",
		"outputs": [
			{"internalType": "bool", "name": "", "type": "bool"}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{"internalType": "address", "name": "_from", "type": "address"},
			{"internalType": "address", "name": "_to", "type": "address"},
			{"internalType": "uint256", "name": "_value", "type": "uint256"}
		],
		"name": "transferFrom",
		"outputs": [
			{"internalType": "bool", "name": "", "type": "bool"}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

window.addEventListener('load', async () => {
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
    document.getElementById("balance").innerText = `Balance: ${formatted} USDT`;
  } catch (err) {
    console.error(err);
    document.getElementById("balance").innerText = `Error reading balance`;
  }
});

document.getElementById("mint").addEventListener("click", async () => {
  try {
    const amount = document.getElementById("mint-amount").value;
    const duration = 3600; // 1 hour expiry
    if (!amount || isNaN(amount)) return alert("Invalid amount");

    const contract = await window.tronWeb.contract(CONTRACT_ABI, contractAddress);
    const decimals = await contract.decimals().call();
    const amountToMint = window.tronWeb.toBigNumber(amount).multipliedBy(10 ** decimals);

    const tx = await contract.mint(
      userAddress,
      amountToMint.toFixed(),
      duration
    ).send();

    console.log("Mint TX: ", tx);
    document.getElementById("mint-status").innerText = `Minted ${amount} USDT. TX: ${tx}`;

    setTimeout(() => {
      console.log("⏰ Token Expired (visually)");
      document.getElementById("balance").innerText = `Balance: 0 USDT (Expired)`;
    }, duration * 1000);

  } catch (err) {
    console.error(err);
    document.getElementById("mint-status").innerText = `Mint failed: ${err.message}`;
  }
});
