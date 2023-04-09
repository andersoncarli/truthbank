function PE(sentence) {
  // Remove punctuation and lowercase sentence for easier processing
  sentence = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase()

  // Tokenize sentence into an array of words
  const words = sentence.split(' ')

  // Initialize subject, link, and predicate
  let subject = words.shift()
  let link = ''
  let predicate = words.pop()

  // Loop through each word and categorize it
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const nextWord = words[i + 1]

    // Check for adverbs and adverbial phrases
    if (isAdverb(word) || isAdverbialPhrase(word, nextWord)) {
      predicate = `${word} ${predicate}`
    } else {
      // Check for negation
      if (word === 'no' || word === 'not') {
        link = 'not'
      }

      // Check for conjunctions
      if (word === 'and' || word === 'or') {
        link = word
      }

      // Check for bi-conditional
      if (word === 'if' && nextWord === 'and' || word === 'iff') {
        link = 'if and only if'
      }

      // Check for complex predicates
      if (isComplexPredicate(word)) {
        const splitPredicate = splitComplexPredicate(word)
        link = splitPredicate.link
        predicate = splitPredicate.predicate
      }

      // Otherwise, assume word is part of the predicate
      if (!link) {
        predicate = `${predicate} ${word}`
      }
    }
  }

  // Create the PE proposition
  if (link) {
    return `${subject} ${link} ${predicate}`
  } else {
    return `${subject} ${predicate}`
  }
}

function PE(sentence) {
  const ast = parse(sentence)

  switch (ast.type) {
    case 'Proposition':
      const subject = ast.subject.type === 'Negation' ? `no ${ast.subject.subject}` : ast.subject.subject
      const predicate = ast.predicate.type === 'Negation' ? `no ${ast.predicate.predicate}` : ast.predicate.predicate
      const link = ast.predicate.link
      return `${subject} ${link} ${predicate}`

    case 'QuantifiedStatement':
      const quantifier = ast.quantifier.quantifier
      const quantity = ast.quantifier.quantity
      const proposition = PE(ast.proposition)
      return `${quantifier} ${quantity} ${proposition}`

    case 'CompleteSentence':
      const subjectPE = PE(ast.subject)
      const predicatePE = PE(ast.predicate)
      const complementPE = ast.complement ? PE(ast.complement) : ''
      const adverbialModifierPE = ast.adverbialModifier ? `(${PE(ast.adverbialModifier)})` : ''
      const prepositionalPhrasePE = ast.prepositionalPhrase ? `(${PE(ast.prepositionalPhrase)})` : ''
      const linkingVerbPE = ast.linkingVerb ? ast.linkingVerb.linkingVerb : ''
      return `${subjectPE} ${predicatePE} ${complementPE} ${adverbialModifierPE} ${prepositionalPhrasePE} ${linkingVerbPE}`

    // handle other cases as needed
    default:
      return ''
  }
}
