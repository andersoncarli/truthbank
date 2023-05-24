const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const bitSequences = ['000', '001', '010', '011', '111', '110', '101', '100'];

// function waitForKeyPress() {
//   return new Promise((resolve) => {
//     rl.input.setRawMode(true);
//     rl.question('', () => {
//       rl.close();
//       resolve();
//     });
//   });
// }

function line(bits) {
  if (!bits) return ''
  var lineView = ('100 010 001 000'.includes(bits)) ? '▆▆▆▆  ▆▆▆▆' : '▆▆▆▆▆▆▆▆▆▆'
  lineView += ('000 111'.includes(bits)) ? '⏺' : ' '
  return bits + ' ' + lineView
}

function hexagram(lines) {
  let r = lines.slice().map((bits, i) =>
    bits ? (i + 1) + ': ' + line(bits) : '')
  return r.reverse().join('\n').trim() + ' '
}

async function readHexagram() {

  return new Promise((resolve) => {
    let lines = '\n\n\n\n\n'.split('\n')
    let selectedIndex = 0
    let currentLine = 0
    const write = (p) => process.stdout.write(p)

    readline.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)

    process.stdin.on('keypress', onKey)
    function onKey(str, key) {
      if (key.name == 'escape' || str == 'q' || key.ctrl && key.name == 'c') exit()
      currentLine++
      return false;
    }

    process.stdin.on('SIGINT', exit)
    function exit() {
      write(`\u001b[${currentLine + 1}B`);
      process.stdin.off('keypress', onKey)
      rl.close()
      resolve(lines)
    }

    displaySequence(50)
    function displaySequence() {
      if (currentLine == 6) return exit()
      lines[currentLine] = bitSequences[selectedIndex++ % 8]
      let h = hexagram(lines)
      write(`\u001b[s${h}\u001b[u`);
      // write(`\u001b[0G`);      
      setTimeout(displaySequence, 50)
    }
  })
}
function ask(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    rl.question(prompt || '', (answer) => {
      rl.close()
      process.stdin.setRawMode(false);
      resolve(answer);
    });
  });
}

console.clear()
console.log(`
IChing Powered GPT - Hexagram Generator

This software is a modern IChing oracle tool. I will a produce precise causal hexagram and transitions bringing the answers from your spirit that can be understood by your mind.

It was designed in a way, that all the ramdomness of the process is delegated to your body and soul. 

A modern tool to connect with your superior being pursuing higher truths. A translator to the IChing communication protocol.  

Please, think about your question asking in your heart for an answer and write it bellow with meaningfull words. This question will be used in the next GPT phase.
`)

