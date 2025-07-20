const contractAddress = "TRxX68zx2rpSKdNwdzXhqLWnp3jcS4k7Fa";

let userAddress = null;

const CONTRACT_ABI = [ /* ← آپ نے جو ABI دیا وہ یہاں پورا لگا ہوا ہے */ ];

window.addEventListener("DOMContentLoaded", () => {
  const walletEl = document.getElementById("wallet");
  const connectBtn = document.getElementById("connect");
  const mintBtn = document.getElementById("mint");
  const mintAmountInput = document.getElementById("mint-amount");
  const mintStatus = document.getElementById("mint-status");
  const checkBalanceBtn = document.getElementById("check-balance");
  const balanceEl = document.getElementById("balance");

  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    userAddress = window.tronWeb.defaultAddress.base58;
    walletEl.innerText = `Wallet: ${userAddress}`;
  }

  connectBtn?.addEventListener("click", async () => {
    if (window.tronLink) {
      await window.tronLink.request({ method: 'tron_requestAccounts' });
      userAddress = window.tronWeb.defaultAddress.base58;
      walletEl.innerText = `Wallet: ${userAddress}`;
    }
  });

  checkBalanceBtn?.addEventListener("click", async () => {
    try {
      const contract = await window.tronWeb.contract(CONTRACT_ABI, contractAddress);
      const balance = await contract.balanceOf(userAddress).call();
      const decimals = await contract.decimals().call();
      const formatted = window.tronWeb.toBigNumber(balance).dividedBy(10 ** decimals).toString();
      balanceEl.innerText = `Balance: ${formatted} FLASH USDT`;
    } catch (err) {
      balanceEl.innerText = `Error reading balance`;
      console.error(err);
    }
  });

  mintBtn?.addEventListener("click", async () => {
    try {
      const amount = mintAmountInput.value;
      if (!amount || isNaN(amount)) return alert("Invalid amount");

      const contract = await window.tronWeb.contract(CONTRACT_ABI, contractAddress);
      const decimals = await contract.decimals().call();
      const amountToMint = window.tronWeb.toBigNumber(amount).multipliedBy(10 ** decimals);

      const tx = await contract.mint(userAddress, amountToMint.toFixed(), 300).send();
      mintStatus.innerText = `Minted ${amount} USDT. TX: ${tx}`;

      setTimeout(() => {
        balanceEl.innerText = `Balance: 0 FLASH USDT (Expired)`;
      }, 300 * 1000);
    } catch (err) {
      mintStatus.innerText = `Mint failed: ${err.message}`;
      console.error(err);
    }
  });
});
