import express, { Application, Request, Response } from 'express';
import { Web3Service } from "./web3Service";

const app: Application = express();
const port = 3000;
const web3Service = new Web3Service();
const contactAdress = "0x77573Fa79bC6be8e8c35FB06F374Dc2f0D29d58E"

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

carRun();

async function carRun() {
    
    await web3Service.connectWallet();
    // wait 5 seconds
    await web3Service.signRide(contactAdress);
    await new Promise(resolve => setTimeout(resolve, 5000));

    await web3Service.listenForUpdates(contactAdress);
    await new Promise(resolve => setTimeout(resolve, 5000));

    await web3Service.setRideProviderAcceptedStatus(contactAdress, "Hallo Welt2");
    await new Promise(resolve => setTimeout(resolve, 5000));

    await web3Service.setRideProviderArrivedAtPickupLocation(contactAdress, "Hallo Welt3");
    await new Promise(resolve => setTimeout(resolve, 5000));
    //await web3Service.setRideProviderStartedRide(contactAdress, "Hallo Welt4");
    //await web3Service.setRideProviderArrivedAtDropoffLocation(contactAdress, "Hallo Welt5");
}


