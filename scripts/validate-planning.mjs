import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerPath = path.join(root, 'docs/delivery/backlog.json');
const statuses = new Set(['todo', 'in_progress', 'blocked', 'in_review', 'done']);
const requirements = new Set(['CUS-01', 'CUS-02', 'CUS-03', 'CUS-04', 'DRV-01', 'DRV-02', 'ADM-01', 'ADM-02', 'ADM-03']);

export function validatePlanning(data, repositoryRoot = root) {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const localFile = (relative) => {
    if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) return false;
    const resolved = path.resolve(repositoryRoot, relative);
    const inside = path.relative(repositoryRoot, resolved);
    return inside !== '..' && !inside.startsWith(`..${path.sep}`)
      && !path.isAbsolute(inside) && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
  };
  check(data.schema_version === 1, 'Unsupported schema_version');
  if (!Array.isArray(data.tasks) || !Array.isArray(data.decision_register)) {
    return [...errors, 'tasks and decision_register must be arrays'];
  }
  const taskMap = new Map(data.tasks.map(t => [t.id, t]));
  const decisionMap = new Map(data.decision_register.map(d => [d.id, d]));
  check(taskMap.size === data.tasks.length, 'Duplicate task IDs');
  check(decisionMap.size === data.decision_register.length, 'Duplicate decision IDs');
  for (const decision of data.decision_register) {
    check(/^DEC-\d{2}$/.test(decision.id), `Invalid decision ID: ${decision.id}`);
    check(['proposed', 'approved', 'superseded'].includes(decision.status), `${decision.id}: invalid decision status`);
    if (decision.status === 'approved') {
      check(localFile(decision.adr), `${decision.id}: approved decision requires an existing repository ADR`);
      if (localFile(decision.adr)) {
        const adr = fs.readFileSync(path.resolve(repositoryRoot, decision.adr), 'utf8');
        check(/^Status:\s*approved\s*$/mi.test(adr), `${decision.id}: ADR must say Status: approved`);
        for (const label of ['Decider', 'Approval date', 'Approval source']) {
          check(new RegExp(`^${label}:\\s*\\S[^\\r\\n]*$`, 'mi').test(adr), `${decision.id}: ADR missing ${label}`);
        }
      }
    }
  }
  let active = 0;
  const covered = new Set();
  const phases = new Set();
  for (const task of data.tasks) {
    const id = task.id;
    check(/^TASK-\d{3}$/.test(id), `Invalid task ID: ${id}`);
    check(typeof task.title === 'string' && task.title.trim().length > 0, `${id}: missing title`);
    check(statuses.has(task.status), `${id}: invalid status`);
    check(/^S0[1-7]$/.test(task.sprint), `${id}: invalid sprint`);
    if (/^S0[1-7]$/.test(task.sprint)) {
      check(localFile(`docs/delivery/sprints/sprint-${task.sprint.slice(1)}.md`), `${id}: missing sprint brief`);
    }
    for (const field of ['prd_ids', 'plan_phases', 'depends_on', 'decision_gates', 'target_paths', 'acceptance', 'validation']) {
      check(Array.isArray(task[field]), `${id}: ${field} must be an array`);
    }
    for (const field of ['target_paths', 'acceptance', 'validation']) {
      check(Array.isArray(task[field]) && task[field].length > 0
        && task[field].every(v => typeof v === 'string' && v.trim()), `${id}: ${field} must contain nonempty text`);
    }
    for (const req of task.prd_ids ?? []) {
      check(requirements.has(req), `${id}: unknown requirement ${req}`); covered.add(req);
    }
    for (const phase of task.plan_phases ?? []) {
      check(Number.isInteger(phase) && phase >= 0 && phase <= 12, `${id}: invalid plan phase ${phase}`); phases.add(phase);
    }
    for (const dep of task.depends_on ?? []) check(taskMap.has(dep) && dep !== id, `${id}: invalid dependency ${dep}`);
    for (const gate of task.decision_gates ?? []) check(decisionMap.has(gate), `${id}: unknown decision gate ${gate}`);
    if (task.status === 'in_progress') active++;
    if (['in_progress', 'in_review', 'done'].includes(task.status)) {
      check(typeof task.owner === 'string' && task.owner.trim(), `${id}: active/reviewed task needs owner`);
      for (const dep of task.depends_on ?? []) check(taskMap.get(dep)?.status === 'done', `${id}: unfinished dependency ${dep}`);
      for (const gate of task.decision_gates ?? []) check(decisionMap.get(gate)?.status === 'approved', `${id}: unapproved gate ${gate}`);
    }
    if (task.status === 'blocked') check(typeof task.blocker === 'string' && task.blocker.trim(), `${id}: blocked task needs reason`);
    if (['in_review', 'done'].includes(task.status)) check(localFile(task.evidence), `${id}: review/done requires an existing evidence file`);
  }
  check(active <= 1, 'Only one task may be in_progress');
  for (const req of requirements) check(covered.has(req), `Unmapped requirement ${req}`);
  for (let phase = 0; phase <= 12; phase++) check(phases.has(phase), `Unmapped implementation phase ${phase}`);
  const visiting = new Set(), visited = new Set();
  function visit(id) {
    if (visiting.has(id)) { errors.push(`Dependency cycle involving ${id}`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of taskMap.get(id)?.depends_on ?? []) if (taskMap.has(dep)) visit(dep);
    visiting.delete(id); visited.add(id);
  }
  for (const id of taskMap.keys()) visit(id);
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const data = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    const errors = validatePlanning(data);
    if (errors.length) {
      console.error(errors.join('\n')); process.exitCode = 1;
    } else {
      const ready = data.tasks.filter(t => t.status === 'todo'
        && t.depends_on.every(id => data.tasks.find(d => d.id === id)?.status === 'done')
        && t.decision_gates.every(id => data.decision_register.find(d => d.id === id)?.status === 'approved'));
      console.log(`Planning valid: ${data.tasks.length} tasks; ${data.decision_register.length} decisions; 9 PRD requirements; phases 0-12.`);
      console.log(`Ready after implementation authorization: ${ready.map(t => t.id).join(', ') || 'none'}`);
      console.log('This validates planning consistency, not approval authenticity, application behavior or completion evidence quality.');
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
