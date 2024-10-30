
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
        chainId: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com']
    };

    // Connect to MetaMask and BSC Testnet
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
                '0xYourContractAddressHere'
            );
            setContract(contractInstance);
        } else {
            alert('Please install MetaMask to connect.');
        }
    };

    // Load contract status
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

    useEffect(() => {
        loadContractStatus();
    }, [contract]);

    return (
        <div className="App">
            <h1>P2P Escrow Contract</h1>
            <button onClick={connectWallet}>Connect to BSC Testnet</button>
            {account && <p>Connected Account: {account}</p>}
            <ContractStatus status={status} />
            <MilestoneDetails contract={contract} />
        </div>
    );
};

export default App;

