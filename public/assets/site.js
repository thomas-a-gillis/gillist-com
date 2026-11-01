'use strict';
(() => {
  const captions = {
    ai: 'Useful capability starts with the right problem.',
    risk: 'Every technical decision sits inside a larger system.',
    labs: 'Test the behavior. Question the interpretation.'
  };
  const briefs = {
    ai: { title: 'Start with the work, then choose the model.', steps: [
      ['Frame', 'Choose one repeatable workflow and define the outcome worth improving.'],
      ['Investigate', 'Compare the current process, a simpler automation, and an AI-assisted approach on the same representative tasks.'],
      ['Challenge', 'Identify failure costs, sensitive information, and the points that require human review.'],
      ['Decide', 'Run a bounded pilot. Continue only if quality, time saved, and operating costs justify it.']
    ] },
    risk: { title: 'Map the dependencies, then test the assumptions.', steps: [
      ['Frame', 'Name the decision, its time horizon, and what would make it difficult to reverse.'],
      ['Investigate', 'Map suppliers, institutions, incentives, and policy dependencies. Separate observed facts from interpretations.'],
      ['Challenge', 'Build plausible alternative scenarios. Identify the assumptions that fail first in each one.'],
      ['Decide', 'Choose an action that remains useful across scenarios. Define observable triggers for revisiting it.']
    ] },
    labs: { title: 'Trust is a test plan, not a model property.', steps: [
      ['Frame', 'Specify the task and the consequences of a plausible but incorrect answer.'],
      ['Investigate', 'Build representative test cases with known answers. Record model versions, prompts, and evaluation criteria.'],
      ['Challenge', 'Test ambiguity, misleading context, adversarial instructions, and confident errors. Repeat to observe variation.'],
      ['Decide', 'Define where the model may assist, where a human must verify, and which failures rule out deployment.']
    ] }
  };
  let currentBrief = 'ai';
  function select(group, key, attribute) {
    document.querySelectorAll(group).forEach(button => button.setAttribute('aria-pressed', String(button.dataset[attribute] === key)));
  }
  function setFocus(key) {
    select('[data-focus]', key, 'focus');
    document.querySelectorAll('[data-map]').forEach(point => point.classList.toggle('active', point.dataset.map === key));
    document.getElementById('signal-caption').textContent = captions[key];
  }
  document.querySelectorAll('[data-focus]').forEach(button => button.addEventListener('click', () => setFocus(button.dataset.focus)));
  document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => {
    currentBrief = button.dataset.scenario;
    select('[data-scenario]', currentBrief, 'scenario');
    setFocus(currentBrief);
    const brief = briefs[currentBrief];
    const output = document.getElementById('brief');
    output.replaceChildren();
    const heading = document.createElement('h3');
    heading.textContent = brief.title;
    output.append(heading);
    const list = document.createElement('dl');
    brief.steps.forEach(([label, description]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const definition = document.createElement('dd');
      term.textContent = label;
      definition.textContent = description;
      row.append(term, definition);
      list.append(row);
    });
    output.append(list);
    document.getElementById('copy-status').textContent = '';
  }));
  const motion = document.querySelector('.motion-control');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function setMotion(paused) {
    document.querySelector('.signal').classList.toggle('motion-paused', paused);
    document.querySelector('.signal').classList.toggle('motion-enabled', !paused);
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? 'Resume motion' : 'Pause motion';
  }
  setMotion(prefersReduced.matches);
  motion.addEventListener('click', () => setMotion(motion.getAttribute('aria-pressed') !== 'true'));
  document.getElementById('copy-brief').addEventListener('click', async () => {
    const brief = briefs[currentBrief];
    const value = brief.title + '\n\n' + brief.steps.map(([label, description]) => label + ': ' + description).join('\n\n');
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = 'Brief copied.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('brief'));
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Brief selected. Use your browser’s Copy command.';
    }
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
