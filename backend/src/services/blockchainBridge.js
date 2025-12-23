import { ethers } from 'ethers';

/**
 * Connects the Backend to the Smart Contract (Phase 3)
 * Provides the "Approve & Sign" logic for Image 11
 */
export async function signOnBlockchain(recordId, hash) {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);
    
    const abi = ["function signRecord(string _recordId, bytes32 _hash) public"];
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

    const tx = await contract.signRecord(recordId, "0x" + hash);
    await tx.wait();
    
    return tx.hash; // Transaction ID for audit logs
  } catch (error) {
    console.error("Blockchain Bridge Error:", error);
    return null;
  }
}