import { Card } from './types';

function makeCurse(id: string, name: string, castingCost: string, effect: string): Card {
  return { id, type: 'curse', name, castingCost, effect };
}

function makeTimeBonus(id: string, value: number): Card {
  return { id, type: 'time_bonus', name: `+${value} Minutes`, effect: `Adds ${value} minutes to your final score.`, value };
}

const CURSES: Card[] = [
  makeCurse('curse-move', 'Curse of the Move Card', 'Discard 2 cards', 'Gives the hider 45–60 minutes to pack up and completely change locations.'),
  makeCurse('curse-hide-seek-ception', 'Curse of the Hide-and-Seek-Ception', 'Seekers must be off-transit and at least 500 feet from a station', 'One seeker hides 500 feet away; the other seeker must find them before proceeding.'),
  makeCurse('curse-drained-brain', 'Curse of the Drained Brain', 'Discard your entire hand', 'Hider chooses 3 questions; seekers are banned from asking them for the rest of the run.'),
  makeCurse('curse-gilded-inquiry', 'Curse of the Gilded Inquiry', "The seekers' next question is free", 'Hider secretly picks a question. If seekers ask it, it\'s auto-vetoed and hider draws 3 cards.'),
  makeCurse('curse-prosperous-home', 'Curse of the Prosperous Home', 'Discard 20+ minutes of time bonuses', "Permanently expands the hider's zone radius by 50%. (Removed in endgame)."),
  makeCurse('curse-gamblers-feet', "Curse of the Gambler's Feet", 'Roll a die (even number = curse fails)', 'For 1 hour, seekers must roll a die before taking steps, moving only that many paces.'),
  makeCurse('curse-bird-guide', 'Curse of the Bird Guide', 'Film a bird', 'Seekers must film a single wild bird for up to 15 minutes continuous uncut frame.'),
  makeCurse('curse-zoologist', 'Curse of the Zoologist', 'Take a photo of a wild animal', 'Seekers must find and photograph an animal in that same biological category.'),
  makeCurse('curse-frozen-dot', 'Curse of the Frozen Dot', 'Seekers must be at least 10 miles away', 'Drops a pin 1,000 feet from seekers. If they walk within 250 feet of it in 15 mins, they freeze for 30 mins.'),
  makeCurse('curse-hidden-hangman', 'Curse of the Hidden Hangman', 'Discard 2 cards', 'Seekers must beat the hider in a 5-letter game of Hangman before moving or asking questions.'),
  makeCurse('curse-overflowing-chalice', 'Curse of the Overflowing Chalice', 'Discard 1 card', 'For the next 3 questions, the hider draws an extra card from the deck.'),
  makeCurse('curse-impressionable-consumer', 'Curse of the Impressionable Consumer', "Seekers' next question is free", 'Seekers must physically buy a product or enter a location they spot on a real-world advertisement.'),
  makeCurse('curse-town-hall', 'Town Hall Census Curse', "Seekers' next question is free", "Seekers must go to a local town hall and guess its jurisdiction's population within 25%."),
  makeCurse('curse-long-distance-die', 'Long-Distance Die Roll', 'None', 'Seekers must roll a physical die 100 feet away using only gravity/momentum to land a 5 or 6.'),
];

const POWERUPS_TEMPLATE: Card[] = [
  makeTimeBonus('tb-5', 5),
  makeTimeBonus('tb-10', 10),
  makeTimeBonus('tb-15', 15),
  { id: 'veto', type: 'veto', name: 'Veto Question', effect: 'Refuse to answer a question. You still receive card rewards.' },
  { id: 'randomize', type: 'randomize', name: 'Randomize Question', effect: 'Seekers must re-roll and pick a different hint.' },
];

export function buildDeck(): Card[] {
  const deck: Card[] = [...CURSES];
  for (let copy = 0; copy < 3; copy++) {
    for (const template of POWERUPS_TEMPLATE) {
      deck.push({ ...template, id: `${template.id}-${copy}` });
    }
  }
  return deck;
}
