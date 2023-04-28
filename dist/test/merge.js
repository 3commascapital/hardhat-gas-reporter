"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const task_names_1 = require("../src/task-names");
// tslint:disable-next-line no-implicit-dependencies
const chai_1 = require("chai");
const helpers_1 = require("./helpers");
const loadJsonFile = (filepath) => JSON.parse(fs_1.default.readFileSync(filepath, "utf-8"));
describe("Merge gasRerpoterOutput.json files task", function () {
    const projectPath = path_1.default.resolve(__dirname, "hardhat-merge-project");
    (0, helpers_1.useEnvironment)(projectPath);
    it("should merge gas reporter output files", async function () {
        const expected = loadJsonFile(path_1.default.resolve(projectPath, "gasReporterOutput.expected.json"));
        await this.env.run(task_names_1.TASK_GAS_REPORTER_MERGE, {
            input: ["gasReporterOutput-*.json"]
        });
        const result = loadJsonFile(path_1.default.resolve(projectPath, "gasReporterOutput.json"));
        chai_1.assert.deepEqual(result, expected);
    });
});
//# sourceMappingURL=merge.js.map