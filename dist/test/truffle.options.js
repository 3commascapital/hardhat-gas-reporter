"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const helpers_1 = require("./helpers");
// A place to test options
describe("Truffle plugin: gasReporter", function () {
    (0, helpers_1.useEnvironment)(__dirname + "/hardhat-truffle-project");
    it("gasReporter options", async function () {
        // Expect everything in the EtherRouter folder to be missing from report
        this.env.config.gasReporter.excludeContracts = ['EtherRouter/'];
        await this.env.run(task_names_1.TASK_TEST, { testFiles: [] });
    });
});
//# sourceMappingURL=truffle.options.js.map