// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import path from "path";
import fs from "fs";
import { ethers, artifacts } from "hardhat";

async function main() {

    const RockPaperScissor = await ethers.getContractFactory("RockPaperScissor");
    const rps = await RockPaperScissor.deploy();
    await rps.waitForDeployment();
    
    const address = await rps.getAddress();

    console.log("Token address:", address);

    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(rps, address);
}

function saveFrontendFiles(token: any, address: string) {
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        path.join(contractsDir, "contract-address.json"),
        JSON.stringify({ Token: address }, undefined, 2)
    );

    const TokenArtifact = artifacts.readArtifactSync("RockPaperScissor");

    fs.writeFileSync(
        path.join(contractsDir, "RockPaperScissor.json"),
        JSON.stringify(TokenArtifact, null, 2)
    );
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
