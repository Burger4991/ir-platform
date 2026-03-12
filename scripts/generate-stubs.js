#!/usr/bin/env node
// Run from ir-platform root: node scripts/generate-stubs.js
// Generates stub index.html + data.js for all coming-soon units.

const fs = require('fs');
const path = require('path');

// Read registry (strip window.UNITS_REGISTRY = assignment)
const registrySource = fs.readFileSync('units-registry.js', 'utf8');
const registryJSON = registrySource
  .replace(/^window\.UNITS_REGISTRY\s*=\s*/, '')
  .replace(/;\s*$/, '');
const registry = eval('(' + registryJSON + ')'); // safe: local file

// Read alicogia index.html as shell template
const shellTemplate = fs.readFileSync('units/alicogia/index.html', 'utf8');

const stubs = registry.filter(u => u.status === 'coming-soon');
console.log(`Generating ${stubs.length} stub units...`);

stubs.forEach(unit => {
  const dir = path.join('units', unit.id);
  fs.mkdirSync(dir, { recursive: true });

  // ── index.html ──
  const html = shellTemplate
    .replace(/<title>Ali Cogia.*?<\/title>/, `<title>${unit.title} · IR Platform</title>`);
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  // ── data.js ──
  const days = unit.days || 6;
  const daysObj = Array.from({ length: days }, (_, i) => i + 1)
    .map(d => `    ${d}: { label: 'Day ${d}', progressItems: [], pacingGuide: {}, exitTicket: null, engageActivities: [] }`)
    .join(',\n');

  const dataJs = `const UNIT = {
  meta: {
    id: ${JSON.stringify(unit.id)},
    title: ${JSON.stringify(unit.title)},
    benchmark: ${JSON.stringify(unit.benchmark)},
    benchmarkLabel: ${JSON.stringify(unit.benchmarkLabel)},
    benchmarkDescription: '',
    days: ${days},
    status: 'coming-soon'
  },
  days: {
${daysObj}
  },
  assessment: {
    achievementLevels: []
  },
  downloads: []
};

if (typeof module !== 'undefined') module.exports = UNIT;
`;
  fs.writeFileSync(path.join(dir, 'data.js'), dataJs);

  console.log(`  ✓ units/${unit.id}/`);
});

console.log(`Done. ${stubs.length} stubs generated.`);
