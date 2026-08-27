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

    const id = saveArbitration(finalState);
    res.json({ id, ...finalState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Arbitration failed' });
  }
});

app.get('/api/v1/arbitrations', (req, res) => {
  try {
    const records = getArbitrations();
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fetch failed' });
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
