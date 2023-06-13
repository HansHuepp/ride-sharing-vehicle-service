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
            console.log('Contract balance:', this.web3.utils.fromWei(contractBalance, 'ether'));
            console.log('Contract balance2:', contractBalance);
            // Call the createContract function
            const party2Signature = '0x60a7c6066628a615d200e91db865c562c84685fa5817a9defd4b57694604db1b';
            const gasEstimate = yield this.contract.methods
                .signContract(party2Signature)
                .estimateGas({ from: selectedAddress });
            this.contract.methods
                .signContract(party2Signature)
                .send({ from: selectedAddress, gas: gasEstimate })
                .on('transactionHash', (hash) => {
                console.log('Transaction hash:', hash);
            })
                .on('receipt', (receipt) => {
                console.log('Transaction receipt events:', receipt);
                // find the value newContract in receipt.events
                this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
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
                .send({ from: selectedAddress, gas: gasEstimate });
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
                .send({ from: selectedAddress, gas: gasEstimate });
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
                .send({ from: selectedAddress, gas: gasEstimate });
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
                .send({ from: selectedAddress, gas: gasEstimate });
        });
    }
    claimDeposit(contractID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.web3) {
                console.error('MetaMask not connected');
                return;
            }
            const accounts = yield this.web3.eth.getAccounts();
            const selectedAddress = accounts[0];
            // Initialize the contract instance
            this.contract = new this.web3.eth.Contract(contractAbi_json_1.default, contractID);
            // Estimate gas for the claimDeposit function
            const gasEstimate = yield this.contract.methods
                .claimETH()
                .estimateGas({ from: selectedAddress });
            // Call the claimDeposit function
            this.contract.methods
                .claimETH()
                .send({ from: selectedAddress, gas: gasEstimate });
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
                    this.claimDeposit(rideContractAddress);
                    console.log("Super hat alles geklappt");
                }
            }))
                .on('error', console.error);
        });
    }
}
exports.Web3Service = Web3Service;