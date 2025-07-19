const contractAddress = "TRxX68zx2rpSKdNwdzXhqLWnp3jcS4k7Fa";
const mintFunctionSelector = "0x156e29f6"; // mint(uint256)

let userAddress = null;

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
    const contract = await window.tronWeb.contract().at(contractAddress);
    const balance = await contract.balanceOf(userAddress).call();
    const decimals = await contract.decimals().call();
    const formatted = window.tronWeb.toBigNumber(balance).dividedBy(10 ** decimals).toString();
    document.getElementById("balance").innerText = `Balance: ${formatted} FLASH USDT`;
  } catch (err) {
    console.error(err);
    document.getElementById("balance").innerText = `Error reading balance`;
  }
});

document.getElementById("mint").addEventListener("click", async () => {
  try {
    const amount = document.getElementById("mint-amount").value;
    if (!amount || isNaN(amount)) return alert("Invalid amount");

    const contract = await window.tronWeb.contract().at(contractAddress);
    const decimals = await contract.decimals().call();
    const amountToMint = window.tronWeb.toBigNumber(amount).multipliedBy(10 ** decimals);

    // Owner-only mint
    const tx = await contract.mint(amountToMint.toFixed()).send();
    console.log("Mint TX: ", tx);
    document.getElementById("mint-status").innerText = `Minted ${amount} USDT. TX: ${tx}`;

    // Track expiry after 2 minutes (demo)
    setTimeout(async () => {
      console.log("⏰ Token Expired (visually)");
      document.getElementById("balance").innerText = `Balance: 0 FLASH USDT (Expired)`;
    }, 2 * 60 * 1000); // 2 minutes
  } catch (err) {
    console.error(err);
    document.getElementById("mint-status").innerText = `Mint failed: ${err.message}`;
  }
});
