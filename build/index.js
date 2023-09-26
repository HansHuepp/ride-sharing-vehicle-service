"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.rideMatchingEngine = exports.rideInProcessSwitch = exports.bidAmount = void 0;
const express_1 = __importDefault(require("express"));
const elliptic = __importStar(require("elliptic"));
const web3Service_1 = require("./web3Service");
const cronjobs_1 = require("./cronjobs");
require('dotenv').config();
const app = (0, express_1.default)();
const web3Service = new web3Service_1.Web3Service();
const cronJobs = new cronjobs_1.CronJobs();
const port = process.env.PORT;
const serviceName = process.env.SERVICE_NAME;
let contractAddress = "";
let rideInProcess = false;
const keyPair = generateKeyPair();
exports.bidAmount = 0;
function rideInProcessSwitch() {
    rideInProcess = !rideInProcess;
}
exports.rideInProcessSwitch = rideInProcessSwitch;
app.use(express_1.default.json());
cronJobs.startCronJobs();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
function rideMatchingEngine() {
    return __awaiter(this, void 0, void 0, function* () {
        if (rideInProcess) {
            console.log("Ride in Process");
            return;
        }
        const avaliableRideRequests = yield getRideRequests();
        if (avaliableRideRequests.length !== 0) {
            console.log("Ride Requests found");
            const randomRideRequest = avaliableRideRequests[Math.floor(Math.random() * avaliableRideRequests.length)];
            yield bidOnRide(randomRideRequest.rideRequestId);
            rideInProcessSwitch();
            yield new Promise(resolve => setTimeout(resolve, 70000)); // wait 70 seconds
            yield checkIfThisCarhasWinningBid(randomRideRequest.rideRequestId);
            return;
        }
    });
}
exports.rideMatchingEngine = rideMatchingEngine;
function carRun() {
    return __awaiter(this, void 0, void 0, function* () {
        yield web3Service.connectWallet();
        // wait 5 seconds
        yield web3Service.signRide(contractAddress);
        console.log("Ride signed");
        yield new Promise(resolve => setTimeout(resolve, 12000));
        yield web3Service.listenForUpdates(contractAddress);
        yield new Promise(resolve => setTimeout(resolve, 12000));
        yield web3Service.setRideProviderAcceptedStatus(contractAddress, "Hallo Welt2");
        yield new Promise(resolve => setTimeout(resolve, 12000));
        yield web3Service.addPassenger(contractAddress, "userAuthPseudonym1", 1, "11:00");
        yield web3Service.addPassenger(contractAddress, "userAuthPseudonym2", 2, "11:30");
        yield web3Service.setRideProviderArrivedAtPickupLocation(contractAddress, "Hallo Welt3");
        yield new Promise(resolve => setTimeout(resolve, 12000));
    });
}
function checkIfThisCarhasWinningBid(rideId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:8080/rideRequest/${rideId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            const data = yield response.json();
            console.log("Response: ", data);
            if (data.rideRequest.auctionWinner == serviceName && data.rideRequest.contractAddress) {
                console.log("This car has winning bid or ride was not accepted");
                contractAddress = data.rideRequest.contractAddress;
                carRun();
            }
            else {
                console.log("This car does not have winning bid");
                rideInProcessSwitch();
            }
        }
    });
}
function getRideRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:8080/rideRequests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            const data = yield response.json();
            return data;
        }
    });
}
function bidOnRide(rideId) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.bidAmount = Math.floor(Math.random() * 30) + 14;
        console.log("Service name: ", serviceName);
        console.log("Bid amount: ", exports.bidAmount);
        const bid = {
            rideRequestId: rideId,
            rideProviderId: serviceName,
            amount: exports.bidAmount,
            rating: 5,
            model: 'Tesla Model Y',
            estimatedArrivalTime: 5,
            passengerCount: 2,
            vehiclePublicKey: keyPair.publicKey
        };
        // fetch 'http://localhost:8080/bid' with bid as body
        const response = yield fetch(`http://localhost:8080/bid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bid),
        });
        return response;
    });
}
function generateKeyPair() {
    const ec = new elliptic.ec('secp256k1');
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic('hex');
    const privateKey = keyPair.getPrivate('hex');
    return {
        publicKey,
        privateKey
    };
}
