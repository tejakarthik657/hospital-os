import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // 1. Define the Solidity version used in your MedicalAudit.sol contract
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  // 2. Configure the local network for the hospital's private chain
  networks: {
    // This represents the local 'Hardhat Node' running on your machine
    localhost: {
      url: "http://127.0.0.1:8545",
      // Hardhat will automatically use the 20 test accounts generated 
      // when you run 'npx hardhat node'
    },
    
    // Default Hardhat network (used for running tests)
    hardhat: {
      chainId: 1337, // Standard chainId for local development
    },
  },

  // 3. Configuration for the artifacts (where the compiled code goes)
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
};

export default config;