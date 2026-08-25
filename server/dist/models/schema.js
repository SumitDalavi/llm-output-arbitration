"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerdictSchema = exports.CritiqueSchema = exports.IssueSchema = void 0;
const zod_1 = require("zod");
exports.IssueSchema = zod_1.z.object({
    quote: zod_1.z.string(),
    description: zod_1.z.string(),
    severity: zod_1.z.number().min(1).max(5)
});
exports.CritiqueSchema = zod_1.z.object({
    dimension: zod_1.z.enum(["accuracy", "logic", "completeness"]),
    score: zod_1.z.number().min(1).max(5),
    issues: zod_1.z.array(exports.IssueSchema),
    confidence: zod_1.z.number().min(0).max(1)
});
exports.VerdictSchema = zod_1.z.object({
    overallScore: zod_1.z.number().min(1).max(10),
    confidenceLevel: zod_1.z.number().min(0).max(1),
    confirmedIssues: zod_1.z.array(exports.IssueSchema),
    dismissedFlags: zod_1.z.array(zod_1.z.object({
        quote: zod_1.z.string(),
        description: zod_1.z.string(),
        reasoning: zod_1.z.string()
    })),
    summary: zod_1.z.string()
});
