"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const graph_1 = require("./orchestration/graph");
const db_1 = require("./db");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.post('/api/v1/arbitrate', async (req, res) => {
    try {
        const { originalPrompt, originalOutput } = req.body;
        if (!originalPrompt || !originalOutput) {
            return res.status(400).json({ error: 'Missing prompt or output' });
        }
        const workflow = (0, graph_1.buildArbitrationGraph)();
        const finalState = await workflow.invoke({
            originalPrompt,
            originalOutput
        });
        const id = await (0, db_1.saveArbitration)(finalState);
        res.json({ id, ...finalState });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Arbitration failed' });
    }
});
exports.app.get('/api/v1/arbitrations', async (req, res) => {
    try {
        const records = await (0, db_1.getArbitrations)();
        res.json(records);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fetch failed' });
    }
});
exports.app.post('/api/v1/benchmark', async (req, res) => {
    try {
        const { exec } = require('child_process');
        const path = require('path');
        // In a real app we'd trigger a background job or import runBenchmark
        // For now we just kick off the script and return
        exec(`node ${path.join(__dirname, 'benchmark.js')}`, (error, stdout, stderr) => {
            if (error)
                console.error("Benchmark error:", error);
            console.log("Benchmark output:", stdout);
        });
        res.json({ message: 'Benchmark started in background' });
    }
    catch (error) {
        res.status(500).json({ error: 'Benchmark failed to start' });
    }
});
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
    (0, db_1.initDb)().then(() => {
        exports.app.listen(PORT, () => {
            console.log(`Arbitration API running on port ${PORT}`);
        });
    });
}
