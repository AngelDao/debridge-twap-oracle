import {ethers} from "hardhat";
import {TWAPTest} from "../typechain";

async function main() {

    const TWAPTestInstance = await ethers.getContractFactory("TWAPTest");
    const deployment = await TWAPTestInstance.deploy() as TWAPTest;
    await deployment.deployed();
    console.log("deployed to:", deployment.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });