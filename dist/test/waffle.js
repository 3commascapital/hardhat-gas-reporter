"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_names_1 = require("hardhat/builtin-tasks/task-names");
const helpers_1 = require("./helpers");
describe("Waffle plugin with signers", function () {
    (0, helpers_1.useEnvironment)(__dirname + "/hardhat-waffle-project");
    it("no options", async function () {
        await this.env.run(task_names_1.TASK_TEST, { testFiles: [] });
    });
});
//# sourceMappingURL=waffle.js.map