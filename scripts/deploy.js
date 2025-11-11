const { ethers } = require("hardhat"); 

async function main() { 
    const [deployer] = await ethers.getSigners(); 
    console.log("Deploying contract with account:", deployer.address); 
    const MyToken = await ethers.getContractFactory("MyToken"); 
    const myToken = await MyToken.deploy(ethers.parseEther("1000000")); 
    await myToken.waitForDeployment(); 
    const address = await myToken.getAddress();
    console.log("MyToken deployed to:", address); 
} 

main().catch((error) => {
     console.error(error); process.exitCode = 1; 
    });


