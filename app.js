document.addEventListener("DOMContentLoaded", function () {
  const CONTRACT_ADDRESS = "TRDrVmYDYBDGAPZo6Htp9mJ8cxJnYPukbB";
  
  // Your actual contract ABI
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
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expiry",
          "type": "uint256"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "expiry",
          "type": "uint256"
        }
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
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_durationInSeconds",
          "type": "uint256"
        }
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
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
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
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
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
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  let contractInstance;
  let isConnected = false;
  let currentMintAmount = 0; // Stores the current input value

  // Get DOM elements
  const connectButton = document.getElementById("connect");
  const mintButton = document.getElementById("mint");
  const statusDiv = document.getElementById("mint-status");
  const balanceDiv = document.getElementById("balance");
  const walletDiv = document.getElementById("wallet");
  const amountInput = document.getElementById("mint-amount");

  // Initialize TronWeb
  async function initTronWeb() {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      try {
        // Request account access
        await window.tronWeb.request({method: 'tron_requestAccounts'});
        
        // Update wallet display
        const walletAddress = window.tronWeb.defaultAddress.base58;
        walletDiv.innerText = "Wallet: " + walletAddress;
        
        // Load contract
        contractInstance = await window.tronWeb.contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        isConnected = true;
        statusDiv.innerText = "✅ Wallet connected & contract loaded";
        return true;
      } catch (err) {
        statusDiv.innerText = "❌ Connection failed: " + (err.message || err);
        return false;
      }
    } else {
      statusDiv.innerText = "❌ TronLink not detected - please install extension";
      return false;
    }
  }

  // Initialize on page load
  initTronWeb();

  // Connect button handler
  connectButton.addEventListener("click", async () => {
    isConnected = await initTronWeb();
  });

  // Track input value changes
  amountInput.addEventListener("input", function(e) {
    try {
      const rawValue = e.target.value.trim();
      if (!rawValue) {
        currentMintAmount = 0;
        return;
      }
      
      const parsed = parseFloat(rawValue);
      if (!isNaN(parsed) {
        currentMintAmount = parsed;
        console.log("Input updated to:", currentMintAmount);
      }
    } catch (error) {
      console.warn("Input parsing error:", error);
      currentMintAmount = 0;
    }
  });

  // Mint button handler
  mintButton.addEventListener("click", async () => {
    if (!isConnected || !contractInstance) {
      statusDiv.innerText = "❌ Please connect wallet first";
      return;
    }

    try {
      // Use the stored value
      const amount = currentMintAmount;
      console.log("Attempting mint with amount:", amount);
      
      // Validate amount
      if (amount <= 0 || isNaN(amount)) {
        statusDiv.innerText = "❌ Amount must be greater than 0";
        return;
      }

      const duration = 3600; // 1 hour in seconds
      const tokenAmount = Math.floor(amount * 1000000); // Convert to 6 decimals
      const from = window.tronWeb.defaultAddress.base58;

      statusDiv.innerText = "⏳ Processing mint...";
      
      // Execute mint transaction
      const result = await contractInstance.mint(
        from, 
        tokenAmount, 
        duration
      ).send({
        feeLimit: 100000000, // Sufficient fee limit
        callValue: 0 // No TRX sent with transaction
      });

      console.log("Mint transaction result:", result);
      statusDiv.innerHTML = `✅ Successfully minted ${amount} Flash USDT!<br>Transaction ID: ${result}`;
      
      // Reset input
      amountInput.value = "";
      currentMintAmount = 0;
      
      // Update balance automatically after 10 seconds
      setTimeout(() => {
        document.getElementById("check-balance").click();
      }, 10000);
    } catch (err) {
      console.error("Mint transaction failed:", err);
      
      let errorMessage = "Mint failed";
      if (err.message.includes("revert")) {
        errorMessage = "Contract reverted transaction - are you the owner?";
      } else if (err.message.includes("denied")) {
        errorMessage = "Transaction denied by user";
      } else if (err.message.includes("insufficient")) {
        errorMessage = "Insufficient energy/bandwidth";
      }
      
      statusDiv.innerText = `❌ ${errorMessage}`;
    }
  });

  // Balance check handler
  document.getElementById("check-balance").addEventListener("click", async () => {
    if (!isConnected || !contractInstance) {
      balanceDiv.innerText = "❌ Connect wallet first";
      return;
    }
    
    try {
      const address = window.tronWeb.defaultAddress.base58;
      const balance = await contractInstance.balanceOf(address).call();
      const formattedBalance = balance / 1000000; // Convert from 6 decimals
      balanceDiv.innerText = `Balance: ${formattedBalance} Flash USDT`;
    } catch (err) {
      console.error("Balance check error:", err);
      balanceDiv.innerText = "❌ Failed to fetch balance";
    }
  });
});
