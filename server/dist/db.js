"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArbitrations = exports.saveArbitration = exports.initDb = void 0;
const sql_js_1 = __importDefault(require("sql.js"));
let db = null;
async function initDb() {
    if (db)
        return db;
    const SQL = await (0, sql_js_1.default)();
    db = new SQL.Database();
    db.run(`
    CREATE TABLE IF NOT EXISTS arbitrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_prompt TEXT,
      original_output TEXT,
      accuracy_critique TEXT,
      logic_critique TEXT,
      completeness_critique TEXT,
      disagreements TEXT,
      final_verdict TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    return db;
}
exports.initDb = initDb;
function saveArbitration(state) {
    if (!db)
        throw new Error("DB not initialized");
    const stmt = db.prepare(`
    INSERT INTO arbitrations (
      original_prompt, original_output, accuracy_critique, logic_critique, completeness_critique, disagreements, final_verdict
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    stmt.run([
        state.originalPrompt,
        state.originalOutput,
        JSON.stringify(state.accuracyCritique),
        JSON.stringify(state.logicCritique),
        JSON.stringify(state.completenessCritique),
        JSON.stringify(state.disagreements),
        JSON.stringify(state.finalVerdict)
    ]);
    stmt.free();
    const res = db.exec("SELECT last_insert_rowid() as id");
    return res[0].values[0][0];
}
exports.saveArbitration = saveArbitration;
function getArbitrations() {
    if (!db)
        return [];
    const res = db.exec("SELECT * FROM arbitrations ORDER BY created_at DESC");
    if (res.length === 0)
        return [];
    const columns = res[0].columns;
    return res[0].values.map((row) => {
        const obj = {};
        columns.forEach((col, i) => {
            try {
                obj[col] = JSON.parse(row[i]);
            }
            catch {
                obj[col] = row[i];
            }
        });
        return obj;
    });
}
exports.getArbitrations = getArbitrations;
