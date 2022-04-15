const { expect, assert } = require("chai");
const { ethers, upgrades } = require("hardhat");

const deBridgeValidator = "0x4bc16662a2ce381e7bb54dc577c05619c5e67526";

describe("TWAPOracle", function () {
  before(async function () {
    this.OracleFactory = await ethers.getContractFactory('TWAPOracle');
  });

  beforeEach(async function () {
    const TWAPOracle = await upgrades.deployProxy(this.OracleFactory, [deBridgeValidator]);
    await TWAPOracle.deployed();
    this.TWAPOracle = TWAPOracle;
    console.log("proxy deployed to:", TWAPOracle.address);
  });

  it("Is the right version", async function () {
  	const version = await this.TWAPOracle.version();
  	expect(version).to.equal("101")
  });

  it("Is correctly initialized", async function () {
  	const deBridgeGate = await this.TWAPOracle.deBridgeGate()
  	expect(deBridgeGate.toLowerCase()).to.equal(deBridgeValidator)
  })

  it("requests TWAP on main chain", async function(){
  	const uniswapPool = "0x4bc16662a2ce381e7bb54dc577c05619c5e67526";
  	const TWAPDuration = 256;
  	const chainIdTo = 56;
  	const fallbackAddress = "0x4bc16662a2ce381e7bb54dc577c05619c5e67526";
  	const executionFee = 1000;
    try {
	  	const TWAPReq = await this.TWAPOracle.getV3TWAP(uniswapPool,
	  		TWAPDuration,
	  		chainIdTo,
	  		fallbackAddress,
	  		executionFee
	  	);
	  	console.log("twap request ", TWAPReq)
    } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "Tx reverted"
        );
    }
  })

  it("allow debridge oracle to return price cross chain", async function(){
  	const uniswapPool = "0x4bc16662a2ce381e7bb54dc577c05619c5e67526"
  	const price = 1000;
    try {
	  	const TWAPRes = await this.TWAPOracle.onBridgedMessage(uniswapPool, price);
	  	console.log("twap result ", TWAPReq);
	  	expect(price).to.equal(TWAPRes);
    } catch (err) {
        assert(
          err.message.indexOf("revert") >= 0,
          "Tx reverted"
        );
    }
  })

});