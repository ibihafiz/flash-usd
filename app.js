document.addEventListener("DOMContentLoaded", function () {
  const CONTRACT_ADDRESS = "TRDrVmYDYBDGAPZo6Htp9mJ8cxJnYPukbB";

  // ... (keep your existing ABI here) ...

  let contractInstance;
  let isConnected = false; // Track connection state

  const connectButton = document.getElementById("connect");
  const mintButton = document.getElementById("mint");
  const statusDiv = document.getElementById("mint-status");
  const balanceDiv = document.getElementById("balance");

  // Initialize TronWeb on load
  async function initTronWeb() {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      try {
        // Request account access if needed
        await window.tronWeb.request({method: 'tron_requestAccounts'});
        
        const walletAddress = window.tronWeb.defaultAddress.base58;
        document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
        
        contractInstance = await window.tronWeb.contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        
        isConnected = true;
        statusDiv.innerText = "✅ Wallet connected & contract loaded";
        return true;
      } catch (err) {
        console.error("Connection error:", err);
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

  mintButton.addEventListener("click", async () => {
    // Ensure wallet is connected
    if (!isConnected || !contractInstance) {
      statusDiv.innerText = "❌ Please connect wallet first";
      return;
    }

    try {
      const amountInput = document.getElementById("mint-amount");
      if (!amountInput) {
        statusDiv.innerText = "❌ Mint input not found";
        return;
      }

      // Get raw input value and trim whitespace
      const rawValue = amountInput.value.trim();
      console.log("Raw input value:", rawValue);  // Debug log
      
      // Validate input
      if (!rawValue) {
        statusDiv.innerText = "❌ Please enter an amount";
        return;
      }
      
      const amount = parseFloat(rawValue);
      if (isNaN(amount) || amount <= 0) {
        statusDiv.innerText = "❌ Amount must be a positive number";
        return;
      }

      const duration = 3600; // 1 hour
      const from = window.tronWeb.defaultAddress.base58;

      // Convert to token units (6 decimals)
      const tokenAmount = amount * 1000000; // 10^6
      
      statusDiv.innerText = "⏳ Processing mint...";
      
      // Execute mint transaction
      const result = await contractInstance
        .mint(from, tokenAmount, duration)
        .send({
          feeLimit: 100000000  // Set appropriate fee limit
        });

      console.log("Mint result:", result);
      statusDiv.innerText = `✅ Minted ${amount} Flash USDT! TX: ${result}`;
      
      // Clear input after successful mint
      amountInput.value = "";
    } catch (err) {
      console.error("Mint error:", err);
      
      // Handle specific error cases
      if (err.message.includes("revert")) {
        statusDiv.innerText = "❌ Contract reverted: " + 
          (err.message.split("revert")[1] || "Check contract requirements");
      } else if (err.message.includes("denied transaction")) {
        statusDiv.innerText = "❌ Transaction denied by user";
      } else {
        statusDiv.innerText = "❌ Mint failed: " + err.message;
      }
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
      
      // Convert from token units (6 decimals)
      const formattedBalance = balance / 1000000; 
      balanceDiv.innerText = `Balance: ${formattedBalance} Flash USDT`;
    } catch (err) {
      console.error("Balance error:", err);
      balanceDiv.innerText = "❌ Balance check failed";
    }
  });
});
