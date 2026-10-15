// The public queue. After someone pays, Stripe emails you their details;
// add them here, then remove them once you've played. Order = play order.
// status: 'playing' | 'next' | 'waiting'
// Only put what you're happy to show publicly (a chess username is ideal).
// Example entry:  { player: 'their_username', tier: 'blitz-1', status: 'next' },
const QUEUE = [
];
