document.addEventListener("DOMContentLoaded", function () {
  const CONTRACT_ADDRESS = "TRDrVmYDYBDGAPZo6Htp9mJ8cxJnYPukbB";
  
  // Your contract ABI here
  const CONTRACT_ABI = [ /* ... */ ];
  
  let contractInstance;
  let isConnected = false;
  let currentMintAmount = 0; // Store input value separately

  const connectButton = document.getElementById("connect");
  const mintButton = document.getElementById("mint");
  const statusDiv = document.getElementById("mint-status");
  const balanceDiv = document.getElementById("balance");
  const amountInput = document.getElementById("mint-amount");

  // Initialize TronWeb
  async function initTronWeb() {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      try {
        await window.tronWeb.request({method: 'tron_requestAccounts'});
        const walletAddress = window.tronWeb.defaultAddress.base58;
        document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
        
        contractInstance = await window.tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        isConnected = true;
        statusDiv.innerText = "✅ Wallet connected & contract loaded";
        return true;
      } catch (err) {
        statusDiv.innerText = "❌ Connection failed: " + err.message;
        return false;
      }
    } else {
      statusDiv.innerText = "❌ TronLink not detected";
      return false;
    }
  }

  // Initialize on page load
  initTronWeb();

  connectButton.addEventListener("click", async () => {
    isConnected = await initTronWeb();
  });

  // NEW: Capture input value on every change
  amountInput.addEventListener("input", function(e) {
    try {
      const rawValue = e.target.value.trim();
      if (!rawValue) {
        currentMintAmount = 0;
        return;
      }
      
      const parsed = parseFloat(rawValue);
      if (!isNaN(parsed) && parsed > 0) {
        currentMintAmount = parsed;
        console.log("Input updated:", currentMintAmount);
      }
    } catch (error) {
      console.warn("Input parsing error:", error);
      currentMintAmount = 0;
    }
  });

  mintButton.addEventListener("click", async () => {
    if (!isConnected || !contractInstance) {
      statusDiv.innerText = "❌ Please connect wallet first";
      return;
    }

    try {
      // Use the stored value instead of reading from DOM
      const amount = currentMintAmount;
      console.log("Attempting mint with amount:", amount);
      
      if (amount <= 0) {
        statusDiv.innerText = "❌ Amount must be greater than 0";
        return;
      }

      const duration = 3600; // 1 hour
      const tokenAmount = amount * 1000000; // 10^6 decimals
      const from = window.tronWeb.defaultAddress.base58;

      statusDiv.innerText = "⏳ Processing mint...";
      
      // Execute mint transaction
      const result = await contractInstance.mint(
        from, 
        tokenAmount, 
        duration
      ).send({
        feeLimit: 100000000,
        callValue: 0
      });

      console.log("Mint result:", result);
      statusDiv.innerText = `✅ Minted ${amount} Flash USDT! TX: ${result}`;
      
      // Reset input
      amountInput.value = "";
      currentMintAmount = 0;
    } catch (err) {
      console.error("Mint error:", err);
      statusDiv.innerText = "❌ Mint failed: " + (err.message || "Check contract requirements");
    }
  });

  document.getElementById("check-balance").addEventListener("click", async () => {
    if (!isConnected || !contractInstance) {
      balanceDiv.innerText = "❌ Connect wallet first";
      return;
    }
    
    try {
      const address = window.tronWeb.defaultAddress.base58;
      const balance = await contractInstance.balanceOf(address).call();
      const formattedBalance = balance / 1000000; 
      balanceDiv.innerText = `Balance: ${formattedBalance} Flash USDT`;
    } catch (err) {
      balanceDiv.innerText = "❌ Balance check failed";
    }
  });
});
