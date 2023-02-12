const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("SimpleNFT contract", function () {
    async function deployTokenFixture() {
        const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
        const [owner, addr1, addr2] = await ethers.getSigners();
    
        const deployedContract = await SimpleNFT.deploy();
    
        await deployedContract.deployed();
    
        // Fixtures can return anything you consider useful for your tests
        return { SimpleNFT, deployedContract, owner, addr1, addr2 };
    }

    it("Should emit CollectionCreated events", async function () {
        const { deployedContract, addr1 } = await loadFixture(
            deployTokenFixture
        );

        await expect(deployedContract.createNewCollection(addr1.address, "Collection #1", "COL1"))
            .to.emit(deployedContract, "CollectionCreated")
            .withArgs(addr1.address, "Collection #1", "COL1");

        await expect(deployedContract.createNewCollection(addr1.address, "Collection #1", "COL1"))
            .be.rejectedWith("the collection exists");
    });

    it("Should emit CollectionCreated events", async function () {
        const { deployedContract, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        await expect(deployedContract.mint(addr1.address, addr2.address, 1, "tokenURI"))
            .be.rejectedWith("the collection does not find");

        await deployedContract.createNewCollection(addr1.address, "Collection #1", "COL1");

        await expect(deployedContract.mint(addr1.address, addr2.address, 1, "tokenURI"))
            .to.emit(deployedContract, "TokenMinted")
            .withArgs(addr1.address, addr2.address, 1, "tokenURI");
    });

});
