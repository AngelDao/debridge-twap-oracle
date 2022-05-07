import assert from "assert";
import {ethers} from "hardhat";
import {FROM_CHAIN_ID, ADDRESS_ON_FROM, TO_CHAIN_ID} from "./constants";
import {Contract, ContractReceipt, utils, Wallet} from "ethers";
import {TWAPOracle} from "../typechain";
import {
    abi as TWAPOracleAbi
} from "./../artifacts/contracts/debridge-twap-oracle/TWAPOracle.sol/TWAPOracle.json";
import {
    abi as DeBridgeGateAbi
} from "./../artifacts/contracts/debridge-twap-oracle/forkedInterfaces/IDeBridgeGate.sol/IDeBridgeGate.json";
import {parseEther} from "ethers/lib/utils";
import {IDeBridgeGateInterface} from "../typechain/IDeBridgeGate";
import {Log} from "hardhat-deploy/dist/types";
import {LogDescription} from "@ethersproject/abi";

const main = async () => {

    const signer = new Wallet(process.env.PRIVATE_KEY as string, ethers.provider);

    const contractSender = new Contract(ADDRESS_ON_FROM, TWAPOracleAbi, signer) as TWAPOracle;

    const executionFee = parseEther('0.5');

    const pool = "0x45dda9cb7c25131df268515131f647d726f50608";

    const twapDuration = "600";

    const tx = await contractSender.getV3TWAP(pool, twapDuration, TO_CHAIN_ID, signer.address, executionFee, {
        // executionFee + commissions + a little more
        // ~0,1% + 0.01
        value: parseEther('1'),
        gasLimit: 29000000, 
        gasPrice: 300 * 1000000000
    });

    console.log("TX", tx)

    const receipt = await tx.wait();

    console.log("Receipt", receipt)

    const sentLogDescription = await getSentEvent(receipt);
    const {submissionId} = sentLogDescription.args;

    console.log(`Submission id: ${submissionId}`);
    console.log(`Url: https://testnet.debridge.finance/transaction?tx=${tx.hash}&chainId=${FROM_CHAIN_ID}`);

}

async function getSentEvent(receipt: ContractReceipt): Promise<LogDescription> {
    const deBridgeGateInterface = new utils.Interface(DeBridgeGateAbi) as IDeBridgeGateInterface;
    const toLogDescription = (log: Log): LogDescription | null => {
        try {
            return deBridgeGateInterface.parseLog(log);
        } catch (e) {
            return null;
        }
    };
    const isNotNull = (x: unknown) => x !== null;
    const logDescriptions = receipt.logs.map(toLogDescription).filter(isNotNull) as LogDescription[];

    const sentEvent = logDescriptions.find(({name}) => name === 'Sent');
    assert(typeof sentEvent !== 'undefined', 'Sent event is not found');
    return sentEvent;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });