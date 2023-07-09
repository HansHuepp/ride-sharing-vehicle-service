import express, { Application, Request, Response } from 'express';
import * as elliptic from 'elliptic';
import { Web3Service } from "./web3Service";
import { CronJobs } from './cronjobs';

require('dotenv').config();


const app: Application = express();
const web3Service = new Web3Service();
const cronJobs = new CronJobs();
const port = process.env.PORT;
const serviceName = process.env.SERVICE_NAME

let contractAddress: string = "";
let rideInProcess: boolean = false;

const keyPair = generateKeyPair();

export let bidAmount: number = 0;

export function rideInProcessSwitch() {
  rideInProcess = !rideInProcess;
}
app.use(express.json());

cronJobs.startCronJobs();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export async function rideMatchingEngine() {

  if (rideInProcess) {
    console.log("Ride in Process");
    return;
  }

  const avaliableRideRequests: any = await getRideRequests();
  if (avaliableRideRequests.length !== 0) {
    console.log("Ride Requests found");
    const randomRideRequest = avaliableRideRequests[Math.floor(Math.random() * avaliableRideRequests.length)];
    await bidOnRide(randomRideRequest.rideRequestId);
    rideInProcessSwitch();
    await new Promise(resolve => setTimeout(resolve, 70000)); // wait 70 seconds
    await checkIfThisCarhasWinningBid(randomRideRequest.rideRequestId);
    return;
  }

}

async function carRun() {
    await web3Service.connectWallet();
    // wait 5 seconds
    await web3Service.signRide(contractAddress);
    console.log("Ride signed");
    await new Promise(resolve => setTimeout(resolve, 12000));

    await web3Service.listenForUpdates(contractAddress);
    await new Promise(resolve => setTimeout(resolve, 12000));

    await web3Service.setRideProviderAcceptedStatus(contractAddress, "Hallo Welt2");
    await new Promise(resolve => setTimeout(resolve, 12000));

    await web3Service.setRideProviderArrivedAtPickupLocation(contractAddress, "Hallo Welt3");
    await new Promise(resolve => setTimeout(resolve, 12000));
}

async function checkIfThisCarhasWinningBid(rideId: string) {
  const response = await fetch(`http://localhost:8080/rideRequest/${rideId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const data = await response.json();
    
    console.log("Response: ", data  )

    if (data.rideRequest.auctionWinner == serviceName && data.rideRequest.contractAddress) {
      console.log("This car has winning bid or ride was not accepted")
      contractAddress = data.rideRequest.contractAddress;
      carRun();
    } else {
      console.log("This car does not have winning bid")
      rideInProcessSwitch();
    }
  }
}

async function getRideRequests() {
  const response = await fetch(`http://localhost:8080/rideRequests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const data = await response.json();
    return data;
  }
}



async function bidOnRide(rideId: string) {
  bidAmount = Math.floor(Math.random() * 30) + 14; 
  console.log("Service name: ", serviceName);
  console.log("Bid amount: ", bidAmount);


  const bid = {
    rideRequestId: rideId,
    rideProviderId: serviceName,
    amount: bidAmount,
    rating: 5,
    model: 'Tesla Model Y',
    estimatedArrivalTime: 5,
    passengerCount: 0,
    vehiclePublicKey: keyPair.publicKey
  };
  // fetch 'http://localhost:8080/bid' with bid as body
  const response = await fetch(`http://localhost:8080/bid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bid),
  })
  return response;
}

function   generateKeyPair(): any {
  const ec = new elliptic.ec('secp256k1');
  const keyPair = ec.genKeyPair();

  const publicKey = keyPair.getPublic('hex');
  const privateKey = keyPair.getPrivate('hex');

  return {
    publicKey,
    privateKey
  }
}


