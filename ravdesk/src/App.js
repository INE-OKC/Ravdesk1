// src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import EscrowContract from './contracts/EscrowABI.json';
import ContractStatus from './components/ContractStatus';
import MilestoneDetails from './components/MilestoneDetails';
import './App.css';

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [status, setStatus] = useState({
        payerApproved: false,
        payeeApproved: false,
        contractCanceled: false,
        currentMilestone: 0
    });

    const bscTestnetParams = {
        chainId: '80002',
        chainName: 'Amoy',
        nativeCurrency: {
            name: 'Matic',
            symbol: 'POL',
            decimals: 18
        },
        rpcUrls: ['https://rpc-amoy.polygon.technology'],
        blockExplorerUrls: ['https://www.oklink.com/amoy']
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== bscTestnetParams.chainId) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [bscTestnetParams]
                });
            }

            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            const accounts = await web3Instance.eth.requestAccounts();
            setAccount(accounts[0]);

            const contractInstance = new web3Instance.eth.Contract(
                EscrowContract,
                '0xf5Fb3921f730cD5F2A2FCE89961dd7389e4Bde38'
            );
            setContract(contractInstance);
        } else {
            alert('Please install MetaMask to connect.');
        }
    };

    const loadContractStatus = async () => {
        if (contract) {
            const response = await contract.methods.getContractStatus().call();
            setStatus({
                payerApproved: response[0],
                payeeApproved: response[1],
                contractCanceled: response[2],
                currentMilestone: response[3]
            });
        }
    };

    // Function to approve payment
    const approvePayment = async () => {
        if (contract && account) {
            try {
                await contract.methods.approvePayment().send({ from: account });
                loadContractStatus(); // Refresh status
                alert("Payment approved successfully!");
            } catch (error) {
                console.error("Error approving payment:", error);
            }
        }
    };

    // Function to cancel payment
    const cancelPayment = async () => {
        if (contract && account) {
            try {
                await contract.methods.cancelPayment().send({ from: account });
                loadContractStatus(); // Refresh status
                alert("Payment canceled successfully!");
            } catch (error) {
                console.error("Error canceling payment:", error);
            }
        }
    };

    useEffect(() => {
        loadContractStatus();
    }, [contract]);

    return (
        <div className="App">
            <h1>Ravdesk Contract</h1>
            <button onClick={connectWallet}>Connect to Amoy Testnet</button>
            {account && <p>Connected Account: {account}</p>}
            <ContractStatus status={status} />
            <MilestoneDetails contract={contract} />
            {/* Approve and Cancel Payment Buttons */}
            <button onClick={approvePayment} disabled={!account}>Approve Payment</button>
            <button onClick={cancelPayment} disabled={!account}>Cancel Payment</button>
        </div>
    );
};

export default App;
