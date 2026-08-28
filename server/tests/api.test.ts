import request from 'supertest';
import { app } from '../src/index';
import { initDb } from '../src/db';

jest.mock("pg", () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1, original_prompt: "test", original_output: "test out", created_at: new Date() }] }),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('@langchain/openai', () => {
    return {
        ChatOpenAI: jest.fn().mockImplementation(() => {
            return {
                withStructuredOutput: jest.fn().mockReturnThis(),
                invoke: jest.fn().mockResolvedValue({
                    score: 9, confidence: "High", issues: [], summary: "Summary"
                })
            };
        })
    };
});

describe('API Tests', () => {
    beforeAll(async () => {
        await initDb();
    });

    it('should POST /api/v1/arbitrate successfully', async () => {
        const res = await request(app).post('/api/v1/arbitrate').send({
            originalPrompt: "test",
            originalOutput: "test out"
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBeDefined();
    });

    it('should POST /api/v1/arbitrate with missing data', async () => {
        const res = await request(app).post('/api/v1/arbitrate').send({});
        expect(res.statusCode).toEqual(400);
    });

    it('should GET /api/v1/arbitrations', async () => {
        const res = await request(app).get('/api/v1/arbitrations');
        expect(res.statusCode).toEqual(200);
    });
    
    it('should handle POST /api/v1/arbitrate error', async () => {
        // Force an error
        jest.spyOn(require('../src/orchestration/graph'), 'buildArbitrationGraph').mockImplementationOnce(() => {
            throw new Error("graph failed");
        });
        const res = await request(app).post('/api/v1/arbitrate').send({
            originalPrompt: "test",
            originalOutput: "test out"
        });
        expect(res.statusCode).toEqual(500);
    });
    
    it('should handle GET /api/v1/arbitrations error', async () => {
        jest.spyOn(require('../src/db'), 'getArbitrations').mockImplementationOnce(() => {
            throw new Error("db failed");
        });
        const res = await request(app).get('/api/v1/arbitrations');
        expect(res.statusCode).toEqual(500);
    });
});
