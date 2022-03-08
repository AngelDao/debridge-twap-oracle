// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./BridgeAppBase.sol";
import "./forkedInterfaces/IDeBridgeGate.sol";
//import { UniswapOracle } from  "@keydonix/uniswap-oracle-contracts/source/UniswapOracle.sol";
//import { IUniswapV2Pair } from "@keydonix/uniswap-oracle-contracts/source/IUniswapV2Pair.sol";

/// @dev Example contract to show how to send a simple message to another chain using deBridgeGate
contract TWAPOracle is BridgeAppBase {

    using Flags for uint256;

    //event ReceivedPrice(IUniswapV2Pair _exchange, address _denominationToken, uint8 _minBlocksBack, uint8 _maxBlocksBack, uint256 price, uint256 blockNumber);

    function initialize(IDeBridgeGate _deBridgeGate) external initializer {
        __BridgeAppBase_init(_deBridgeGate);
    }

    function getV2TWAP(
       /* IUniswapV2Pair _exchange, 
        address _denominationToken, 
        uint8 _minBlocksBack, 
        uint8 _maxBlocksBack, 
        UniswapOracle.ProofData memory _proofData,*/
        uint256 _chainIdTo,
        address _fallback,
        uint256 _executionFee
    ) external virtual payable whenNotPaused {
        IDeBridgeGate.SubmissionAutoParamsTo memory autoParams;
        autoParams.flags = autoParams.flags.setFlag(Flags.REVERT_IF_EXTERNAL_FAIL, true);
        autoParams.flags = autoParams.flags.setFlag(Flags.PROXY_WITH_SENDER, true);
        autoParams.executionFee = _executionFee;
        autoParams.fallbackAddress = abi.encodePacked(_fallback);
        //autoParams.data = abi.onBridgedMessage("onBridgedMessage(IUniswapV2Pair, address, uint8, uint8, UniswapOracle.ProofData)", _exchange, _denominationToken, _minBlocksBack, _maxBlocksBack, _proofData);
        autoParams.data = abi.encodeWithSignature("onBridgedMessage()");

        address contractAddressTo = chainIdToContractAddress[_chainIdTo];
        if (contractAddressTo == address(0)) {
            revert ChainToIsNotSupported();
        }

        deBridgeGate.send(
            address(0),
            0, // not sending any funds
            _chainIdTo,
            abi.encodePacked(contractAddressTo),
            "",
            false,
            0,
            abi.encode(autoParams)
        );
    }

    function onBridgedMessage(/*IUniswapV2Pair _exchange, address _denominationToken, uint8 _minBlocksBack, uint8 _maxBlocksBack, UniswapOracle.ProofData memory _proofData*/) external virtual onlyControllingAddress whenNotPaused returns (uint256){
        //(price, blockNumber) = getPrice(_exchange, _denominationToken, _minBlocksBack, _maxBlocksBack, _proofData);
        //emit ReceivedPrice(_exchange, _denominationToken, _minBlocksBack, _maxBlocksBack, price, blockNumber);
        //return price;
    }
}