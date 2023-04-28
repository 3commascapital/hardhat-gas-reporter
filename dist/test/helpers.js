"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnvironment = void 0;
const plugins_testing_1 = require("hardhat/plugins-testing");
function useEnvironment(projectPath, networkName) {
    let previousCWD;
    beforeEach("Loading hardhat environment", function () {
        process.chdir(projectPath);
        if (networkName !== undefined) {
            process.env.HARDHAT_NETWORK = networkName;
        }
        this.env = require("hardhat");
    });
    afterEach("Resetting hardhat", function () {
        (0, plugins_testing_1.resetHardhatContext)();
    });
}
exports.useEnvironment = useEnvironment;
//# sourceMappingURL=helpers.js.map