async function main() {
  // const question = await ask('Enter your question:');
  // console.log(`\nIn the next phase you will generate the Iching hexagram to:\n
  //   ${question}\n\nPlease press any key to generate the next line.`)

  // await waitForKeyPress()
  const lines = await readHexagram()
  const hexagram = lines.map(l => l.substring(3, 6))
  console.log('[' + lines.join(', ') + ']\n')


  // const Lines = { "1.1": "Creation is Independent of Will", "1.2": "Love is light", "1.3": "The energy to sustain creative work", "1.4": "Aloneness as the medium of creativity", "1.5": "The energy to attract society", "1.6": "Objectivity", "2.1": "Intuition", "2.2": "Genius", "2.3": "Patience", "2.4": "Secretiveness", "2.5": "Intelligent application", "2.6": "Fixation", "3.1": "Synthesis", "3.2": "Immaturity", "3.3": "Survival", "3.4": "Charisma", "3.5": "Victimization", "3.6": "Surrender", "4.1": "Pleasure", "4.2": "Acceptance", "4.3": "Irresponsibility", "4.4": "The liar", "4.5": "Seduction", "4.6": "Excess", "5.1": "Perseverance", "5.2": "Inner peace", "5.3": "Compulsiveness", "5.4": "The hunter", "5.5": "Joy", "5.6": "Yielding", "6.1": "Retreat", "6.2": "The guerilla", "6.3": "Allegiance", "6.4": "Triumph", "6.5": "Arbitration", "6.6": "The peacemaker", "7.1": "Authoritarian", "7.2": "The democrat", "7.3": "The anarchist", "7.4": "The abdicator", "7.5": "The general", "7.6": "The administrator", "8.1": "Honesty", "8.2": "Service", "8.3": "The phoney", "8.4": "Respect", "8.5": "Dharma", "8.6": "Communion", "9.1": "Sensibility", "9.2": "Misery loves company", "9.3": "The straw that breaks the camel's back", "9.4": "Dedication", "9.5": "Faith", "9.6": "Gratitude", "10.1": "Modesty", "10.2": "The hermit", "10.3": "The martyr", "10.4": "The opportunist", "10.5": "The heretic", "10.6": "The role model", "11.1": "Attunement", "11.2": "Rigour", "11.3": "The realist", "11.4": "The teacher", "11.5": "The philanthropist", "11.6": "Adaptability", "12.1": "The monk", "12.2": "Purification", "12.3": "Confession", "12.4": "The prophet", "12.5": "The pragmatist", "12.6": "Metamorphosis", "13.1": "Empathy", "13.2": "Bigotry", "13.3": "Pessimism", "13.4": "Fatigue", "13.5": "The saviour", "13.6": "The optimist", "14.1": "Money isn't everything", "14.2": "Management", "14.3": "Service", "14.4": "Security", "14.5": "Arrogance", "14.6": "Humilty", "15.1": "Duty", "15.2": "Influence", "15.3": "Ego inflation", "15.4": "The wallflower", "15.5": "Sensitivity", "15.6": "Self-defense", "16.1": "Delusion", "16.2": "The cynic", "16.3": "Independence", "16.4": "The leader", "16.5": "The grinch", "16.6": "Gullibility", "17.1": "Openness", "17.2": "Discrimination", "17.3": "Understanding", "17.4": "The personnel manager", "17.5": "No human is an island", "17.6": "The bodhisattva", "18.1": "Conservatism", "18.2": "Terminal disease", "18.3": "The zealot", "18.4": "The incompetent", "18.5": "Therapy", "18.6": "Buddhahood", "19.1": "Interdependence", "19.2": "Service", "19.3": "Dedication", "19.4": "The team player", "19.5": "Sacrifice", "19.6": "The recluse", "20.1": "Superficiality", "20.2": "The dogmatist", "20.3": "Self-awareness", "20.4": "Application", "20.5": "Realism", "20.6": "Wisdom", "21.1": "Warning", "21.2": "Might is right", "21.3": "Powerlessness", "21.4": "Strategy", "21.5": "Objectivity", "21.6": "Chaos", "22.1": "Second class ticket", "22.2": "Charm school", "22.3": "The enchanter", "22.4": "Sensitivity", "22.5": "Directness", "22.6": "Maturity", "23.1": "Proselytization", "23.2": "Self-defense", "23.3": "Individuality", "23.4": "Fragmentation", "23.5": "Assimilation", "23.6": "Fusion", "24.1": "The sin of omission", "24.2": "Recognition", "24.3": "The addict", "24.4": "The hermit", "24.5": "Confession", "24.6": "The gift horse", "25.1": "Selflessness", "25.2": "The existentialist", "25.3": "Sensibility", "25.4": "Survival", "25.5": "Recuperation", "25.6": "Ignorance", "26.1": "A bird in the hand", "26.2": "The lessons of history", "26.3": "Influence", "26.4": "Censorship", "26.5": "Adaptability", "26.6": "Authority", "27.1": "Selfishness", "27.2": "Self-sufficiency", "27.3": "Greed", "27.4": "Generosity", "27.5": "The executor", "27.6": "Wariness", "28.1": "Preparation", "28.2": "Shaking hands with the devil", "28.3": "Adventurism", "28.4": "Holding on", "28.5": "Treachery", "28.6": "Blaze of glory", "29.1": "The draftee", "29.2": "Assessment", "29.3": "Evaluation", "29.4": "Directness", "29.5": "Overreach", "29.6": "Confusion", "30.1": "Composure", "30.2": "Pragmatism", "30.3": "Resignation", "30.4": "Burnout", "30.5": "Irony", "30.6": "Enforcement", "31.1": "Manifestation", "31.2": "Arrogance", "31.3": "Selectivity", "31.4": "Intent", "31.5": "Self-righteousness", "31.6": "Application", "32.1": "Conservation", "32.2": "Restraint", "32.3": "Lack on continuity", "32.4": "Right is might", "32.5": "Flexibility", "32.6": "Tranquillity", "33.1": "Avoidance", "33.2": "Surrender", "33.3": "Spirit", "33.4": "Dignity", "33.5": "Timing", "33.6": "Disassociation", "34.1": "The bully", "34.2": "Momentum", "34.3": "Machismo", "34.4": "Triumph", "34.5": "Annihilation", "34.6": "Common sense", "35.1": "Humility", "35.2": "Creative block", "35.3": "Collaboration", "35.4": "Hunger", "35.5": "Altruism", "35.6": "Rectification", "36.1": "Resistance", "36.2": "Support", "36.3": "Transition", "36.4": "Espionage", "36.5": "The underground", "36.6": "Justice", "37.1": "The mother/father", "37.2": "Responsibility", "37.3": "Evenhandedness", "37.4": "Leadership by example", "37.5": "Love", "37.6": "Purpose", "38.1": "Qualification", "38.2": "Politeness", "38.3": "Alliance", "38.4": "Investigation", "38.5": "Alienation", "38.6": "Misunderstanding", "39.1": "Disengagement", "39.2": "Confrontation", "39.3": "Responsibility", "39.4": "Temperance", "39.5": "Single-mindedness", "39.6": "The troubleshooter", "40.1": "Recuperation", "40.2": "Resoluteness", "40.3": "Humility", "40.4": "Organization", "40.5": "Rigidity", "40.6": "Decapitation", "41.1": "Reasonableness", "41.2": "Caution", "41.3": "Efficiency", "41.4": "Correction", "41.5": "Authorization", "41.6": "Contagion", "42.1": "Diversification", "42.2": "Identification", "42.3": "Trial and error", "42.4": "The middle man", "42.5": "Self-actualization", "42.6": "Nurturing", "43.1": "Patience", "43.2": "Dedication", "43.3": "Expediency", "43.4": "The one-track mind", "43.5": "Progression", "43.6": "Breakthrough", "44.1": "Conditions", "44.2": "Management", "44.3": "Interference", "44.4": "Honesty", "44.5": "Manipulation", "44.6": "Aloofness", "45.1": "Canvassing", "45.2": "Consensus", "45.3": "Exclusion", "45.4": "Direction", "45.5": "Leadership", "45.6": "Reconsideration", "46.1": "Being discovered", "46.2": "The prima donna", "46.3": "Projection", "46.4": "Impact", "46.5": "Pacing", "46.6": "Integrity", "47.1": "Taking stock", "47.2": "Ambition", "47.3": "Self-oppression", "47.4": "Repression", "47.5": "The saint", "47.6": "Futility", "48.1": "Insignificance", "48.2": "Degeneracy", "48.3": "Incommunicado", "48.4": "Restructuring  Sun exalted", "48.5": "Action", "48.6": "Self-fulfillment", "49.1": "The law of necessity", "49.2": "The last resort", "49.3": "Popular discontent", "49.4": "Platform", "49.5": "Organization", "49.6": "Attraction", "50.1": "The immigrant", "50.2": "Determination", "50.3": "Adaptability", "50.4": "Corruption", "50.5": "Consistency", "50.6": "Leadership", "51.1": "Reference", "51.2": "Withdrawal", "51.3": "Adaptation", "51.4": "Limitation", "51.5": "Symmetry", "51.6": "Separation", "52.1": "Think before you speak", "52.2": "Concern", "52.3": "Controls", "52.4": "Self-discipline", "52.5": "Explanation", "52.6": "Peacefulness", "53.1": "Accumulation", "53.2": "Momentum", "53.3": "Practicality", "53.4": "Assuredness", "53.5": "Assertion", "53.6": "Phasing", "54.1": "Influence", "54.2": "Discretion", "54.3": "Covert interaction", "54.4": "Enlightenment/endarkenment", "54.5": "Magnanimity", "54.6": "Selectivity", "55.1": "Co-operation", "55.2": "Distrust", "55.3": "Innocence", "55.4": "Assimilation", "55.5": "Growth", "55.6": "Selfishness", "56.1": "Quality", "56.2": "Linkage", "56.3": "Alienation", "56.4": "Expediency", "56.5": "Attracting attention", "56.6": "Caution", "57.1": "Confusion", "57.2": "Cleansing", "57.3": "Acuteness", "57.4": "The director", "57.5": "Progression", "57.6": "Utilization", "58.1": "Love of life", "58.2": "Perversion", "58.3": "Electricity", "58.4": "Focusing", "58.5": "Defense", "58.6": "Carried away", "59.1": "The preemptive strike", "59.2": "Shyness", "59.3": "Openness", "59.4": "Brotherhood/sisterhood", "59.5": "The femme fatale or Casanova", "59.6": "The one night stand", "60.1": "Acceptance", "60.2": "Decisiveness", "60.3": "Conservatism", "60.4": "Resourcefulness", "60.5": "Leadership", "60.6": "Rigidity", "61.1": "Occult knowledge", "61.2": "Natural brilliance", "61.3": "Interdependence", "61.4": "Research", "61.5": "Influence", "61.6": "Appeal", "62.1": "Routine", "62.2": "Restraint", "62.3": "Discovery", "62.4": "Asceticism", "62.5": "Metamorphosis", "62.6": "Self-discipline", "63.1": "Composure", "63.2": "Structuring", "63.3": "Continuance", "63.4": "Memory", "63.5": "Affirmation", "63.6": "Nostalgia", "64.1": "Conditions", "64.2": "Qualification", "64.3": "Overextension", "64.4": "Conviction", "64.5": "Promise", "64.6": "Victory" };
  // const Hexagrams = { "1": "The Criative", "2": "The Receptive", "3": "Ordering/Dificulty at Beginning", "4": "Answers/Formulas", "5": "Waiting/FixedRithm", "6": "Conflict/Friction", "7": "The Army/Give Order", "8": "Contribution", "9": "Focus", "10": "Behavior", "11": "Ideas/Peace", "12": "Caution", "13": "The Listener/Communion", "14": "Power Skills/Welth", "15": "Extremes/Modesty", "16": "Entusiam/Skills", "17": "Following/Opinion", "18": "Correction", "19": "Wanting/Need", "20": "The Now/Contemplation", "21": "Bitting Trough/The hunter", "22": "Grace/Openness", "23": "Assimilation/Analysis", "24": "Rationalizing/Return", "25": "Inocence/Spirit", "26": "The Egoist/The tamming power of the greate", "27": "Caring/Nutrition", "28": "The Game Player", "29": "Saying Yes/The Abism", "30": "Feelings", "31": "Leading/Influence", "32": "Continuity/Duration", "33": "Privacy/retreat", "34": "Might/Power of the Great", "35": "Change/Progression", "36": "Crisis/Obscurantism", "37": "Friendship/Family", "38": "The Fighter/Opposition", "39": "The Provocateur", "40": "Aloneness/Deliverance", "41": "Contraction/Reduction", "42": "Growth/Expansion", "43": "Insight/Systesis", "44": "Alertness", "45": "Reunion/The Gatherer", "46": "Determination", "47": "Realizing/Opression", "48": "Depth/The wheel", "49": "Rejection/Principles/Revolution", "50": "Values/The Calderon", "51": "Shock", "52": "Inaction/Stillness", "53": "Beginnings/Develpment", "54": "Ambition/Going up", "55": "Spirit/Abundance", "56": "Stimulation/The wanderer", "57": "Intuition/Penetration", "58": "Joy/Aliveness", "59": "Intimacy/Sexuality", "60": "Acceptance/Limits", "61": "Mystery/Inner Truth", "62": "Detail", "63": "Doubt/Before Conclusion", "64": "Confusion/after Conclusion" }


  process.exit()
}; main()