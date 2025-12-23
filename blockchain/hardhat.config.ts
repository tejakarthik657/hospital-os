import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-mocha-ethers"; // Or the mocha-ethers one if you used that

export default defineConfig({
  solidity: "0.8.28", // Use a modern version for your Hospital OS
});