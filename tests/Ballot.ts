import { expect } from "chai";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { BlockList } from "net";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"]

describe("Ballot", () => {

    
    let ballotContract:Ballot; 
    beforeEach(async () => {
        const ballotContractFactory = await ethers.getContractFactory("Ballot");

        ballotContract = await ballotContractFactory.deploy(
            PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop))
        );
        //required for constructor bytes32[] memory proposalNames
        await ballotContract.deployTransaction.wait();
        //has more information than deployed() ????

        
    });

    describe("when the contract is deployed", () => {
        
        it("sets the deployer address as chaiperson", async () => {
            const signers = await ethers.getSigners();
            const deployerAddress = signers[0].address;
            const chairperson = await ballotContract.chairperson();

            expect(chairperson).to.eq(deployerAddress)
        });

        it("has the provided proposals", async () => {
            //proposals is an array of structs (pionters)
            //struct Proposal {
            //    bytes32 name;  
            //    uint voteCount; 
            //}
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(PROPOSALS[index]);
            }
        });

        it("has zero votes for all proposals", async () => {
            
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.proposals(index);
                expect(proposal.voteCount).to.eq(0); 
                //for other numeric values we have to convert the types
            }
        });

        it("sets the voting weight for the chairperson as 1", async () => {
            
            const chairperson = await ballotContract.chairperson();
            const voter = await ballotContract.voters(chairperson);
            //voters is a mapping in solidity 
            //mapping(address => Voter)
            expect(voter.weight).to.eq(1);

        });
    });

    it("passing test", () => {
        return true;
    });
});