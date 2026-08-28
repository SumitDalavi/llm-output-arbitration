import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { buildArbitrationGraph } from './orchestration/graph';
import { initDb, saveArbitration, getArbitrations } from './db';

export const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/v1/arbitrate', async (req, res) => {
  try {
    const { originalPrompt, originalOutput } = req.body;
    if (!originalPrompt || !originalOutput) {
      return res.status(400).json({ error: 'Missing prompt or output' });
    }

    const workflow = buildArbitrationGraph();
    const finalState = await workflow.invoke({
      originalPrompt,
      originalOutput
    });

    const id = await saveArbitration(finalState);
    res.json({ id, ...finalState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Arbitration failed' });
  }
});

app.get('/api/v1/arbitrations', async (req, res) => {
  try {
    const records = await getArbitrations();
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

app.post('/api/v1/benchmark', async (req, res) => {
  try {
    const { exec } = require('child_process');
    const path = require('path');
    
    // In a real app we'd trigger a background job or import runBenchmark
    // For now we just kick off the script and return
    exec(`node ${path.join(__dirname, 'benchmark.js')}`, (error: any, stdout: any, stderr: any) => {
      if (error) console.error("Benchmark error:", error);
      console.log("Benchmark output:", stdout);
    });
    
    res.json({ message: 'Benchmark started in background' });
  } catch (error) {
    res.status(500).json({ error: 'Benchmark failed to start' });
  }
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Arbitration API running on port ${PORT}`);
    });
  });
}
