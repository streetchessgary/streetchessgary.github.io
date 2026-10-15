# Play Street Chess Gary — paid 1V1 games, $0 hosting

A single static page: tiers → Stripe checkout → public queue. No server, no database, no monthly bill.

## Files
- `config.js` — your name, links, and **tiers** (price, time control, payment link)
- `queue.js` — the public queue; edit it to add/remove players
- `index.html`, `styles.css`, `app.js` — the page itself (rarely need touching)

## 1. Take payments (Stripe Payment Links — free, ~2.9% + 30¢ per sale)
1. Create a Stripe account at stripe.com and finish verification (bank account for payouts).
2. Products → **Add product** for each tier (e.g. "Single Blitz", $10, one-time).
3. On each product, **Create payment link**:
   - Add a **custom field**: "Your Lichess or Chess.com username" (text, required).
   - Add a second custom field (dropdown): "Platform" → Lichess / Chess.com.
   - Under *After payment*, show a confirmation message like:
     "You're in! I'll add you to the queue on the site within a few hours."
   - Turn on **Require customers to accept terms** if you want the recording/refund rules acknowledged.
4. Copy each link (`https://buy.stripe.com/...`) into that tier's `paymentLink` in `config.js`.

Each sale emails you the buyer's username. Add them to `queue.js`.

## 2. Put it online free (GitHub Pages)
1. Make a free GitHub account and a new public repo, e.g. `play`.
2. Upload these files (Add file → Upload files).
3. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/root`.
4. Your link: `https://<your-github-name>.github.io/play/` — put it in every bio.

To update the queue later, edit `queue.js` on GitHub in the browser and commit; the site updates in ~1 minute.

## Things to decide before launch
- **Refund policy**: the page promises a refund if you can't play within 7 days. Change it in `index.html` if needed.
- **Recording consent**: the page says games may be posted with the opponent's username. Keep that line since you plan to post videos.
- **Platform rules**: keep it framed as paying for your time, not a wager on the result. Lichess/Chess.com prohibit gambling on outcomes.
- **Taxes**: Stripe income is taxable; Stripe issues a 1099-K in the US above the threshold.
