#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
//
// LexGrade Standard — Model Context Protocol server (stdio).
//
// Serves the open LexGrade Standard to Claude and other MCP clients: the rubric
// (principles + criteria), the Technique Register, the calibration set, and the
// machine-readable catalog. Reads everything locally (see lib.mjs) — no network,
// no account. A `score_motion` prompt wires the rubric into a scoring workflow.
//
// Run:  node index.mjs           (from the monorepo, or with LEXGRADE_DATA_ROOT set)
// Add:  claude mcp add lexgrade -- node /abs/path/packages/mcp/index.mjs

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import {
  catalogJson,
  getCriterion,
  getTechnique,
  listCriteria,
  listPrinciples,
  listTechniques,
  load,
  search,
} from './lib.mjs';

const PKG_VERSION = '1.0.0';

// Load once up front so a misconfigured data root fails fast (before stdio).
const data = load();

// Derive register counts from the parsed source — never hardcode them, so the
// tool descriptions can't drift from the actual Technique Register.
const TECH_COUNT = data.techniques.length;
const TECH_CATEGORIES = new Set(data.techniques.map((t) => t.category)).size;

const server = new McpServer({
  name: 'lexgrade-standard',
  version: PKG_VERSION,
});

const text = (value) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});

const notFound = (what) => ({
  content: [{ type: 'text', text: `Not found: ${what}` }],
  isError: true,
});

// ---------------------------------------------------------------------------
// Resources — the documents themselves, addressable by URI.
// ---------------------------------------------------------------------------

server.registerResource(
  'standard',
  'lexgrade://standard',
  {
    title: `LexGrade Standard v${data.version}`,
    description: 'The full human-readable LexGrade Standard (the source of truth).',
    mimeType: 'text/markdown',
  },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: data.standardMarkdown }] }),
);

server.registerResource(
  'technique-register',
  'lexgrade://technique-register',
  {
    title: 'LexGrade Technique Register',
    description: `The informative companion: ${TECH_COUNT} named advocacy techniques across ${TECH_CATEGORIES} categories.`,
    mimeType: 'text/markdown',
  },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: data.techniqueMarkdown }] }),
);

server.registerResource(
  'criteria',
  'lexgrade://criteria.json',
  {
    title: 'LexGrade criteria catalog (JSON)',
    description: 'Machine-readable catalog: principles, criteria, conformance levels, composite formula.',
    mimeType: 'application/json',
  },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(catalogJson(), null, 2) }] }),
);

server.registerResource(
  'calibration',
  'lexgrade://calibration',
  {
    title: 'LexGrade Calibration Set — scoring guide',
    description: 'How the A / B− / F exemplars are scored on identical facts (the discrimination proof).',
    mimeType: 'text/markdown',
  },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: data.scoringGuide || 'Calibration scoring guide not available.' }] }),
);

server.registerResource(
  'methodology',
  'lexgrade://methodology.json',
  {
    title: 'LexGrade methodology manifest',
    description: 'Current authoritative version of each artifact.',
    mimeType: 'application/json',
  },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(data.methodology, null, 2) }] }),
);

// ---------------------------------------------------------------------------
// Tools — structured queries an agent can call.
// ---------------------------------------------------------------------------

server.registerTool(
  'get_standard',
  {
    title: 'Get the full Standard',
    description: 'Return the complete human-readable LexGrade Standard markdown (the source of truth).',
    inputSchema: {},
  },
  async () => text(data.standardMarkdown),
);

server.registerTool(
  'list_principles',
  {
    title: 'List principles',
    description: 'List the eight LexGrade principles with their role (precondition / weighted / gate) and weight.',
    inputSchema: {},
  },
  async () => text(listPrinciples()),
);

