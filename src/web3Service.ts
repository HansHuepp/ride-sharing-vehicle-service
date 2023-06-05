import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractAbi from './abi-files/contractAbi.json';

export class Web3Service {

  web3: Web3 | undefined;
  contract: Contract | undefined | any;

  myAddress: string | null = null;
  myBalance: string | null = null;
  rideContractAddress: string | null = null;

  userReadyToStartRid: boolean = false;
  userMarkedRideComplete: boolean = false;
  userCanceldRide: boolean = false;

  async connectWallet() {
    try {
      const privateKey = "0xc1e8b01ac7feb373cad1e388a8da8571d1721834e80c68acd13fd9564041b7b4"; // replace with your private key
      const infuraUrl = "http://127.0.0.1:7545"; // replace with your Infura URL
      const account = new Web3().eth.accounts.privateKeyToAccount(privateKey);
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(infuraUrl));


      
      this.myAddress = account.address;
      this.myBalance = await this.web3.eth.getBalance(this.myAddress);
      this.myBalance = this.web3.utils.fromWei(this.myBalance, 'ether');
      console.log('Wallet connected');
      console.log('Selected address:', this.myAddress);
      console.log('Balance:', this.myBalance + ' ETH');
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  }

  async signRide(contractID: string) {

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID,
    );

    const contractBalance = await this.web3.eth.getBalance(contractID);
    console.log('Contract balance:', this.web3.utils.fromWei(contractBalance, 'ether'));
    console.log('Contract balance2:', contractBalance);
    // Call the createContract function
    const party2Signature = '0x60a7c6066628a615d200e91db865c562c84685fa5817a9defd4b57694604db1b';
    const gasEstimate = await this.contract.methods
      .signContract(party2Signature)
      .estimateGas({ from: selectedAddress });

    this.contract.methods
      .signContract(party2Signature)
      .send({ from: selectedAddress, gas: gasEstimate })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction receipt events:', receipt);
        // find the value newContract in receipt.events
        this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
  }

  async setRideProviderAcceptedStatus(contractID: string, rideProviderAcceptedStatusMessage: string) {

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderAcceptedStatus(rideProviderAcceptedStatusMessage)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderAcceptedStatus(rideProviderAcceptedStatusMessage)
      .send({ from: selectedAddress, gas: gasEstimate })
  }

  async setRideProviderArrivedAtPickupLocation(contractID: string, rideProviderArrivedAtPickupLocationMessage: string) {

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderArrivedAtPickupLocation(rideProviderArrivedAtPickupLocationMessage)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderArrivedAtPickupLocation(rideProviderArrivedAtPickupLocationMessage)
      .send({ from: selectedAddress, gas: gasEstimate })
  }

  async setRideProviderStartedRide(contractID: string, rideProviderStartedRideMessage: string) {

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderStartedRide(rideProviderStartedRideMessage)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderStartedRide(rideProviderStartedRideMessage)
      .send({ from: selectedAddress, gas: gasEstimate })
  }



  async setRideProviderArrivedAtDropoffLocation(contractID: string, rideProviderArrivedAtDropoffLocationMessage: string) {

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderArrivedAtDropoffLocation(rideProviderArrivedAtDropoffLocationMessage)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderArrivedAtDropoffLocation(rideProviderArrivedAtDropoffLocationMessage)
      .send({ from: selectedAddress, gas: gasEstimate })
  }

  async claimDeposit(contractID: string) {

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID,
    );

    // Estimate gas for the claimDeposit function
    const gasEstimate = await this.contract.methods
      .claimETH()
      .estimateGas({ from: selectedAddress });

    // Call the claimDeposit function
    this.contract.methods
      .claimETH()
      .send({ from: selectedAddress, gas: gasEstimate })
  }

  async listenForUpdates(rideContractAddress: string) {
    if (!this.web3 || !rideContractAddress) {
      console.error('MetaMask not connected or ride contract address not set');
      return;
    }

    // Initialize the contract instance
    const contractInstance = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      rideContractAddress,
    );

    // Listen for UpdatePosted events
     contractInstance.events.allEvents()
    .on('data', async (event: any) => {
      const functionName = event.returnValues.functionName;
      console.log("Function Name: ", functionName);

      if(functionName == "userReadyToStartRide"){
        this.setRideProviderStartedRide(rideContractAddress, "Hallo Welt4")
        await new Promise(resolve => setTimeout(resolve, 10000));
        this.setRideProviderArrivedAtDropoffLocation(rideContractAddress, "Hallo Welt5");
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      
      if(functionName == "userMarkedRideComplete"){
        this.claimDeposit(rideContractAddress);
        console.log("Super hat alles geklappt");
      }

    })
    .on('error', console.error);
  }



}

