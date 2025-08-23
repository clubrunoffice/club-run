const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Club Run P2P Escrow Contract...");

  // Get the contract factory
  const ClubRunP2PEscrow = await ethers.getContractFactory("ClubRunP2PEscrow");
  
  // Deploy the contract
  const escrowContract = await ClubRunP2PEscrow.deploy();
  
  // Wait for deployment to complete
  await escrowContract.deployed();

  console.log("✅ Club Run P2P Escrow deployed to:", escrowContract.address);
  console.log("📋 Contract Details:");
  console.log("   - Network:", network.name);
  console.log("   - Chain ID:", network.config.chainId);
  console.log("   - Deployer:", await escrowContract.signer.getAddress());
  console.log("   - Platform Fee:", await escrowContract.platformFeePercent(), "basis points (0.25%)");

  // Verify contract on Etherscan if not on localhost
  if (network.name !== "localhost" && network.name !== "hardhat") {
    console.log("⏳ Waiting for block confirmations...");
    await escrowContract.deployTransaction.wait(6);
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: escrowContract.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️  Contract verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    contractName: "ClubRunP2PEscrow",
    address: escrowContract.address,
    network: network.name,
    chainId: network.config.chainId,
    deployer: await escrowContract.signer.getAddress(),
    deploymentTime: new Date().toISOString(),
    platformFee: await escrowContract.platformFeePercent(),
    constructorArgs: []
  };

  console.log("📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return escrowContract;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
