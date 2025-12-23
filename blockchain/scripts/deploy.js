const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MedicalAudit Contract...");

  const MedicalAudit = await hre.ethers.getContractFactory("MedicalAudit");
  const contract = await MedicalAudit.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ MedicalAudit deployed to: ${address}`);
  console.log("⚠️ Copy this address to your Backend .env file!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});