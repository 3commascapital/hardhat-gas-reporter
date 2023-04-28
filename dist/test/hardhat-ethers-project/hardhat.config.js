"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-ethers");
require("../../src/index");
const config = {
    solidity: "0.5.8",
    gasReporter: {
        coinmarketcap: process.env.CMC_API_KEY
    }
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map