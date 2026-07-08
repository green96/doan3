import hre from "hardhat";

async function main() {
  const Profile = await hre.ethers.getContractFactory("Profile");

  const profile = await Profile.deploy();

  await profile.waitForDeployment();

  console.log("Contract deployed to:", await profile.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});