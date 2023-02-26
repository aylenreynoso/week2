//function myFunction(){}
//describe("My title", myFunction); 

import { expect } from "chai";
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";

describe("Hello World", () => {

    //hooks: before, after, beforeEach, afterEach
    let  helloWorldContract: HelloWorld; //infer type
    beforeEach(async () => {
        const helloWorldContractFactory = await ethers.getContractFactory("HelloWorld");
        //object capable of creating and deploying contracts to a vm
        //received the naame of the artifact contract
        //uses a signer (default the first one) from ethers to sign the transactions

        helloWorldContract = await helloWorldContractFactory.deploy();
        //deploy recieves the arguments requires in the contract constructor

        await helloWorldContract.deployed();
    });


    it("passing test", () => {
        return true;
    });

    it("Should return Hello World", async () => {
        const text = await helloWorldContract.helloWorld();
        //executes the contract method

        expect(text).to.eq("Hello World");
        
    });

    it("Should set owner to deployer account", async () => {
        //by default uses the first signer on the list to deploy the contract

        const signers = await ethers.getSigners();
        const owner = await helloWorldContract.owner();
        //here we're working with RO opperations
        expect(owner).to.eq(signers[0].address);
        
    });

    it("Should allow the owner to transfer Ownership", async () => {
        //by default uses the first signer on the list to deploy the contract

        const signers = await ethers.getSigners();
        let owner = await helloWorldContract.owner();
        console.log("The owner before the function call is " + owner);
        const tx = await helloWorldContract.transferOwnership(signers[1].address);
        //here we're working with W opperations, a transaction is sent to the blockchain
        await tx.wait()
        //wait for the transaction to be included in a block
        //resolves once the transaction hasd been included in the chain
        //CALL_EXCEPTION raised if the transaction was rejected

        owner = await helloWorldContract.owner()
        console.log("The owner after the function call is " + owner);
        
        expect(owner).to.eq(signers[1].address);
        
    });

    it("Should not allow anyone other than the owner to call transferOwnership", async () => {
        //by default uses the first signer on the list to deploy the contract

        const signers = await ethers.getSigners();
        let owner = await helloWorldContract.owner();

        await expect (helloWorldContract
            .connect(signers[1]) //connect return a new instance of the contrat but connected to the signer passed as param
            .transferOwnership(signers[1].address)).to.be.revertedWith("Caller is not the owner");
        
    });
});