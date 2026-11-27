const MODS=[
["d00","Baseline diagnostic","Start here"],
["m00","How lawyers and legal work function","Foundations"],
["m01","Contract foundations","Foundations"],
["m02","Companies, deals and the cast","Foundations"],
["m03","Deal lifecycle and pre-SPA documents","The deal"],
["m04","Price: headline to cash paid","The deal"],
["m05","Due diligence","The deal"],
["m06","Anatomy of an SPA; reading at speed","The deal"],
["m07","Warranties and disclosure","Risk allocation"],
["m08","Limitations: de minimis, basket, cap, time","Risk allocation"],
["m09","Indemnities, tax, insurance, recourse","Risk allocation"],
["m10","Conditions, the gap, the right to walk","Risk allocation"],
["m11","Covenants, boilerplate, ancillaries, after closing","Risk allocation"],
["m12","The UAE and GCC overlay","Context"],
["m13","Negotiation dynamics","Calling the deal"],
["m14","The landing model: precedent + leverage","Calling the deal"],
["m15","Kept risk and the pursue / walk decision","Calling the deal"],
["x16","Final exam","Assessment"]];
const MLABEL=id=>id[0]==='m'?String(parseInt(id.slice(1),10)):id==='d00'?'◇':'★';
const LABS=[
["extract","Lab 1 · Clause hunt on real SPAs","Read a signed agreement, extract its terms, get marked against the answer key with the quoted clause."],
["errors","Lab 2 · Catch the AI's mistakes","An AI summary of a real deal with planted errors. Find them using the source text."],
["explorer","Lab 3 · Precedent explorer","Filter 22 real deals and compute precedent bands. Unlocks after 4 graded extractions."],
["landing","Lab 4 · Blind landing prediction","Given a deal's facts, predict its terms, then see what was actually signed."],
["exposure","Lab 5 · Kept-risk simulator","Compare term packages against a risk register and get an effective price."],
["dealdesk","Lab 6 · Deal desk (capstone)","Three fictional UAE-style acquisitions. Use each issues list to forecast the terms and advise the buyer."],
["issues","Lab 7 · Write an issues list","Act for the sellers on a real signed agreement: find the points to push back on, then compare with a model list."]];
