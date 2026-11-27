const MODS = [
  [
    "d00",
    "Baseline diagnostic",
    "Start here"
  ],
  [
    "m01",
    "Parties and paper",
    "Foundations"
  ],
  [
    "m02",
    "Specification and price",
    "Buying new"
  ],
  [
    "m03",
    "PDPs and delivery",
    "Buying new"
  ],
  [
    "m04",
    "Delay and support",
    "Buying new"
  ],
  [
    "m05",
    "Inspection to closing",
    "Buying used"
  ],
  [
    "m06",
    "Rent and security",
    "Leasing"
  ],
  [
    "m07",
    "Maintenance and return",
    "Leasing"
  ],
  [
    "m08",
    "Casualty and default",
    "Leasing"
  ],
  [
    "m09",
    "Financing structures",
    "Context"
  ],
  [
    "m10",
    "Priority and export",
    "Context"
  ],
  [
    "m11",
    "Tax and forum",
    "Context"
  ],
  [
    "m12",
    "Predict the landing",
    "Decision"
  ],
  [
    "m13",
    "Make the call",
    "Decision"
  ],
  [
    "x14",
    "Final exam",
    "Assessment"
  ]
];
const MLABEL = id => id.startsWith("m") ? Number(id.slice(1)) : id==="d00" ? "◇" : "★";
const LABS = [
  [
    "extract",
    "Lab 1 · Clause hunt",
    "Read a public exhibit and locate the operative provision for each answer."
  ],
  [
    "errors",
    "Lab 2 · Audit an AI summary",
    "Test four assertions about acceptance, support and delivery against an OEM purchase."
  ],
  [
    "explorer",
    "Lab 3 · Precedent explorer",
    "Compare evidence by document family after four graded extractions."
  ],
  [
    "landing",
    "Lab 4 · Predict before reveal",
    "Predict a withheld clause outcome from a transaction brief."
  ],
  [
    "exposure",
    "Lab 5 · Kept-risk simulator",
    "Vary probability, recovery and price to find break-even."
  ],
  [
    "dealdesk",
    "Lab 6 · Deal desk",
    "Decide three mandates with different economics and hard stops."
  ],
  [
    "issues",
    "Lab 7 · Draft the issues list",
    "Turn a filed agreement into instructions for the next negotiation."
  ]
];
