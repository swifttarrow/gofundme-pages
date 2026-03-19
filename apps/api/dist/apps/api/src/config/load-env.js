"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLocalEnv = loadLocalEnv;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function loadEnvFromFile(filePath) {
    if (!fs_1.default.existsSync(filePath))
        return;
    const content = fs_1.default.readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#"))
            continue;
        const equalsIndex = line.indexOf("=");
        if (equalsIndex <= 0)
            continue;
        const key = line.slice(0, equalsIndex).trim();
        let value = line.slice(equalsIndex + 1).trim();
        if (!key)
            continue;
        if (process.env[key] !== undefined)
            continue;
        if ((value.startsWith("\"") && value.endsWith("\"")) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        process.env[key] = value;
    }
}
function loadLocalEnv() {
    const rootDir = path_1.default.resolve(__dirname, "../../../../");
    // Prioritize local overrides when present.
    loadEnvFromFile(path_1.default.join(rootDir, ".env.local"));
    loadEnvFromFile(path_1.default.join(rootDir, ".env"));
}
