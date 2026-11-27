// Each station opens the next unfinished section in that part of the course.
const STATIONS = [
  {name:'Foundations', range:'Diagnostic · 01', ids:['d00','m01']},
  {name:'Buying new', range:'02 – 04', ids:['m02','m03','m04']},
  {name:'Buying used', range:'05', ids:['m05']},
  {name:'Leasing', range:'06 – 08', ids:['m06','m07','m08']},
  {name:'Financing & law', range:'09 – 11', ids:['m09','m10','m11']},
  {name:'Make the call', range:'12 – Final', ids:['m12','m13','x14']}
];

const EDITION = {
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
  "limits": "<h2>Using the course</h2><p>Take the diagnostic cold. Modules and the final exam use an 80% first-try pass mark. Work through a purchase and a lease in the clause hunt, then test your judgment at the deal desk.</p><p>The library includes historical contracts and common terms. Check the original filing for redactions, schedules and later amendments. Verify current terms, local procedures and enforcement with qualified counsel for a live transaction.</p>"
};
