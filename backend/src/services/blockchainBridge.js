import { ethers } from 'ethers';
import crypto from 'crypto';

// Local Hardhat Node Connection (Zero Cost)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY; 
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = [
    "function signRecord(string _recordId, bytes32 _hash) public",
    "function getRecordHash(string _recordId) public view returns (bytes32)"
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

/**
 * 1. Create a Digital Fingerprint of the Medical Record
 */
export function generateRecordHash(data) {
    // We stringify the SOAP notes, vitals, and AI summary
    const content = JSON.stringify({
        notes: data.soapNotes,
        summary: data.aiAnalysis.summaryDraft,
        vitals: data.vitals
    });
    return "0x" + crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * 2. Push the Hash to Blockchain (Image 11 Logic)
 */
export async function signOnBlockchain(recordId, hash) {
    try {
        const tx = await contract.signRecord(recordId, hash);
        await tx.wait(); // Wait for block confirmation
        return tx.hash;  // Returns the Transaction Hash for Image 11
    } catch (error) {
        console.error("Blockchain Signing Failed:", error);
        return null;
    }
}

/**
 * 3. Integrity Verification (Image 14 Audit Logic)
 */
export async function verifyIntegrity(recordId, currentData) {
    const currentHash = generateRecordHash(currentData);
    const onChainHash = await contract.getRecordHash(recordId);
    
    // If these don't match, the record was tampered with!
    return currentHash === onChainHash;
}