// Live Lichess rating. Fetched fresh on every page load from Lichess's free public API
// (CORS-enabled, no key needed). Swap accounts by changing SITE.lichess in config.js.
(() => {
  const user = SITE.lichess;
  const bar = document.getElementById('rating-bar');
  if (!user || !bar) return;

  const PERFS = ['bullet', 'blitz', 'rapid'];
  const LABEL = { bullet: 'Bullet', blitz: 'Blitz', rapid: 'Rapid', classical: 'Classical' };
  const profileUrl = `https://lichess.org/@/${encodeURIComponent(user)}`;
  document.querySelectorAll('.lichess-link').forEach(a => (a.href = profileUrl));

  // Which time control gets the big number at the top of the page.
  // perfs looks like { bullet: { rating, games, prog, prov }, blitz: {...}, rapid: {...} }
  function pickHeadline(perfs) {
    // TODO(human): choose which rating to headline (return 'bullet', 'blitz' or 'rapid').
    return 'blitz';
  }

  function trend(prog) {
    if (!prog) return el('span', 'trend flat', '±0');
    return el('span', `trend ${prog > 0 ? 'up' : 'down'}`, `${prog > 0 ? '▲' : '▼'} ${Math.abs(prog)}`);
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  async function load() {
    const [userRes, statusRes] = await Promise.all([
      fetch(`https://lichess.org/api/user/${encodeURIComponent(user)}`),
      fetch(`https://lichess.org/api/users/status?ids=${encodeURIComponent(user)}`),
    ]);
    if (!userRes.ok) throw new Error(`Lichess returned ${userRes.status}`);
    const data = await userRes.json();
    const status = statusRes.ok ? (await statusRes.json())[0] : null;

    // Only show time controls with real (non-provisional) ratings.
    const perfs = Object.fromEntries(
      PERFS.filter(p => data.perfs?.[p] && !data.perfs[p].prov).map(p => [p, data.perfs[p]])
    );
    if (!Object.keys(perfs).length) throw new Error('No established ratings yet');

    const headKey = perfs[pickHeadline(perfs)] ? pickHeadline(perfs) : Object.keys(perfs)[0];
    const head = perfs[headKey];

    bar.replaceChildren();
    const main = el('a', 'rating-main lichess-link');
    main.href = profileUrl; main.target = '_blank'; main.rel = 'noopener';
    const live = el('span', 'live' + (status?.online ? ' online' : ''),
      status?.playing ? 'Playing now' : status?.online ? 'Online now' : 'Live rating');
    main.append(live);
    main.append(el('span', 'rating-num', String(head.rating)));
    main.append(el('span', 'rating-label', `Lichess ${LABEL[headKey]}`));
    main.append(trend(head.prog));
    bar.append(main);

    const chips = el('div', 'rating-chips');
    for (const [p, v] of Object.entries(perfs)) {
      if (p === headKey) continue;
      const chip = el('span', 'chip');
      chip.append(el('b', null, String(v.rating)), ` ${LABEL[p]} `, trend(v.prog));
      chips.append(chip);
    }
    const games = data.count?.rated;
    if (games) chips.append(el('span', 'chip', `${games.toLocaleString()} rated games`));
    bar.append(chips);

    const cta = el('a', 'rating-cta lichess-link', 'Check out my online rating →');
    cta.href = profileUrl; cta.target = '_blank'; cta.rel = 'noopener';
    bar.append(cta);

    // Show "Gary's rating" on each tier card that matches a time control.
    document.querySelectorAll('.tier[data-perf]').forEach(card => {
      const r = perfs[card.dataset.perf];
      if (r) card.querySelector('.tier-rating').textContent = `Gary's ${LABEL[card.dataset.perf].toLowerCase()}: ${r.rating}`;
    });
  }

  load().catch(() => {
    // Lichess down or rate-limited: fall back to a plain link instead of a broken widget.
    bar.replaceChildren();
    const a = el('a', 'rating-cta lichess-link', 'Check out my online rating →');
    a.href = profileUrl; a.target = '_blank'; a.rel = 'noopener';
    bar.append(a);
  });
})();
