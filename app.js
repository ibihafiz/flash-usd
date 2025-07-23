// Global contract information
const CONTRACT_ADDRESS = "TXr7XvZ2AhjbbTPZtJ1yMo9XVVKDukuoag";
const TOKEN_DECIMALS = 6;
const MAINNET_CHAIN_ID = "728126428";  // Decimal format for TRON Mainnet
let CONTRACT_ABI = null; // Load from external file

// State variables
let contractInstance = null;
let isConnected = false;

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
  fetch("contractABI.json")
    .then(response => response.json())
    .then(data => {
      CONTRACT_ABI = data;
      updateUI();
            document.getElementById("mint").addEventListener("click", mint);
      if (window.tronLink && window.tronLink.ready) {
        connectWallet();
      }
    })
    .catch(error => {
      console.error("❌ Failed to load ABI:", error);
      setStatus("❌ Failed to load contract ABI", "error");
    });
});

// Update UI based on connection status (MAINNET-FIXED)
async function updateUI() {
  const walletIndicator = document.getElementById("walletIndicator");
  const networkIndicator = document.getElementById("networkIndicator");
  const walletAddress = document.getElementById("walletAddress");
  const networkName = document.getElementById("networkName");
  const chainId = document.getElementById("chainId");
  const mintButton = document.getElementById("mint");

  if (!window.tronWeb || !tronWeb.defaultAddress.base58) {
    walletIndicator.className = "status-indicator";
    networkIndicator.className = "status-indicator";
    walletAddress.textContent = "Wallet not connected";
    networkName.textContent = "Network: Not connected";
    chainId.textContent = "";
    mintButton.disabled = true;
    setStatus("ⓘ Connect your TronLink wallet to get started", "info");
    return;
  }

  const currentAddress = tronWeb.defaultAddress.base58;
  walletIndicator.className = "status-indicator connected";
  walletAddress.textContent = `Connected: ${currentAddress.substring(0, 6)}...${currentAddress.slice(-4)}`;

  try {
    // Get actual chain ID - MAINNET FIX
    const actualChainId = await tronWeb.trx.getChainId();
    console.log("Actual Chain ID:", actualChainId);
    console.log("Required Chain ID:", MAINNET_CHAIN_ID);

    if (actualChainId === MAINNET_CHAIN_ID) {
      // Correct network
      networkIndicator.className = "status-indicator connected";
      networkName.textContent = "Network: Tron Mainnet";
      chainId.textContent = `Chain ID: ${actualChainId}`;
      mintButton.disabled = false;
      setStatus("✅ Wallet connected to Tron Mainnet. Ready to mint USDT", "success");
      
      // Fetch balance only when on correct network
      try {
        const raw = await contractInstance.balanceOf(currentAddress).call();
        const amount = parseFloat(raw.toString()) / 10 ** TOKEN_DECIMALS;
        document.getElementById("balance").innerText = `Balance: ${amount.toFixed(2)} USDT`;
        document.getElementById("usd-value").innerText = `≈ $${amount.toFixed(2)}`;
      } catch (e) {
        console.error("Balance fetch error:", e);
      }

          // Ensure contract instance is available (CRITICAL FIX)
    if (!contractInstance) {
      try {
        contractInstance = await window.tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        isConnected = true;
        console.log("Contract instance initialized");
      } catch (e) {
        console.error("Contract initialization failed:", e);
        setStatus("❌ Failed to initialize contract. Please try reconnecting wallet.", "error");
        return; // Exit early
      }
    }
      // Add owner check to disable mint button if not owner
      try {
        const ownerHex = await contractInstance.owner().call();
        const ownerBase58 = tronWeb.address.fromHex(ownerHex);
        const isOwner = (ownerBase58 === currentAddress);
        
        mintButton.disabled = !isOwner;
        if (!isOwner) {
          setStatus("ℹ️ Minting disabled: connected wallet is not contract owner", "info");
        }
      } catch (ownerErr) {
        console.error("Owner check error:", ownerErr);
      }
    } else {
      // Wrong network
      networkIndicator.className = "status-indicator";
      networkName.textContent = "Network: Wrong Network";
      chainId.textContent = `Detected: ${actualChainId} | Required: ${MAINNET_CHAIN_ID}`;
      mintButton.disabled = true;
      setStatus("⚠️ Please switch to Tron Mainnet in TronLink", "warning");
    }
  } catch (error) {
    console.error("Network check failed:", error);
    networkIndicator.className = "status-indicator";
    networkName.textContent = "Network: Error";
    chainId.textContent = "Failed to detect network";
    mintButton.disabled = true;
    setStatus("⚠️ Error detecting network. Please try again.", "warning");
  }
}

