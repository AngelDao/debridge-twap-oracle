// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "hardhat/console.sol";
import "./BridgeAppBase.sol";
import "./forkedInterfaces/IDeBridgeGate.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
// import "@uniswap/v3-core/contracts/libraries/TickMath.sol";

contract TWAPOracle is BridgeAppBase {

    using Flags for uint256;

    event SentPrice(IUniswapV3Pool _pool, uint32 _twapDuration, int24 price, uint256 blockNumber);
    event ReceivedPrice(IUniswapV3Pool _pool, int24 price, uint256 blockNumber);

    function initialize(IDeBridgeGate _deBridgeGate) external initializer {
        __BridgeAppBase_init(_deBridgeGate);
    }

    function getV3TWAP(
        IUniswapV3Pool _pool,
        uint32 _twapDuration,
        uint256 _chainIdTo,
        address _fallback,
        uint256 _executionFee
    ) external virtual payable whenNotPaused {

        uint32[] memory secondsAgo = new uint32[](2);
        secondsAgo[0] = _twapDuration;
        secondsAgo[1] = 0;
        (int56[] memory tickCumulatives, ) = _pool.observe(secondsAgo);
        int24 price = int24((tickCumulatives[1] - tickCumulatives[0]) / int56(uint56(_twapDuration)));
        emit SentPrice(_pool, _twapDuration, price, block.number);

        IDeBridgeGate.SubmissionAutoParamsTo memory autoParams;
        autoParams.flags = autoParams.flags.setFlag(Flags.REVERT_IF_EXTERNAL_FAIL, true);
        autoParams.flags = autoParams.flags.setFlag(Flags.PROXY_WITH_SENDER, true);
        autoParams.executionFee = _executionFee;
        autoParams.fallbackAddress = abi.encodePacked(_fallback);
        autoParams.data = abi.encodeWithSignature("onBridgedMessage(address _pool, uint256 _price)", _pool, price);

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

    function onBridgedMessage(
        IUniswapV3Pool _pool,
        int24 _price
    ) external virtual onlyControllingAddress whenNotPaused returns (int24){
        emit ReceivedPrice(_pool, _price, block.number);
        return _price;
    }
}