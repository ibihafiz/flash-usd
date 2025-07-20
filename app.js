document.addEventListener("DOMContentLoaded", async function () {
  const CONTRACT_ADDRESS = "TRDrVmYDYBDGAPZo6Htp9mJ8cxJnYPukbB";
  const CONTRACT_ABI = [
    {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
    {"constant":false,"inputs":[
      {"internalType":"address","name":"_to","type":"address"},
      {"internalType":"uint256","name":"_amount","type":"uint256"},
      {"internalType":"uint256","name":"_durationInSeconds","type":"uint256"}
    ],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
  ];

  let contractInstance = null;

  const mintButton = document.getElementById("mint");
  const connectButton = document.getElementById("connect");
  const statusDiv = document.getElementById("mint-status");
  const balanceDiv = document.getElementById("balance");

  connectButton.addEventListener("click", async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      document.getElementById("wallet").innerText =
        "Wallet: " + window.tronWeb.defaultAddress.base58;

      contractInstance = await window.tronWeb.contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
    } else {
      alert("Please connect TronLink Wallet");
    }
  });

  mintButton.addEventListener("click", async () => {
    try {
      const amountInput = document.getElementById("mint-amount").value;
      const amount = parseFloat(amountInput);
      if (!amount || amount <= 0) {
        statusDiv.innerText = "Invalid amount";
        return;
      }

      const duration = 3600; // 1 hour
      const from = window.tronWeb.defaultAddress.base58;

      await contractInstance
        .mint(from, window.tronWeb.toSun(amount), duration)
        .send();

      statusDiv.innerText = `✅ Minted ${amount} FUSDT to ${from}`;
    } catch (err) {
      console.error(err);
      statusDiv.innerText = "❌ Mint failed: " + err.message;
    }
  });

  document.getElementById("check-balance").addEventListener("click", async () => {
    try {
      const address = window.tronWeb.defaultAddress.base58;
      const balance = await contractInstance.balanceOf(address).call();
      balanceDiv.innerText = `Balance: ${window.tronWeb.fromSun(balance)} FUSDT`;
    } catch (err) {
      balanceDiv.innerText = "Failed to fetch balance";
    }
  });
});
