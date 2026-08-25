"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const graph_1 = require("./orchestration/graph");
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/api/v1/arbitrate', async (req, res) => {
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
        const id = (0, db_1.saveArbitration)(finalState);
        res.json({ id, ...finalState });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Arbitration failed' });
    }
});
app.get('/api/v1/arbitrations', (req, res) => {
    try {
        const records = (0, db_1.getArbitrations)();
        res.json(records);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fetch failed' });
    }
});
const PORT = process.env.PORT || 4000;
(0, db_1.initDb)().then(() => {
    app.listen(PORT, () => {
        console.log(`Arbitration API running on port ${PORT}`);
    });
});
