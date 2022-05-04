import {ethers, upgrades} from "hardhat";
import {TWAPOracle} from "../typechain";
import {DE_BRIDGE_GATE_ADDRESS} from "./constants";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';

async function main() {

    const TWAPOracleFactory = await ethers.getContractFactory("TWAPOracle");
    const deployment = await upgrades.deployProxy(TWAPOracleFactory, [DE_BRIDGE_GATE_ADDRESS]) as TWAPOracle;
    await deployment.deployed();
    console.log("proxy deployed to:", deployment.address);
    console.log("initialized with debridge gate:", DE_BRIDGE_GATE_ADDRESS)
    console.log("implementation deployed to:", await getImplementationAddress(ethers.provider, deployment.address));

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });