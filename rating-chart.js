// 30-day rating chart, built from Gary's own rated games (each game records the
// rating before + the change), because Lichess's rating-history endpoint comes back
// empty for this account. One line, daily closing rating, crosshair tooltip, table view.
(() => {
  const user = SITE.lichess;
  const perf = SITE.chartPerf || 'rapid';
  const root = document.getElementById('rating-chart');
  if (!user || !root) return;

  const LABEL = { bullet: 'Bullet', blitz: 'Blitz', rapid: 'Rapid', classical: 'Classical' };
  const plot = root.querySelector('.chart-plot');
  const stats = root.querySelector('.chart-stats');
  const tableBody = root.querySelector('tbody');
  const note = root.querySelector('.chart-note');
  root.querySelector('.chart-title').textContent = `My Lichess ${LABEL[perf]} rating · last 30 days`;
  const NS = 'http://www.w3.org/2000/svg';
  const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

  function svg(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.append(n);
    return n;
  }

  async function load() {
    const since = Date.now() - 30 * 864e5;
    const url = `https://lichess.org/api/games/user/${encodeURIComponent(user)}`
      + `?since=${since}&perfType=${perf}&rated=true&moves=false&max=600`;
    const r = await fetch(url, { headers: { Accept: 'application/x-ndjson' } });
    if (!r.ok) throw new Error(r.status);
    const me = user.toLowerCase();
    const games = (await r.text()).split('\n').filter(Boolean).map(l => JSON.parse(l))
      .map(g => {
        const p = g.players.white.user?.id === me ? g.players.white : g.players.black;
        return { t: g.lastMoveAt || g.createdAt, start: g.createdAt, before: p.rating, after: p.rating + (p.ratingDiff || 0) };
      })
      .filter(g => Number.isFinite(g.after))
      .sort((a, b) => a.t - b.t);
    return games;
  }

  // Collapse games into one closing rating per calendar day.
  function daily(games) {
    const days = new Map();
    for (const g of games) {
      const d = new Date(g.t); d.setHours(0, 0, 0, 0);
      const k = d.getTime();
      const cur = days.get(k) || { t: k, games: 0 };
      cur.rating = g.after; cur.games++;
      days.set(k, cur);
    }
    return [...days.values()];
  }

  function niceStep(span) {
    for (const s of [5, 10, 20, 25, 50, 100]) if (span / s <= 5) return s;
    return 200;
  }

  function render(points, games) {
    plot.replaceChildren();
    const W = Math.max(280, plot.clientWidth), H = 240;
    const m = { l: 44, r: 52, t: 14, b: 28 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const vals = points.map(p => p.rating);
    let lo = Math.min(...vals), hi = Math.max(...vals);
    const step = niceStep(Math.max(hi - lo, 20));
    lo = Math.floor((lo - step / 2) / step) * step; hi = Math.ceil((hi + step / 2) / step) * step;
    const t0 = points[0].t, t1 = points[points.length - 1].t;
    const x = t => m.l + (t1 === t0 ? iw / 2 : ((t - t0) / (t1 - t0)) * iw);
    const y = v => m.t + ih - ((v - lo) / (hi - lo)) * ih;

    const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img',
      'aria-label': `${LABEL[perf]} rating over the last 30 days, from ${vals[0]} to ${vals[vals.length - 1]}`, tabindex: 0 }, plot);

    // Recessive grid + y ticks.
    for (let v = lo; v <= hi; v += step) {
      svg('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), class: 'grid' }, s);
      svg('text', { x: m.l - 8, y: y(v) + 4, class: 'tick', 'text-anchor': 'end' }, s).textContent = v;
    }
    // ~4 date ticks.
    const nX = Math.min(4, points.length);
    for (let i = 0; i < nX; i++) {
      const p = points[Math.round(i * (points.length - 1) / Math.max(1, nX - 1))];
      svg('text', { x: x(p.t), y: H - 8, class: 'tick', 'text-anchor': i === 0 ? 'start' : i === nX - 1 ? 'end' : 'middle' }, s)
        .textContent = dayFmt.format(p.t);
    }

    const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.rating).toFixed(1)}`).join('');
    svg('path', { d: `${d}L${x(t1)},${m.t + ih}L${x(t0)},${m.t + ih}Z`, class: 'area' }, s);
    svg('path', { d, class: 'line' }, s);

    // End dot + direct value label (text in text color, mark carries the teal).
    const last = points[points.length - 1];
    svg('circle', { cx: x(last.t), cy: y(last.rating), r: 5, class: 'dot' }, s);
    svg('text', { x: x(last.t) + 10, y: y(last.rating) + 4, class: 'end-label' }, s).textContent = last.rating;

    // Crosshair + tooltip (snaps to nearest day; keyboard arrows too).
    const cross = svg('line', { y1: m.t, y2: m.t + ih, class: 'cross', visibility: 'hidden' }, s);
    const hot = svg('circle', { r: 5, class: 'dot', visibility: 'hidden' }, s);
    const tip = document.createElement('div'); tip.className = 'chart-tip'; tip.hidden = true; plot.append(tip);
    let idx = points.length - 1;
    function show(i) {
      idx = Math.max(0, Math.min(points.length - 1, i));
      const p = points[idx], px = x(p.t), py = y(p.rating);
      cross.setAttribute('x1', px); cross.setAttribute('x2', px); cross.setAttribute('visibility', 'visible');
      hot.setAttribute('cx', px); hot.setAttribute('cy', py); hot.setAttribute('visibility', 'visible');
      tip.replaceChildren();
      const v = document.createElement('strong'); v.textContent = p.rating;
      const l = document.createElement('span');
      l.textContent = `${dayFmt.format(p.t)} · ${p.games} game${p.games > 1 ? 's' : ''}`;
      tip.append(v, l); tip.hidden = false;
      const scale = plot.clientWidth / W;
      tip.style.left = `${Math.min(px * scale + 12, plot.clientWidth - 130)}px`;
      tip.style.top = `${Math.max(py * scale - 50, 0)}px`;
    }
    function hide() { cross.setAttribute('visibility', 'hidden'); hot.setAttribute('visibility', 'hidden'); tip.hidden = true; }
    s.addEventListener('pointermove', e => {
      const r = s.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width);
      let best = 0, bd = Infinity;
      points.forEach((p, i) => { const dd = Math.abs(x(p.t) - px); if (dd < bd) { bd = dd; best = i; } });
      show(best);
    });
    s.addEventListener('pointerleave', hide);
    s.addEventListener('focus', () => show(idx));
    s.addEventListener('blur', hide);
    s.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { show(idx - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { show(idx + 1); e.preventDefault(); }
    });

    // Summary stats.
    const startRating = games[0].before, now = last.rating, delta = now - startRating;
    stats.replaceChildren();
    const add = (val, label, cls) => {
      const d = document.createElement('div'); d.className = 'stat';
      const b = document.createElement('b'); b.textContent = val; if (cls) b.className = cls;
      const sp = document.createElement('span'); sp.textContent = label;
      d.append(b, sp); stats.append(d);
    };
    add(now, 'Now');
    add(`${delta > 0 ? '+' : ''}${delta}`, '30-day change', delta > 0 ? 'up' : delta < 0 ? 'down' : '');
    add(Math.max(...vals), '30-day peak');
    add(games.length, `${LABEL[perf]} games`);

    // Table view (same data, no hover needed).
    tableBody.replaceChildren(...points.slice().reverse().map(p => {
      const tr = document.createElement('tr');
      for (const v of [dayFmt.format(p.t), p.rating, p.games]) { const td = document.createElement('td'); td.textContent = v; tr.append(td); }
      return tr;
    }));
  }

  load().then(games => {
    if (games.length < 2) { note.textContent = 'Not enough games in the last 30 days to chart yet.'; return; }
    const points = daily(games);
    if (points.length === 1) points.unshift({ t: games[0].start - 864e5, rating: games[0].before, games: 0 });
    render(points, games);
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => render(points, games), 150); });
    note.textContent = '';
  }).catch(() => { note.textContent = 'Couldn\'t load games from Lichess right now.'; });
})();
