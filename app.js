// Renders the page from config.js and queue.js. No build step, no server.
(() => {
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // Header + footer
  $('site-name').textContent = SITE.name;
  document.querySelectorAll('.site-name').forEach(n => (n.textContent = SITE.name));
  $('tagline').textContent = SITE.tagline;
  document.querySelectorAll('.platforms').forEach(n => (n.textContent = SITE.platforms.join(' or ')));
  $('year').textContent = new Date().getFullYear();
  const contact = $('contact');
  contact.href = `mailto:${SITE.contactEmail}`;
  contact.textContent = SITE.contactEmail;
  for (const { label, url } of SITE.links.filter(l => l.url)) {
    const a = el('a', null, label);
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    $('links').append(a);
  }

  // Tier cards
  const tiersById = Object.fromEntries(TIERS.map(t => [t.id, t]));
  for (const t of TIERS) {
    const card = el('article', 'tier' + (t.featured ? ' featured' : '') + (t.premium ? ' premium' : ''));
    if (t.featured) card.append(el('span', 'badge', 'Most popular'));
    if (t.premium) card.append(el('span', 'badge', 'Get on the channel'));
    if (t.perf) card.dataset.perf = t.perf;
    card.append(el('h3', null, t.name));
    const price = el('p', 'price', `$${t.price}`);
    card.append(price);
    const meta = el('ul', 'meta');
    meta.append(el('li', null, t.format || `${t.games} game${t.games > 1 ? 's' : ''}`));
    meta.append(el('li', null, `${t.timeControl} time control`));
    meta.append(el('li', null, `~${t.minutes} min`));
    for (const perk of t.perks || []) meta.append(el('li', 'perk', perk));
    card.append(meta, el('p', 'blurb', t.blurb));
    if (t.perf) card.insertBefore(el('p', 'tier-rating'), meta);

    if (t.paymentLink) {
      const btn = el('a', 'btn', 'Book now');
      btn.href = t.paymentLink; btn.target = '_blank'; btn.rel = 'noopener';
      card.append(btn);
    } else {
      card.append(el('span', 'btn disabled', 'Opening soon'));
    }
    $('tiers').append(card);
  }

  // Queue + estimated wait for someone booking now
  const LABEL = { playing: 'Playing now', next: 'Up next', waiting: 'Waiting' };
  if (!QUEUE.length) {
    $('queue').append(el('li', 'empty', 'Queue is empty. Book now and you\'re first!'));
  }
  QUEUE.forEach((q, i) => {
    const li = el('li', `q ${q.status}`);
    li.append(el('span', 'pos', String(i + 1)));
    li.append(el('span', 'who', q.player));
    li.append(el('span', 'tier-name', tiersById[q.tier]?.name || q.tier));
    li.append(el('span', 'status', LABEL[q.status] || q.status));
    $('queue').append(li);
  });
  const waitMin = QUEUE.reduce((sum, q) => sum + (tiersById[q.tier]?.minutes || 15), 0);
  $('queue-wait').textContent = QUEUE.length
    ? `Book now and the estimated wait is about ${waitMin} minutes of play ahead of you.`
    : '';
})();
