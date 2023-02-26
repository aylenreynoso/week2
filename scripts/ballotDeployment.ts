import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {

    //const provider = ethers.provider; default inject by hardhat running locally 
    //conection to the blockchain

    const privateKey = process.env.PRIVATE_KEY;
    const provider = ethers.getDefaultProvider("goerli");
    const wallet = new ethers.Wallet(privateKey); //network agnostic
    const signer = wallet.connect(provider) //wallet signer connecter to the provider network

    const balance = await signer.getBalance();
    console.log(`The account ${signer.address} has a balance of ${balance} wei`);

    const args = process.argv;
    //the first arguments passed through cmd are bin.js and <script>.js
    const proposals = args.slice(2);
    //getting the real arguments 
    //command line: yarn run ts-node --files .\scripts\Deployment.ts "arg1" "arg2" "arg3"
    if (proposals.length <= 0) throw new Error("Missing argument: proposals");
    //we cant deploy the contract without proposals
    console.log("Deploying Ballot contract");

    proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    
    //Deployment
    const ballotContractFactory = new Ballot__factory(signer);
    //instantiate the contract factory object type from TypeChain 
    
    console.log("Deploying ballot contract...");
    const ballotContract = await ballotContractFactory.deploy(
        proposals.map((prop) => ethers.utils.formatBytes32String(prop))
    );
    
    console.log("Awaiting for confirmation...");
    const txReceipt = await ballotContract.deployTransaction.wait();
    
    console.log(`Contract deployed at address ${ballotContract.address}, block number: ${txReceipt.blockNumber}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});