const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalAudit Integrity Test", function () {
  it("Should store and verify a medical record hash", async function () {
    const MedicalAudit = await ethers.getContractFactory("MedicalAudit");
    const contract = await MedicalAudit.deploy();

    const recordId = "mongo_id_123";
    const dummyHash = ethers.id("Patient Jane Doe: Healthy"); // Simulating a SHA-256 hash

    // 1. Sign the record
    await contract.signRecord(recordId, dummyHash);

    // 2. Verify it matches
    const storedHash = await contract.verifyRecord(recordId);
    expect(storedHash).to.equal(dummyHash);
  });
});