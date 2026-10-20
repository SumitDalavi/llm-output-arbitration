const request = require('supertest');
const { app } = require('../src/index');

describe('Health and PCL Mode', () => {
  it('returns health status with mode report', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.mode).toBeDefined();
    expect(res.body.mode.openai).toBe('mock');
  });
});
