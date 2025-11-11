require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const OPTIMISM_SEPOLIA_URL = process.env.OPTIMISM_SEPOLIA_URL;

console.log(PRIVATE_KEY);
console.log(OPTIMISM_SEPOLIA_URL);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepoliaOptimism: {
      url: OPTIMISM_SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155420,
    }
  }
};
