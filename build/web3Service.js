"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Service = void 0;
const web3_1 = __importDefault(require("web3"));
const contractAbi_json_1 = __importDefault(require("./abi-files/contractAbi.json"));
const _1 = require(".");
class Web3Service {
    constructor() {
        this.myAddress = null;
        this.myBalance = null;
        this.rideContractAddress = null;
        this.userReadyToStartRid = false;
        this.userMarkedRideComplete = false;
        this.userCanceldRide = false;
    }
    connectWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const privateKey = process.env.PRIVATE_KEY;
                const infuraUrl = "http://127.0.0.1:7545";
                const account = new web3_1.default().eth.accounts.privateKeyToAccount(privateKey);
                this.web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider(infuraUrl));
                this.myAddress = account.address;
                this.myBalance = yield this.web3.eth.getBalance(this.myAddress);
                this.myBalance = this.web3.utils.fromWei(this.myBalance, 'ether');
                console.log('Wallet connected');
                console.log('Selected address:', this.myAddress);
                console.log('Balance:', this.myBalance + ' ETH');
            }
            catch (error) {
                console.error('Error connecting to wallet:', error);
            }
        });
    }
    signRide(contractID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            const contractBalance = yield this.web3.eth.getBalance(contractID);
            console.log('Contract balance:', contractBalance);
            const part = this.web3.utils.toWei('0.1', 'ether');
            const gasEstimate = yield this.contract.methods
                .signContract()
                .estimateGas({ from: selectedAddress, value: part });
            this.contract.methods
                .signContract()
                .send({ from: selectedAddress, value: part, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('contract signed');
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
                // find the value newContract in receipt.events
                this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
                console.log('Ride contract address:', this.rideContractAddress);
            })
                .on('error', (error) => {
                console.error('Error:', error);
            });
        });
    }
    setRideProviderAcceptedStatus(contractID, rideProviderAcceptedStatusMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            // Estimate gas for the setRideProviderAcceptedStatus function
            const gasEstimate = yield this.contract.methods
                .setRideProviderAcceptedStatus(rideProviderAcceptedStatusMessage)
                .estimateGas({ from: selectedAddress });
            // Call the setRideProviderAcceptedStatus function
            this.contract.methods
                .setRideProviderAcceptedStatus(rideProviderAcceptedStatusMessage)
                .send({ from: selectedAddress, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('Accepted Ride');
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
                // find the value newContract in receipt.events
                this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
                console.log('Ride contract address:', this.rideContractAddress);
            })
                .on('error', (error) => {
                console.error('Error:', error);
            });
        });
    }
    setRideProviderArrivedAtPickupLocation(contractID, rideProviderArrivedAtPickupLocationMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            // Estimate gas for the setRideProviderAcceptedStatus function
            const gasEstimate = yield this.contract.methods
                .setRideProviderArrivedAtPickupLocation(rideProviderArrivedAtPickupLocationMessage)
                .estimateGas({ from: selectedAddress });
            // Call the setRideProviderAcceptedStatus function
            this.contract.methods
                .setRideProviderArrivedAtPickupLocation(rideProviderArrivedAtPickupLocationMessage)
                .send({ from: selectedAddress, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('Arrived at pickup location');
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
                // find the value newContract in receipt.events
                this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
                console.log('Ride contract address:', this.rideContractAddress);
            })
                .on('error', (error) => {
                console.error('Error:', error);
            });
        });
    }
    setRideProviderStartedRide(contractID, rideProviderStartedRideMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            // Estimate gas for the setRideProviderAcceptedStatus function
            const gasEstimate = yield this.contract.methods
                .setRideProviderStartedRide(rideProviderStartedRideMessage)
                .estimateGas({ from: selectedAddress });
            // Call the setRideProviderAcceptedStatus function
            this.contract.methods
                .setRideProviderStartedRide(rideProviderStartedRideMessage)
                .send({ from: selectedAddress, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('Started Ride');
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
                // find the value newContract in receipt.events
                this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
                console.log('Ride contract address:', this.rideContractAddress);
            })
                .on('error', (error) => {
                console.error('Error:', error);
            });
        });
    }
    addPassenger(contractID, passengerId, seatingPosition, startTime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            // Call the addPassenger function
            const gasEstimate = yield this.contract.methods
                .addPassenger(passengerId, seatingPosition, startTime)
                .estimateGas({ from: selectedAddress });
            this.contract.methods
                .addPassenger(passengerId, seatingPosition, startTime)
                .send({ from: selectedAddress, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('Add Passenger');
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
            })
                .on('error', (error) => {
                console.error('Error:', error);
            });
        });
    }
    setRideProviderArrivedAtDropoffLocation(contractID, rideProviderArrivedAtDropoffLocationMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            // Estimate gas for the setRideProviderAcceptedStatus function
            const gasEstimate = yield this.contract.methods
                .setRideProviderArrivedAtDropoffLocation(rideProviderArrivedAtDropoffLocationMessage)
                .estimateGas({ from: selectedAddress });
            // Call the setRideProviderAcceptedStatus function
            this.contract.methods
                .setRideProviderArrivedAtDropoffLocation(rideProviderArrivedAtDropoffLocationMessage)
                .send({ from: selectedAddress, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('Arrived at dropoff location');
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
                // find the value newContract in receipt.events
                this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
                console.log('Ride contract address:', this.rideContractAddress);
            })
                .on('error', (error) => {
                console.error('Error:', error);
            });
        });
    }
    claimDeposit(contractID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const part = 100;
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            // Estimate gas for the claimDeposit function
            const gasEstimate = yield this.contract.methods
                .claimETH(part)
                .estimateGas({ from: selectedAddress });
            // Call the claimDeposit function
            this.contract.methods
                .claimETH(part)
                .send({ from: selectedAddress, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('Claim Deposit');
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
                // find the value newContract in receipt.events
                this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
                console.log('Ride contract address:', this.rideContractAddress);
            })
                .on('error', (error) => {
                console.error('Error:', error);
            });
            console.log("Deposit claimed");
            (0, _1.rideInProcessSwitch)();
        });
    }
    listenForUpdates(rideContractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3 || !rideContractAddress) {
                console.error('MetaMask not connected or ride contract address not set');
                return;
            }
            // Initialize the contract instance
            const contractInstance = new this.web3.eth.Contract(contractAbi_json_1.default, rideContractAddress);
            // Listen for UpdatePosted events
            contractInstance.events.allEvents()
                .on('data', (event) => __awaiter(this, void 0, void 0, function* () {
                const functionName = event.returnValues.functionName;
                console.log("Function Name: ", functionName);
                if (functionName == "userReadyToStartRide") {
                    this.setRideProviderStartedRide(rideContractAddress, "Hallo Welt4");
                    yield new Promise(resolve => setTimeout(resolve, 10000));
                    this.setRideProviderArrivedAtDropoffLocation(rideContractAddress, "Hallo Welt5");
                    yield new Promise(resolve => setTimeout(resolve, 10000));
                }
                if (functionName == "userMarkedRideComplete") {
                    yield new Promise(resolve => setTimeout(resolve, 10000));
                    this.claimDeposit(rideContractAddress);
                    console.log("Super hat alles geklappt");
                }
            }))
                .on('error', console.error);
        });
    }
}
exports.Web3Service = Web3Service;
