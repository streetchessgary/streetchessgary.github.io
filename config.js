// Everything you'd want to change lives in this file.
const SITE = {
  name: 'Street Chess Gary',
  short: 'SCG',
  tagline: 'Think you can beat me? Pick your battle and get in the queue.',
  lichess: 'garymccormack',                   // live rating source; swap for a new account anytime
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
    paymentLink: 'https://buy.stripe.com/test_bJe00j0Q863HajJ46AeEo00',
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
    paymentLink: 'https://buy.stripe.com/test_28EfZheGYfEhfE3bz2eEo01',
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
    paymentLink: 'https://buy.stripe.com/test_14A5kD8iA3Vz1Nd8mQeEo02',
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
    paymentLink: 'https://buy.stripe.com/test_7sYfZh42kcs5ezZauYeEo03',
  },
  {
    id: 'street-master',
    perf: 'blitz',
    name: 'Street Master',
    games: 3,
    format: 'Best of 3',
    timeControl: '3+0',
    minutes: 40,
    price: 100,
    blurb: 'The full SCG treatment. Your battle becomes an episode.',
    perks: ['Full video on YouTube', 'Shorts cut from your battle'],
    featured: false,
    premium: true,                 // full-width headline card
    paymentLink: 'https://buy.stripe.com/test_4gMcN50Q89fTcrR32weEo04',
  },
];
