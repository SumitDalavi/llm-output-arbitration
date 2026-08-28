"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArbitrations = exports.saveArbitration = exports.initDb = void 0;
const pg_1 = require("pg");
let db = null;
async function initDb() {
    if (db)
        return db;
    db = new pg_1.Pool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'arbitration',
        port: parseInt(process.env.DB_PORT || '5432'),
    });
    await db.query(`
    CREATE TABLE IF NOT EXISTS arbitrations (
      id SERIAL PRIMARY KEY,
      original_prompt TEXT,
      original_output TEXT,
      accuracy_critique TEXT,
      logic_critique TEXT,
      completeness_critique TEXT,
      disagreements TEXT,
      final_verdict TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    return db;
}
exports.initDb = initDb;
async function saveArbitration(state) {
    if (!db)
        throw new Error("DB not initialized");
    const res = await db.query(`
    INSERT INTO arbitrations (
      original_prompt, original_output, accuracy_critique, logic_critique, completeness_critique, disagreements, final_verdict
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
  `, [
        state.originalPrompt,
        state.originalOutput,
        JSON.stringify(state.accuracyCritique),
        JSON.stringify(state.logicCritique),
        JSON.stringify(state.completenessCritique),
        JSON.stringify(state.disagreements),
        JSON.stringify(state.finalVerdict)
    ]);
    return res.rows[0].id;
}
exports.saveArbitration = saveArbitration;
async function getArbitrations() {
    if (!db)
        return [];
    const res = await db.query("SELECT * FROM arbitrations ORDER BY created_at DESC");
    return res.rows.map((row) => {
        const obj = {};
        for (const key of Object.keys(row)) {
            try {
                if (typeof row[key] === 'string' && (row[key].startsWith('{') || row[key].startsWith('['))) {
                    obj[key] = JSON.parse(row[key]);
                }
                else {
                    obj[key] = row[key];
                }
            }
            catch {
                obj[key] = row[key];
            }
        }
        return obj;
    });
}
exports.getArbitrations = getArbitrations;
