// Blockchain Bridge Service - Connects Backend to Smart Contract
// Handles blockchain operations for immutable audit logs

const ethers = require('ethers');

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = require('../artifacts/MedicalAudit.json').abi;
const PROVIDER_URL = process.env.ETHEREUM_PROVIDER_URL || 'http://localhost:8545';

class BlockchainBridge {
  static async recordAuditLog(recordId, doctorAddress, signature) {
    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.recordMedicalSignature(recordId, doctorAddress, signature);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status,
      };
    } catch (error) {
      console.error('Blockchain error:', error);
      throw error;
    }
  }

  static async getAuditLog(recordId) {
    try {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const log = await contract.getAuditLog(recordId);
      return log;
    } catch (error) {
      console.error('Blockchain read error:', error);
      throw error;
    }
  }
}

module.exports = BlockchainBridge;
