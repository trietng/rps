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

    saveContractFiles(address);
}

function saveContractFiles(address: string) {
    const frontendDir = path.join(__dirname, "..", "frontend", "src", "contracts");
    const backendDir = path.join(__dirname, "..", "backend", "contracts");

    if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir);
    }

    if (!fs.existsSync(backendDir)) {
        fs.mkdirSync(backendDir);
    }

    fs.writeFileSync(
        path.join(frontendDir, "contract-address.json"),
        JSON.stringify({ token: address }, undefined, 2)
    );

    const TokenArtifact = artifacts.readArtifactSync("RockPaperScissor");

    fs.writeFileSync(
        path.join(frontendDir, "rock-paper-scissor.json"),
        JSON.stringify(TokenArtifact, null, 2)
    );

    // Copy the contracts from frontend to backend
    fs.copyFileSync(
        path.join(frontendDir, "contract-address.json"),
        path.join(backendDir, "contract-address.json")
    );

    fs.copyFileSync(
        path.join(frontendDir, "rock-paper-scissor.json"),
        path.join(backendDir, "rock-paper-scissor.json")
    );
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
