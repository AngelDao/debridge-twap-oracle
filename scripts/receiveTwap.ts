import {ethers,} from "hardhat";
import {ADDRESS_ON_TO, TO_CHAIN_ID} from "./constants";
import {Contract, Wallet} from "ethers";
import {TWAPOracle} from "../typechain";
import {
    abi as TWAPOracleAbi
} from "./../artifacts/contracts/debridge-twap-oracle/TWAPOracle.sol/TWAPOracle.json";
import assert from "assert";

const main = async () => {
    const signer = new Wallet(process.env.PRIVATE_KEY as string, ethers.provider);
    const contractTo = new Contract(ADDRESS_ON_TO, IncrementorAbi, signer) as Incrementor;
    const result = (await contractTo.claimedTimes());
    console.log(`claimedTimes: ${result}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });