class TruthBank {
  constructor() {
    this.premises = []
    // Probabilities for each quantifier.
    this.quantifiers = { none: 0.25, some: 0.25, most: 0.25, all: 0.25 }
  }

  // Add a premise to the premises array.
  addPremise(premise) { this.premises.push(premise) }

  // Calculate the credibility of a statement.
  // Returns a number between -1 and 1.
  credibility(statement) {
    const prop = PE(statement)
    const subPropositions = this.getSubPropositions(prop)
    const priors = this.priors(subPropositions)
    const evidences = this.evidences(subPropositions)
    const conditionals = TruthBank.Conditionals(priors, evidences)
    const credibility = TruthBank.CredibilityFromConditionals(conditionals)
    return credibility
  }

  // Returns an array of all sub-propositions of a proposition.
  getSubPropositions(prop) {
    const subPropositions = []
    const stack = [prop]
    while (stack.length > 0) {
      const subProp = stack.pop()
      subPropositions.push(subProp)
      const subPropParts = subProp.split(' ')
      subPropParts.forEach(part => {
        if (this.isSubProposition(part)) {
          stack.push(part)
        }
      })
    }
    return subPropositions
  }

  // Returns true if a proposition is a sub-proposition.
  isSubProposition(prop) {
    return prop[0] === 'A' || prop[0] === 'E' || prop[0] === 'N' || prop[0] === '!' || prop[0] === '('
  }

  // Calculates prior probabilities for all sub-propositions.
  // Returns an object where keys are sub-propositions and values are prior probabilities.
  priors(subPropositions) {
    const priors = {}
    subPropositions.forEach(subProp => {
      const subPropParts = subProp.split(' ')
      const quantifier = subPropParts[0]
      if (this.quantifiers[quantifier]) {
        priors[subProp] = this.quantifiers[quantifier]
      }
    })
    return priors
  }

  // Calculates evidence probabilities for all sub-propositions.
  // Returns an object where keys are sub-propositions and values are evidence probabilities.
  evidences(subPropositions) {
    const evidences = {}
    subPropositions.forEach(subProp => {
      const matchingPremises = this.getMatchingPremises(subProp)
      if (matchingPremises.length > 0) {
        evidences[subProp] = this.probabilityFromPremises(matchingPremises)
      }
    })
    return evidences
  }

  // Returns an array of all premises that contain a given sub-proposition.
  getMatchingPremises(subProp) {
    const matchingPremises = this.premises.filter(premise => premise.includes(subProp))
    return matchingPremises
  }

  // Calculates probability from an array of premises.
  // Returns a number between -1 and 1.
  probabilityFromPremises(premises) {
    const numTruePremises = premises.filter(p => p[0] !== '!').length
    const numFalsePremises = premises.filter(p => p[0] === '!').length
    const trues = numTruePremises / premises.length
    const falses = numFalsePremises / premises.length
    const probability = (trues - falses) / (1 - falses)
    return probability
  }

  // Calculates conditional probabilities for all sub-propositions.
  // Returns an object where keys are sub-propositions and values are conditional probabilities.
  static Conditionals(priors, evidences) {
    const conditionals = {}
    Object.keys(priors).forEach(subProp => {
      if (evidences[subProp]) {
        const priorProbability = priors[subProp]
        const evidenceProbability = evidences[subProp]
        const conditionalProbability = evidenceProbability * priorProbability / ((evidenceProbability * priorProbability) + ((1 - evidenceProbability) * (1 - priorProbability)))
        conditionals[subProp] = conditionalProbability
      }
    })
    return conditionals
  }

  // Calculates credibility of a proposition from its conditional probabilities.
  // Returns a number between -1 and 1.
  credibilityFromConditionals(conditionals) {
    const propCredibilities = []
    for (let subProp in conditionals) {
      const conditionalProbability = conditionals[subProp]
      const subPropParts = subProp.split(' ')
      const negation = subPropParts[0] === 'no' ? -1 : 1
      const credibility = negation * (1 - conditionalProbability)
      propCredibilities.push(credibility)
    }
    const credibility = propCredibilities.reduce((a, b) => a * b, 1)
    return credibility
  }
}

module.exports = { TruthBank }