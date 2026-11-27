// Each station opens the next unfinished section in that part of the course.
const STATIONS = [
  {name:'Foundations', range:'Diagnostic · 01', ids:['d00','m01']},
  {name:'Buying new', range:'02 – 04', ids:['m02','m03','m04']},
  {name:'Buying used', range:'05 – 05b', ids:['m05','m05b']},
  {name:'Leasing', range:'06 – 08b', ids:['m06','m07','m07b','m08','m08b']},
  {name:'Financing & law', range:'09 – 11', ids:['m09','m10','m11']},
  {name:'Make the call', range:'12 – Final', ids:['m12','m13','x14']}
];

const EDITION = {
  isLabComplete(id, result) {
    if (!result) return false;
    const progress = /^(\d+) \/ (\d+) (?:files|cases reviewed)$/.exec(result);
    return progress ? Number(progress[1]) === Number(progress[2]) : true;
  },
  "name": "Aviation law",
  "topic": "Aircraft sales & leasing",
  "title": [
    "Clearing the ",
    "aircraft deal"
  ],
  "description": "Read the agreement, predict where disputed terms will land, and decide whether to sign, negotiate or walk.",
  "image": "assets/apron.webp",
  "alt": "An airliner parked nose-on at an airport gate",
  "exhibits": 21,
  "limits": "<h2>Using the course</h2><p>Take the diagnostic cold. Modules and the final exam use an 80% first-try pass mark. Read the closing set after module 5 and the marked lease after module 8. Practise on four public filings, then take the client call on a fresh agreement.</p><p>The library includes historical contracts and common terms. Check the original filing for redactions, schedules and later amendments. Verify current terms, local procedures and enforcement with qualified counsel for a live transaction.</p>"
};
