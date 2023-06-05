import express, { Application, Request, Response } from 'express';
import { Web3Service } from "./web3Service";

const app: Application = express();
const port = 3000;
const web3Service = new Web3Service();
//const contactAdress = "0x44bF6b6De637823Ce0fAEaCF01557660D5FC9AC4"
let contractAddress: string = "";

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
  });
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/startRide', async (req: Request, res: Response) => {
   contractAddress = req.body.contractAddress;
   carRun();
   res.send('Starting Ride');
});


async function carRun() {
    
    await web3Service.connectWallet();
    // wait 5 seconds
    await web3Service.signRide(contractAddress);
    await new Promise(resolve => setTimeout(resolve, 12000));

    await web3Service.listenForUpdates(contractAddress);
    await new Promise(resolve => setTimeout(resolve, 12000));

    await web3Service.setRideProviderAcceptedStatus(contractAddress, "Hallo Welt2");
    await new Promise(resolve => setTimeout(resolve, 12000));

    await web3Service.setRideProviderArrivedAtPickupLocation(contractAddress, "Hallo Welt3");
    await new Promise(resolve => setTimeout(resolve, 12000));
    //await web3Service.setRideProviderStartedRide(contactAdress, "Hallo Welt4");
    //await web3Service.setRideProviderArrivedAtDropoffLocation(contactAdress, "Hallo Welt5");
}


