import { ethers } from "./ethers.js";
import { abi, contractAddress} from "./constant.js";

const connect = async () =>{
    console.log("Hello");
    if(window.ethereum !== undefined) {
        await window.ethereum.request({method: "eth_requestAccounts"});
        document.getElementById("connect").innerHTML = "Connected";
    } else {
        console.log("No MetaMask");
        document.getElementById("connect").innerHTML = "MetaMask Not installed";
        setTimeout(() => {
            document.getElementById("connect").innerHTML = "connect";
        }, 5000)
    }
}

const fund = async () => {
    if(window.ethereum !== undefined) {
        const Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const fundAmount = document.getElementById("fundText").value;
        try {
            const transaction = await contract.fund({
                value: ethers.utils.parseEther(fundAmount)
            });
            await listenForTransactions(transaction, Provider);
            console.log("Done!"); 
        } catch (error) {
            console.log(error);
        }
        
    } else {
        console.log("No MetaMask");
        document.getElementById("fund").innerHTML = "MetaMask Not installed";
        setTimeout(() => {
            document.getElementById("fund").innerHTML = "fund";
        }, 5000)
        
    }
}

const listenForTransactions = async (transaction, provider) => {
    console.log(`mining ${transaction.hash}`);
    return new Promise((resolve, reject) => {
        provider.once(transaction.hash, (transactionReceipt) => {
            console.log(`mined ${transactionReceipt.confirmations} confirmations`);
            resolve();
        });
    });

}

const getBalance = async () => {
    if(window.ethereum !== undefined) {
        const Provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await Provider.getBalance(contractAddress);
        document.getElementById("balance").innerHTML = ethers.utils.formatEther(balance);
    }
    
}

const withdraw = async () => {
    if(window.ethereum !== undefined) {
        const Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transaction = await contract.withdraw();
            await listenForTransactions(transaction, Provider);
            console.log("Done!"); 
        } catch (error) {
            console.log(error);
        }
    }
}
document.getElementById("connect").addEventListener("click", connect);
document.getElementById("fund").addEventListener("click", fund);
document.getElementById("getbalance").addEventListener("click", getBalance);
document.getElementById("withdraw").addEventListener("click", withdraw);