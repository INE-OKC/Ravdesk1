// src/app.js

// Import the contract ABI and address
const contractABI = [ /* ABI from compiled Solidity contract */ ];
const contractAddress = "0xYourContractAddress"; // Replace with your contract address on BSC Testnet

// BSC Testnet Configuration
const bscTestnetParams = {
    chainId: '0x61', // Chain ID for BSC Testnet (97 in decimal)
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
};

// Web3 Initialization
let web3;
let escrowContract;
let userAccount;

// Function to connect to BSC Testnet
async function connectToBSC() {
    if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        // Check if connected to BSC Testnet
        if (chainId !== bscTestnetParams.chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [bscTestnetParams]
                });
            } catch (error) {
                console.error("Could not connect to BSC Testnet:", error);
                return;
            }
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        console.log("Connected account:", userAccount);

        // Initialize Web3
        web3 = new Web3(window.ethereum);

        // Initialize contract instance
        escrowContract = new web3.eth.Contract(contractABI, contractAddress);

        // Enable buttons after connection
        document.getElementById("approvePaymentButton").disabled = false;
        document.getElementById("cancelPaymentButton").disabled = false;
    } else {
        alert("MetaMask is not installed. Please install it to connect to Binance Smart Chain Testnet.");
    }
}

// Call connectToBSC() on button click
document.getElementById("connectButton").addEventListener("click", connectToBSC);

// Load Contract Status
async function loadContractStatus() {
    if (escrowContract) {
        const [payerApproved, payeeApproved, contractCanceled, currentMilestone] = await escrowContract.methods.getContractStatus().call();
        document.getElementById("payerApproved").textContent = payerApproved ? "Yes" : "No";
        document.getElementById("payeeApproved").textContent = payeeApproved ? "Yes" : "No";
        document.getElementById("contractCanceled").textContent = contractCanceled ? "Yes" : "No";
        document.getElementById("currentMilestone").textContent = currentMilestone;
    }
}

// Load Milestone Details
async function loadMilestoneDetails() {
    if (escrowContract) {
        const [percentages, count, current] = await escrowContract.methods.getMilestoneDetails().call();
        const list = document.getElementById("milestoneList");
        list.innerHTML = '';
        percentages.forEach((percentage, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Milestone ${index + 1}: ${percentage}%`;
            list.appendChild(listItem);
        });
    }
}

// Approve Payment
async function approvePayment() {
    try {
        if (escrowContract) {
            await escrowContract.methods.approvePayment().send({ from: userAccount });
            loadContractStatus();
        }
    } catch (error) {
        console.error("Error approving payment:", error);
    }
}

// Cancel Payment
async function cancelPayment() {
    try {
        if (escrowContract) {
            await escrowContract.methods.cancelPayment().send({ from: userAccount });
            loadContractStatus();
        }
    } catch (error) {
        console.error("Error canceling payment:", error);
    }
}

// Event listeners for Approve and Cancel buttons
document.getElementById("approvePaymentButton").addEventListener("click", approvePayment);
document.getElementById("cancelPaymentButton").addEventListener("click", cancelPayment);

// Load contract details on page load
window.addEventListener("load", () => {
    loadContractStatus();
    loadMilestoneDetails();
});
