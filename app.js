// Global contract information
const CONTRACT_ADDRESS = "TRDrVmYDYBDGAPZo6Htp9mJ8cxJnYPukbB";
const TOKEN_DECIMALS = 6;
const NILE_CHAIN_ID = "0xcd8690dc";

// Contract ABI - including mint and owner functions
const CONTRACT_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_amount", "type": "uint256"},
      {"name": "_durationInSeconds", "type": "uint256"}
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
    "name": "owner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// State variables
let currentMintAmount = 0;
let currentExpiryValue = 3600; // Default to 1 hour
let contractInstance = null;
let isConnected = false;

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
  // Set up event listeners
  document.getElementById("mint-amount").addEventListener("input", function(e) {
    currentMintAmount = parseFloat(e.target.value) || 0;
    console.log("Amount updated to:", currentMintAmount);
  });
  
  document.getElementById("expiry").addEventListener("input", function(e) {
    currentExpiryValue = parseInt(e.target.value) || 0;
    console.log("Expiry updated to:", currentExpiryValue);
  });
  
  // Initialize UI
  updateUI();
  
  // Auto-connect if possible
  if (window.tronLink && window.tronLink.ready) {
    connectWallet();
  }
});

// Update UI based on connection status
function updateUI() {
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
  
  if (tronWeb.fullNode.host.includes("nile")) {
    networkIndicator.className = "status-indicator connected";
    networkName.textContent = "Network: Nile Testnet";
    chainId.textContent = `Chain ID: ${NILE_CHAIN_ID}`;
    mintButton.disabled = false;
    setStatus("✅ Wallet connected to Nile Testnet. Ready to mint USDT", "success");
  } else {
    networkIndicator.className = "status-indicator";
    networkName.textContent = "Network: Wrong Network";
    chainId.textContent = "Switch to Nile Testnet";
    mintButton.disabled = true;
    setStatus("⚠️ Please switch to Nile Testnet in TronLink", "warning");
  }
}

// Set status message
function setStatus(message, type = "info") {
  const statusElement = document.getElementById("status");
  statusElement.innerHTML = `<span>${getStatusIcon(type)}</span> ${message}`;
  statusElement.className = `status-message ${type}`;
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
  } catch (e) {
    console.error("Connection error:", e);
    setStatus(`❌ Connection failed: ${e.message || e}`, "error");
  }
}

// Mint tokens - FIXED VERSION
async function mint() {
  try {
    if (!isConnected || !contractInstance) {
      setStatus("❌ Please connect wallet first", "error");
      return;
    }

    if (!currentMintAmount || currentMintAmount <= 0) {
      setStatus("❌ Please enter a valid amount", "error");
      return;
    }

    if (!currentExpiryValue || currentExpiryValue <= 0) {
      setStatus("❌ Please enter a valid expiry time", "error");
      return;
    }

    const to = window.tronWeb.defaultAddress.base58;
    const tokenAmount = Math.floor(currentMintAmount * 10 ** TOKEN_DECIMALS);

    setStatus("⏳ Processing mint request...", "info");

    console.log("Mint Parameters:", {
      address: window.tronWeb.address.fromHex(to),
      amount: tokenAmount,
      duration: currentExpiryValue,
      hexAddress: window.tronWeb.defaultAddress.hex
    });

    try {
      const owner = await contractInstance.owner().call();
      console.log("Contract owner:", owner);
      if (owner !== window.tronWeb.defaultAddress.hex.toLowerCase()) {
        throw new Error("You are not the contract owner!");
      }
    } catch (ownerErr) {
      console.error("Owner check error:", ownerErr);
      setStatus(`❌ Contract error: ${ownerErr.message}`, "error");
      return;
    }

    setStatus("⏳ Sending transaction to TronLink...", "info");

    const tx = await contractInstance.mint(
      window.tronWeb.address.fromHex(to),
      tokenAmount,
      currentExpiryValue
    ).send({
      feeLimit: 300000000,
      callValue: 0
    });

    const txID = tx.transaction ? tx.transaction.txID : tx;

    if (!txID) {
      throw new Error("No transaction ID received");
    }

    setStatus("⏳ Waiting for transaction confirmation...", "info");

    const txInfo = await waitForTransactionConfirmation(txID);

    if (txInfo.receipt && txInfo.receipt.result === 'SUCCESS') {
      setStatus(`✅ Mint successful! <a href="https://nile.tronscan.org/#/transaction/${txID}" target="_blank">View on Tronscan</a>`, "success");
      document.getElementById("mint-amount").value = "";
      document.getElementById("expiry").value = "3600";
      currentMintAmount = 0;
      currentExpiryValue = 3600;
    } else {
      throw new Error(`Transaction reverted: ${txInfo.result || 'Unknown reason'}`);
    }
  } catch (e) {
    console.error("Mint error:", e);

    let errorMsg = "Mint failed";
    if (e.message.includes("revert")) {
      errorMsg = "Contract reverted transaction";
    } else if (e.message.includes("denied")) {
      errorMsg = "Transaction denied by user";
    } else if (e.message.includes("insufficient")) {
      errorMsg = "Insufficient energy/bandwidth - get more test TRX";
    } else if (e.message.includes("onlyOwner")) {
      errorMsg = "Only contract owner can mint tokens";
    } else if (e.message.includes("Contract rejected")) {
      errorMsg = e.message;
    } else if (e.message.includes("No transaction ID")) {
      errorMsg = "TronLink didn't return transaction ID";
    } else {
      errorMsg = e.message || "Unknown error";
    }

    setStatus(`❌ ${errorMsg}`, "error");
  }
}

// Helper to wait for transaction confirmation
async function waitForTransactionConfirmation(txID) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 30;

    const checkInterval = setInterval(async () => {
      try {
        attempts++;
        const txInfo = await window.tronWeb.trx.getTransactionInfo(txID);

        if (txInfo) {
          clearInterval(checkInterval);
          resolve(txInfo);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error("Transaction confirmation timeout"));
        }
      } catch (e) {
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error("Transaction confirmation timeout"));
        }
      }
    }, 2000);
  });
}