server.registerTool(
  'list_criteria',
  {
    title: 'List criteria',
    description: 'List the scored criteria, optionally filtered to one principle (e.g. "P3"). Each has a stable id like "LGS 3.5".',
    inputSchema: { principle: z.string().optional().describe('Principle id to filter by, e.g. "P3". Omit for all criteria.') },
  },
  async ({ principle }) => text(listCriteria(principle)),
);

server.registerTool(
  'get_criterion',
  {
    title: 'Get one criterion',
    description: 'Get a single criterion by id. Accepts "LGS 3.5", "3.5", etc.',
    inputSchema: { id: z.string().describe('Criterion id, e.g. "LGS 3.5".') },
  },
  async ({ id }) => {
    const c = getCriterion(id);
    return c ? text(c) : notFound(`criterion "${id}"`);
  },
);

server.registerTool(
  'list_techniques',
  {
    title: 'List techniques',
    description: `List the ${TECH_COUNT} advocacy techniques (number, name, category, tier, one-line definition), optionally filtered by category.`,
    inputSchema: { category: z.string().optional().describe('Category to filter by, e.g. "Strategy". Omit for all.') },
  },
  async ({ category }) =>
    text(listTechniques(category).map(({ body, ...rest }) => rest)),
);

server.registerTool(
  'get_technique',
  {
    title: 'Get one technique',
    description: 'Get a single technique (full body) by slug or number, e.g. "unrebutted-absence" or "8".',
    inputSchema: { id: z.string().describe('Technique slug or number.') },
  },
  async ({ id }) => {
    const t = getTechnique(id);
    return t ? text(t) : notFound(`technique "${id}"`);
  },
);

server.registerTool(
  'get_scoring',
  {
    title: 'Get scoring rules',
    description: 'Return the composite formula, weights, conformance levels, grade scale, and automatic-demotion rules — everything needed to score a motion.',
    inputSchema: {},
  },
  async () => {
    const c = catalogJson();
    return text({
      composite: c.composite,
      conformance_levels: c.conformance_levels,
      conformance_claim: c.conformance_claim,
      automatic_demotion_rules: c.automatic_demotion_rules,
    });
  },
);

server.registerTool(
  'search',
  {
    title: 'Search the Standard',
    description: 'Case-insensitive keyword search across criteria and techniques.',
    inputSchema: { query: z.string().describe('Search term, e.g. "adverse authority".') },
  },
  async ({ query }) => text(search(query)),
);

// ---------------------------------------------------------------------------
// Prompt — wire the rubric into a concrete scoring workflow.
// ---------------------------------------------------------------------------

server.registerPrompt(
  'score_motion',
  {
    title: 'Score a motion against the LexGrade Standard',
    description: 'Produce a LexGrade assessment of a legal motion: per-principle grades, composite score, and conformance level.',
    argsSchema: { motion_text: z.string().describe('The full text of the motion / memorandum of law to assess.') },
  },
  ({ motion_text }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text:
            `You are assessing a legal motion against the LexGrade Standard v${data.version} ` +
            `(${data.catalog.scope}).\n\n` +
            'Use the MCP resources/tools on this server to ground every judgment: read ' +
            '`lexgrade://standard` for the rubric, call `list_criteria` / `get_criterion` for the ' +
            'scored criteria, and `get_scoring` for the composite formula, conformance levels, and ' +
            'automatic-demotion rules.\n\n' +
            'Produce:\n' +
            '1. A grade (0–100) for each scored principle (P2,P3,P4,P5,P6,P8) with a one-line justification tied to specific LGS criteria.\n' +
            '2. The P7 candor gate result and any deductions.\n' +
            '3. The composite score computed by the documented order of operations, and the resulting conformance level (Expert / Competent / Deficient).\n' +
            '4. The single strongest ground on which a court could deny the motion.\n\n' +
            '--- MOTION TEXT ---\n' +
            motion_text,
        },
      },
    ],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`LexGrade Standard MCP server v${PKG_VERSION} ready (standard v${data.version}, data root: ${data.root}).`);
