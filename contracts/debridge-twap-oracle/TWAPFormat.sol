// SPDX-License-Identifier: MIT
pragma solidity 0.6.8;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";

contract TWAPTest {

    event tickCalc(int24 tick);
    function test() external {
        address pool = 0xA374094527e1673A86dE625aa59517c5dE346d32;
        uint32[] memory secondsAgo = new uint32[](2);
        secondsAgo[0] = 600;
        secondsAgo[1] = 0;
        (int56[] memory tickCumulatives, ) = IUniswapV3Pool(pool).observe(secondsAgo);
        int24 tick = int24((tickCumulatives[1] - tickCumulatives[0]) / secondsAgo[0]);
        emit tickCalc(tick);
    }
}