// Everything you'd want to change lives in this file.
const SITE = {
  name: 'Street Chess Gary',
  short: 'SCG',
  tagline: 'Think you can beat me? Pick your battle and get in the queue.',
  lichess: 'garymccormack',                   // live rating source; swap for a new account anytime
  chartPerf: 'rapid',                         // which rating the 30-day chart plots
  platforms: ['Lichess', 'Chess.com'],       // where games are played
  contactEmail: 'gmccormackinc@gmail.com',
  links: [                                     // shown in the header; leave '' to hide
    { label: 'YouTube', url: '' },
    { label: 'Instagram', url: '' },
    { label: 'Lichess', url: 'https://lichess.org/@/garymccormack' },
    { label: 'Chess.com', url: '' },
  ],
};

// Each tier becomes a card. `paymentLink` is a Stripe Payment Link (see README).
// Leave it '' and the card shows "Opening soon" instead of a Book button.
// `minutes` is how long the slot takes; the queue uses it to estimate wait times.
// `perf` (bullet/blitz/rapid) shows your live Lichess rating for that time control on the card.
// Optional: `format` replaces the "N games" line; `perks` adds extra lines to the card.
const TIERS = [
  {
    id: 'bullet-1',
    perf: 'bullet',
    name: 'Bullet',
    games: 1,
    timeControl: '1+0',
    minutes: 5,
    price: 5,
    blurb: 'One game, one minute each. No time to think.',
    featured: false,
    paymentLink: 'https://buy.stripe.com/eVq4gB4Kt7H9ggKbgs1oI03',
  },
  {
    id: 'blitz-1',
    perf: 'blitz',
    name: 'Single Blitz',
    games: 1,
    timeControl: '5+0',
    minutes: 15,
    price: 10,
    blurb: 'One fast game. Bragging rights if you win.',
    featured: true,
    paymentLink: 'https://buy.stripe.com/dRm00l7WF4uX3tY5W81oI02',
  },
  {
    id: 'rapid-1',
    perf: 'rapid',
    name: 'Rapid',
    games: 1,
    timeControl: '10+0',
    minutes: 25,
    price: 15,
    blurb: 'More time on the clock. No excuses.',
    featured: false,
    paymentLink: 'https://buy.stripe.com/aFaaEZel30eH2pUesE1oI01',
  },
  {
    id: 'blitz-bo3',
    perf: 'blitz',
    name: 'Best of 3 Blitz',
    games: 3,
    format: 'Best of 3',
    timeControl: '3+0',
    minutes: 25,
    price: 25,
    blurb: 'Three rounds. Win the set, win the streets.',
    featured: false,
    paymentLink: 'https://buy.stripe.com/4gM8wR0udgdFc0udoA1oI00',
  },
  {
    id: 'smart-guy',
    perf: 'blitz',
    name: 'Smart Guy Tier',
    games: 5,
    format: 'Best of 5 blitz',
    timeControl: '3+0 or 5+0',
    minutes: 60,
    price: 100,
    blurb: 'Five games, your clock, no increment. Win or lose, you star in the next episode of the Smart Guy series on YouTube.',
    perks: ['You pick the clock, no increment', 'Your own Smart Guy series episode', 'Shorts cut from your battle'],
    featured: false,
    premium: true,                 // full-width headline card
    paymentLink: 'https://buy.stripe.com/00waEZ6SB0eH7KefwI1oI04',
  },
];
