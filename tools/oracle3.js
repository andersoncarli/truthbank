// Part component
function Part(filled) {
  const partEl = document.createElement('div');
  partEl.classList.add('part');
  if (filled) {
    partEl.classList.add('solid');
  }
  return partEl;
}

// Gap component
function Gap(filled) {
  const gapEl = document.createElement('div');
  gapEl.classList.add('gap');
  if (filled) {
    gapEl.classList.add('solid');
  }
  return gapEl;
}

// Dot component
function Dot(filled) {
  const dotEl = document.createElement('div');
  dotEl.classList.add('part', 'mutation');
  if (filled) {
    dotEl.classList.add('solid');
  }
  dotEl.textContent = '·';
  return dotEl;
}

function lineType(bits) {
  return {
    '000': { type: 'yin',  mutant: true },
    '001': { type: 'yin' },
    '010': { type: 'yin' },
    '100': { type: 'yin'},
    '101': { type: 'yang'},
    '011': { type: 'yang'},
    '110': { type: 'yang'},
    '111': { type: 'yang', mutant: true },
  }[bits]
}

function Line(value) {
  const [part1, part2, part3] = value.split('');
  const lineEl = document.createElement('div');
  lineEl.classList.add('line');
  lineEl.appendChild(Part(part1 === '1'));
  lineEl.appendChild(Gap(part2 === '0'));
  lineEl.appendChild(Part(part3 === '1'));
  lineEl.appendChild(Gap(part2 === '0'));
  lineEl.appendChild(Dot(value !== '000' && value !== '111'));
  return lineEl;
}

function Line(bits) {
  const { type, mutant } = lineType(bits)
  return {
    type: 'div',
    attributes: {
      class: 'line',
    },
    children: [
      Part(type === 'yang'),
      Gap(type === 'yang'),
      Part(type === 'yang'),
      Gap(),
      Dot(mutant),
    ]
  }
}
function Hexagram(bits) {
  const lines = bits.map(bit => Line(bit)).join('');
  return `<div class="hexagram">${lines}</div>`;
}