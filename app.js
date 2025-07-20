document.addEventListener("DOMContentLoaded", function () {
  const CONTRACT_ADDRESS = "TRDrVmYDYBDGAPZo6Htp9mJ8cxJnYPukbB";

  const CONTRACT_ABI = [ 
    // 👇 Truncated for readability, you can paste full ABI here if needed
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
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
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
    // 👉 You can paste full ABI here if required
  ];

  let contractInstance;

  const connectButton = document.getElementById("connect");
  const mintButton = document.getElementById("mint");
  const statusDiv = document.getElementById("mint-status");
  const balanceDiv = document.getElementById("balance");

  connectButton.addEventListener("click", async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      const walletAddress = window.tronWeb.defaultAddress.base58;
      document.getElementById("wallet").innerText = "Wallet: " + walletAddress;

      contractInstance = await window.tronWeb.contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
    } else {
      alert("Please connect TronLink wallet.");
    }
  });

  mintButton.addEventListener("click", async () => {
    try {
      const amountInput = document.getElementById("mint-amount");
      if (!amountInput) {
        statusDiv.innerText = "❌ Mint input not found.";
        return;
      }

      const amount = parseFloat(amountInput.value);
      if (isNaN(amount) || amount <= 0) {
        statusDiv.innerText = "❌ Invalid amount.";
        return;
      }

      const duration = 3600; // 1 hour
      const from = window.tronWeb.defaultAddress.base58;

      await contractInstance
        .mint(from, window.tronWeb.toSun(amount), duration)
        .send();

      statusDiv.innerText = `✅ Minted ${amount} FUSDT to ${from}`;
    } catch (err) {
      console.error("❌ Mint failed:", err);
      statusDiv.innerText = "❌ Mint failed: " + (err.message || err);
    }
  });

  document.getElementById("check-balance").addEventListener("click", async () => {
    try {
      const address = window.tronWeb.defaultAddress.base58;
      const balance = await contractInstance.balanceOf(address).call();
      balanceDiv.innerText = `Balance: ${window.tronWeb.fromSun(balance)} FUSDT`;
    } catch (err) {
      balanceDiv.innerText = "❌ Failed to fetch balance.";
    }
  });
});
