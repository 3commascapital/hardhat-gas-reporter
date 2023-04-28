"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-truffle5");
// We load the plugin here.
require("../../src/index");
const config = {
    solidity: {
        version: "0.5.5",
        settings: {
            optimizer: {
                enabled: true,
                runs: 100
            }
        }
    },
    networks: {
        development: {
            gas: 5000000,
            url: "http://localhost:8545"
        }
    },
    gasReporter: {
        showMethodSig: true,
        coinmarketcap: process.env.CMC_API_KEY
    }
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map