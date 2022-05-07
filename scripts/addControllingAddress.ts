import {TWAPOracle} from "../typechain";
import {
    abi as TWAPOracleAbi
} from "./../artifacts/contracts/debridge-twap-oracle/TWAPOracle.sol/TWAPOracle.json";
import {Contract, Wallet} from "ethers";
import {ethers} from "hardhat";
import assert from "assert";
import {FROM_CHAIN_ID, ADDRESS_ON_FROM, ADDRESS_ON_TO, TO_CHAIN_ID} from "./constants";

const main = async () => {
    const signer = new Wallet(process.env.PRIVATE_KEY as string, ethers.provider);

    const contractReceiver = new Contract(ADDRESS_ON_TO, TWAPOracleAbi, signer) as TWAPOracle;
    if (await contractReceiver.isAddressFromChainIdControlling(FROM_CHAIN_ID, ADDRESS_ON_FROM)){
        console.log('The address is already controlling');
        return;
    }

    await contractReceiver.addControllingAddress(ADDRESS_ON_FROM, FROM_CHAIN_ID, {gasLimit: 10000000, gasPrice: 5 * 1000000000});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
