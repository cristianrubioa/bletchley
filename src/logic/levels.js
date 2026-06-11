import { getLevelRotors, encryptMessage, caesarEncryptSegmented } from './enigma.js'

export const LEVEL_COUNT = 4

const RAW_LEVELS = [
  // Level 0 — Caesar, 1 rotor, 3 min, 1 crib (tutorial)
  {
    cipherType: 'caesar',
    rotorCount: 1,
    segments: [{ start: 0, end: 39 }],
    duration: 180,
    solutionOffsets: [7],
    alwaysRevealed: true,
    plaintext: 'WEATHER REPORT NORTH SEA WINDS MODERATE',
    cribs: [
      { word: 'WEATHER', hint: 'Turn the dial until WEATHER appears below.' },
    ],
    briefingText: [
      'Hut 6, 06:00.',
      'The Germans shift every letter by the same amount. A becomes H, B becomes I — the whole alphabet moves together.',
      'Turn the dial. Watch the letters slide. Stop when the message makes sense.',
      'One rotor. Three minutes. Find the word WEATHER.',
    ],
    narrativeYear: '1939',
    narrativeText:
      'Alan Turing arrives at Bletchley Park in September 1939, two days after Britain declares war on Germany. He is twenty-seven years old. Within months, he designs the Bombe — an electromechanical device that tests Enigma settings systematically, at a scale no human team could match.',
  },
  // Level 1 — Caesar, 2 rotors, 2 min, 1 crib per segment
  {
    cipherType: 'caesar',
    rotorCount: 2,
    segments: [{ start: 0, end: 17 }, { start: 17, end: 50 }],
    duration: 120,
    solutionOffsets: [5, 3],
    alwaysRevealed: true,
    plaintext: 'CONVOY DEPARTING LIVERPOOL AT DAWN ESCORT REQUIRED',
    cribs: [
      { word: 'CONVOY', hint: 'Dial 1: find CONVOY DEPARTING' },
      { word: 'LIVERPOOL', hint: 'Dial 2: find LIVERPOOL' },
    ],
    briefingText: [
      'Priority intercept. 03:20.',
      'Two rotors now. Each shifts the alphabet independently — together they disguise the message further.',
      'A supply convoy route has been compromised. Find the right combination before the ships sail.',
      'Two rotors. Two minutes. Find CONVOY.',
    ],
    narrativeYear: '1941',
    narrativeText:
      'February 1941. Turing and his team break the naval Enigma. Reading German U-boat communications allows the Allies to reroute convoys around waiting submarines. Historians estimate this work alone shortened the war by two years and saved hundreds of thousands of lives. None of it can be spoken of.',
  },
  // Level 2 — Permutation, 2 rotors, 150s, 1 crib always visible + word counter
  {
    cipherType: 'permutation',
    rotorCount: 2,
    duration: 150,
    solutionOffsets: [11, 4],
    lockedRotors: [0],
    alwaysRevealed: true,
    plaintext: 'SUBMARINE U FOUR SEVEN PATROL GRID ALPHA NOVEMBER',
    cribs: [
      { word: 'PATROL', hint: 'Find PATROL in the decrypted output.' },
    ],
    briefingText: [
      'Last signal before dawn. Time unknown.',
      'A U-boat patrol grid. If we can read it, we can reroute the ships before they sail.',
      "We've already cracked the first rotor. You need the second.",
      'Two rotors. Two and a half minutes.',
    ],
    narrativeYear: '1945',
    narrativeText:
      "May 1945. The war in Europe ends. Turing's work at Bletchley Park remains classified under the Official Secrets Act. He will not receive public credit in his lifetime. The soldiers who fought with rifles are welcomed home as heroes. The mathematicians who fought with logic disappear into silence.",
  },
  // Level 3 — Permutation, 3 rotors (2 locked), 90s, 1 hidden crib
  {
    cipherType: 'permutation',
    rotorCount: 3,
    duration: 90,
    solutionOffsets: [7, 19, 3],
    lockedRotors: [0, 1],
    alwaysRevealed: false,
    plaintext: 'OPERATION OVERCAST BEGINS AT ZERO HOUR ALL UNITS ADVANCE',
    cribs: [
      { word: 'OVERCAST', hint: 'Find OPERATION OVERCAST in the decrypted output.' },
    ],
    briefingText: [
      'No timestamp. No origin. No context.',
      'Three rotors. Two are solved. The third is yours.',
      'This is the last intercept before the silence.',
      'Ninety seconds.',
    ],
    narrativeYear: '1952',
    narrativeText:
      "June 1952. Alan Turing is convicted of gross indecency for a relationship with another man. He is offered a choice: prison or chemical castration. He chooses the injections. His security clearance is revoked. The work at Bletchley Park remains classified. The man who helped win the war cannot be named. Two years later, he is found dead with a half-eaten apple beside him. He is forty-one years old.",
  },
]

let _cache = null

function buildLevels() {
  if (_cache) return _cache
  _cache = RAW_LEVELS.map((raw, index) => {
    if (raw.cipherType === 'caesar') {
      const ciphertext = caesarEncryptSegmented(raw.plaintext, raw.segments, raw.solutionOffsets)
      return { ...raw, rotors: null, ciphertext }
    }
    const rotors = getLevelRotors(index, raw.rotorCount)
    const ciphertext = encryptMessage(raw.plaintext, rotors, raw.solutionOffsets)
    return { ...raw, rotors, ciphertext }
  })
  return _cache
}

export function getLevelConfig(index) {
  return buildLevels()[index]
}
