// "Watch me live": shows the game Gary is playing right now (embedded Lichess board),
// or his most recent game when he's offline. Re-checks every 30 seconds.
(() => {
  const user = SITE.lichess;
  const box = document.getElementById('live');
  if (!user || !box) return;

  const statusEl = document.getElementById('live-status');
  const embedEl = document.getElementById('live-embed');
  const watchBtn = document.getElementById('watch-live');
  const gamesBtn = document.getElementById('all-games');
  const enc = encodeURIComponent(user);
  watchBtn.href = `https://lichess.org/@/${enc}/tv`;
  gamesBtn.href = `https://lichess.org/@/${enc}/all`;

  let shownId = null;

  function showGame(id, label, live) {
    box.classList.toggle('is-live', live);
    statusEl.replaceChildren();
    if (live) statusEl.append(Object.assign(document.createElement('span'), { className: 'live-dot', textContent: 'LIVE' }), ' ');
    statusEl.append(label);
    if (!id) { embedEl.replaceChildren(); shownId = null; return; }
    // Reload the board while live so viewers see new moves; otherwise only when the game changes.
    if (id === shownId && !live) return;
    const frame = document.createElement('iframe');
    frame.src = `https://lichess.org/embed/game/${encodeURIComponent(id)}?theme=auto&bg=dark`;
    frame.title = live ? 'Gary\'s live game on Lichess' : 'Gary\'s most recent game on Lichess';
    frame.loading = 'lazy';
    frame.allowTransparency = true;
    embedEl.replaceChildren(frame);
    shownId = id;
  }

  async function lastGameId() {
    const r = await fetch(`https://lichess.org/api/games/user/${enc}?max=1&moves=false`,
      { headers: { Accept: 'application/x-ndjson' } });
    const line = (await r.text()).split('\n').find(Boolean);
    return line ? JSON.parse(line).id : null;
  }

  async function check() {
    try {
      const r = await fetch(`https://lichess.org/api/users/status?ids=${enc}&withGameIds=true`);
      const s = (await r.json())[0] || {};
      if (s.playing && s.playingId) {
        showGame(s.playingId, 'I\'m playing right now. Pull up a chair.', true);
        watchBtn.href = `https://lichess.org/${encodeURIComponent(s.playingId)}`;
      } else {
        watchBtn.href = `https://lichess.org/@/${enc}/tv`;
        showGame(await lastGameId(), s.online ? 'Online, between games. Here\'s my last one:'
          : 'Not playing right now. Here\'s my last game:', false);
      }
    } catch {
      showGame(null, 'Couldn\'t reach Lichess. Use the buttons below to watch there.', false);
    }
  }

  check();
  setInterval(check, 30000);
})();
