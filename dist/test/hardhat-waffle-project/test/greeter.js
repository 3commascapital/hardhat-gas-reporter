"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
// tslint:disable-next-line no-implicit-dependencies
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("Greeter contract", function () {
    let Greeter;
    let greeter1;
    let owner, addr1;
    beforeEach(async function () {
        [owner, addr1] = await hardhat_1.waffle.provider.getWallets();
        Greeter = await hardhat_1.ethers.getContractFactory("Greeter");
        greeter1 = await Greeter.deploy("Hi");
    });
    it("Should shoud be deployable with different greetings", async function () {
        chai_1.assert.equal(await greeter1.greeting(), "Hi");
        const greeter2 = await Greeter.deploy("Hola");
        chai_1.assert.equal(await greeter2.greeting(), "Hola");
    });
    it("Should return the greeting when greet is called", async function () {
        chai_1.assert.equal(await greeter1.greet(), "Hi");
    });
    it("Should set a greeting", async function () {
        await greeter1.connect(addr1).setGreeting('ciao');
        chai_1.assert.equal(await greeter1.greet(), "ciao");
    });
    it("should revert with a message", async function () {
        await (0, chai_1.expect)(greeter1.connect(addr1).throwAnError('throwing...')).to.be.revertedWith('throwing...');
    });
});
//# sourceMappingURL=greeter.js.map