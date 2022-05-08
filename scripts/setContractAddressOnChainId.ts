import {TWAPOracle} from "../typechain";
import {
    abi as TWAPOracleAbi
} from "./../artifacts/contracts/debridge-twap-oracle/TWAPOracle.sol/TWAPOracle.json";
import {Contract, Wallet} from "ethers";
import assert from "assert";
import {ethers} from "hardhat";
import {FROM_CHAIN_ID, ADDRESS_ON_FROM, ADDRESS_ON_TO, TO_CHAIN_ID} from "./constants";

const main = async () => {
    const signer = new Wallet(process.env.PRIVATE_KEY as string, ethers.provider);

    const contractSender = new Contract(ADDRESS_ON_FROM, TWAPOracleAbi, signer) as TWAPOracle;
    await contractSender.setContractAddressOnChainId(ADDRESS_ON_TO, TO_CHAIN_ID, {gasLimit: 20000000, gasPrice: 300 * 1000000000});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