// Get status icon
function getStatusIcon(type) {
  switch (type) {
    case "success": return "✅";
    case "error": return "❌";
    case "warning": return "⚠️";
    default: return "ⓘ";
  }
}

// Connect wallet
async function connectWallet() {
  try {
    if (!window.tronLink) {
      setStatus("❌ TronLink not detected. Please install TronLink extension.", "error");
      return;
    }

    await window.tronLink.request({ method: 'tron_requestAccounts' });

    // Initialize contract
    contractInstance = await window.tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    isConnected = true;

    updateUI();

// Mint tokens - ULTIMATE FIXED VERSION
async function mint() {
  try {
    // Validate connection
    if (!isConnected || !contractInstance) {
      setStatus("❌ Please connect wallet first", "error");
      return;
    }

    // Get input values
    const amountInput = document.getElementById("mint-amount").value;
    const expiryInput = document.getElementById("expiry").value;

    // Validate inputs
    if (!amountInput || parseFloat(amountInput) <= 0) {
      setStatus("❌ Please enter a valid amount (min 1 token)", "error");
      return;
    }
    
    if (!expiryInput || parseInt(expiryInput) < 60) {
      setStatus("❌ Please enter a valid expiry time (min 60 seconds)", "error");
      return;
    }

    // Convert values
    const tokenAmount = Math.floor(parseFloat(amountInput) * 10 ** TOKEN_DECIMALS);
    const expiryValue = parseInt(expiryInput);
    
    // Get hex-formatted address
const userAddress = tronWeb.defaultAddress.base58;  // Use base58 directly    
    setStatus("⏳ Processing mint request...", "info");

    // Verify contract ownership
    try {
      const owner = await contractInstance.owner().call();
      console.log("Contract owner:", owner);
console.log("Connected wallet:", userAddress);      
// Compare both in base58 format
const ownerBase58 = tronWeb.address.fromHex(owner);
if (ownerBase58 !== userAddress) {
  throw new Error("You are not the contract owner!");
}
    } catch (ownerErr) {
      console.error("Owner check error:", ownerErr);
      setStatus(`❌ Contract error: ${ownerErr.message}`, "error");
      return;
    }

    setStatus("⏳ Sending transaction to TronLink...", "info");

    // Execute mint transaction with ULTRA-ROBUST response handling
    let txID;
    try {
const txResponse = await contractInstance.mint(
  userAddress,  // Use base58 address
  tokenAmount,
  expiryValue
).send({
  feeLimit: 300000000,
  callValue: 0
});

      console.log("Raw transaction response:", txResponse);

      // Handle every possible response format
      if (typeof txResponse === "string") {
        // Case 1: Direct TXID string
        txID = txResponse;
        console.log("Extracted TXID (string format):", txID);
      } else if (txResponse?.txID) {
        // Case 2: Object with txID property
        txID = txResponse.txID;
        console.log("Extracted TXID (txID property):", txID);
      } else if (txResponse?.transaction?.txID) {
        // Case 3: Nested transaction object
        txID = txResponse.transaction.txID;
        console.log("Extracted TXID (transaction.txID):", txID);
      } else if (txResponse?.result?.txid) {
        // Case 4: Some extensions use 'txid'
        txID = txResponse.result.txid;
        console.log("Extracted TXID (result.txid):", txID);
      } else if (txResponse?.txid) {
        // Case 5: Direct txid property
        txID = txResponse.txid;
        console.log("Extracted TXID (txid property):", txID);
      } else {
        // Final fallback - try to extract from any possible location
        txID = findTransactionID(txResponse);
        console.log("Extracted TXID (deep scan):", txID);
      }
    } catch (sendError) {
      // Handle errors from the send() method itself
      console.error("Transaction send error:", sendError);
      
      // Special handling for user rejection
      if (sendError.message.includes("denied") || sendError.code === 4001) {
        throw new Error("Transaction denied by user");
      }
      
      // Handle insufficient energy
      if (sendError.message.includes("bandwidth") || sendError.message.includes("energy")) {
        throw new Error("Insufficient energy/bandwidth - add more TRX");
      }
      
      // Handle contract reverts
      if (sendError.message.includes("revert")) {
        throw new Error("Contract reverted transaction: " + (sendError.receipt?.resultMessage || "Check contract"));
      }
      
      // Rethrow with original message
      throw new Error(`Transaction failed: ${sendError.message || "Unknown send error"}`);
    }

    // If we still don't have a TXID, throw error
    if (!txID) {
      throw new Error("No transaction ID received after send operation");
    }

    setStatus(`⏳ Waiting for confirmation... TX: ${txID.substring(0, 10)}...`, "info");

    // Wait for confirmation with enhanced logging
    const txInfo = await waitForTransactionConfirmation(txID);

    if (txInfo.receipt && txInfo.receipt.result === 'SUCCESS') {
setStatus(`✅ Mint successful! <a href="https://tronscan.org/#/transaction/${txID}" target="_blank">View on Tronscan</a>`, "success");
      // Clear inputs
      document.getElementById("mint-amount").value = "";
      document.getElementById("expiry").value = "3600";
    } else {
      const reason = txInfo.resMessage || (txInfo.receipt ? txInfo.receipt.result : 'Unknown reason');
      throw new Error(`Transaction reverted: ${reason}`);
    }
  } catch (e) {
    console.error("Mint error:", e);
    
    // Simplify error display
    let displayMessage = e.message;
    
    // Handle long error messages
    if (displayMessage.length > 80) {
      displayMessage = displayMessage.substring(0, 80) + "...";
    }
    
    setStatus(`❌ ${displayMessage}`, "error");
  }
}

// Helper to find TXID in any response format
function findTransactionID(response) {
  if (!response) return null;
  
  console.log("Searching for TXID in:", response);
  
  // Check all possible locations
  const possiblePaths = [
    'transaction.txID',
    'txID',
    'txid',
    'result.txid',
    'transactionId',
    'id',
    'hash',
    'transactionHash',
    'response.txID',
    'data.result.txid'
  ];
  
  for (const path of possiblePaths) {
    const parts = path.split('.');
    let value = response;
    let validPath = true;
    
    for (const part of parts) {
      if (value && value.hasOwnProperty(part)) {
        value = value[part];
      } else {
        validPath = false;
        break;
      }
    }
    
    if (validPath && value && typeof value === 'string' && value.length > 10) {
      console.log(`Found TXID at path '${path}':`, value);
      return value;
    }
  }
  
  // Deep scan if not found
  try {
    const json = JSON.stringify(response);
    const txIDMatch = json.match(/"tx[Ii][Dd]":\s*"([a-fA-F0-9]{64})"/);
    if (txIDMatch && txIDMatch[1]) {
      console.log("Found TXID via regex:", txIDMatch[1]);
      return txIDMatch[1];
    }
    
    // Look for any 64-character hex string (TXID pattern)
    const anyTxIDMatch = json.match(/"([a-fA-F0-9]{64})"/);
    if (anyTxIDMatch && anyTxIDMatch[1]) {
      console.log("Found potential TXID via hex pattern:", anyTxIDMatch[1]);
      return anyTxIDMatch[1];
    }
  } catch (e) {
    console.error("Deep scan failed:", e);
  }
  
  return null;
}

// Enhanced transaction confirmation
async function waitForTransactionConfirmation(txID) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 45; // 90 seconds (45 attempts * 2 seconds)
    
    console.log(`Starting confirmation for TX: ${txID}`);
    
    const interval = setInterval(async () => {
      try {
        attempts++;
        console.log(`Confirmation attempt ${attempts} for TX: ${txID}`);
        const txInfo = await window.tronWeb.trx.getTransactionInfo(txID);
        
        if (txInfo && txInfo.id) {
          console.log(`Transaction confirmed: ${txID}`);
          clearInterval(interval);
          resolve(txInfo);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error(`Confirmation timed out for TX: ${txID}`);
          reject(new Error("Transaction confirmation timed out after 90 seconds"));
        } else {
          console.log(`Attempt ${attempts}: Transaction not yet confirmed (${txID})`);
        }
      } catch (e) {
        console.error(`Confirmation error on attempt ${attempts}:`, e.message);
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error("Failed to confirm transaction after 90 seconds"));
        }
      }
    }, 2000);
  });
}

// =================================================
// NETWORK CHANGE HANDLERS (ADD THIS CODE)
// =================================================
if (window.tronWeb) {
  console.log("Setting up TronLink event listeners");
  
  window.tronWeb.on("addressChanged", () => {
    console.log("TronLink address changed - refreshing UI");
    updateUI();
  });
  
  window.tronWeb.on("disconnect", () => {
    console.log("TronLink disconnected - reloading page");
    location.reload();
  });
  
  window.tronWeb.on("nodeChanged", () => {
    console.log("TronLink node changed - refreshing UI");
    updateUI();
  });
} else {
  console.log("TronLink not detected at load time");
}
