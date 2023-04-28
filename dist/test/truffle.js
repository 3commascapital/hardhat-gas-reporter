"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const helpers_1 = require("./helpers");
describe("Truffle plugin", function () {
    (0, helpers_1.useEnvironment)(__dirname + "/hardhat-truffle-project");
    it("default", async function () {
        await this.env.run(task_names_1.TASK_TEST, { testFiles: [] });
    });
});
//# sourceMappingURL=truffle.js.map