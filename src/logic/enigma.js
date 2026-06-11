const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Simple LCG — deterministic, not cryptographic
function seededRandom(seed) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0
    return s / 0x100000000
  }
}

export function seededShuffle(array, seed) {
  const arr = [...array]
  const rng = seededRandom(seed)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function createRotor(levelIndex, rotorIndex) {
  const seed = (levelIndex + 1) * 100 + (rotorIndex + 1)
  return seededShuffle(ALPHA, seed)
}

// Encrypt a single uppercase letter through one rotor at given offset
export function encryptLetter(letter, rotor, offset) {
  const code = letter.charCodeAt(0) - 65
  return rotor[(code + offset) % 26]
}

// Decrypt a single letter through one rotor at given offset (inverse operation)
export function decryptLetter(letter, rotor, offset) {
  const idx = rotor.indexOf(letter)
  return String.fromCharCode((idx - offset + 26) % 26 + 65)
}

// Apply rotors left-to-right (encryption direction)
export function encryptMessage(plaintext, rotors, offsets) {
  return plaintext
    .toUpperCase()
    .split('')
    .map((ch) => {
      if (ch < 'A' || ch > 'Z') return ch
      let c = ch
      for (let i = 0; i < rotors.length; i++) c = encryptLetter(c, rotors[i], offsets[i])
      return c
    })
    .join('')
}

// Apply inverse rotors right-to-left (decryption direction)
// decryptMessage(encryptMessage(pt, rotors, offsets), rotors, offsets) === pt
export function decryptMessage(ciphertext, rotors, offsets) {
  return ciphertext
    .toUpperCase()
    .split('')
    .map((ch) => {
      if (ch < 'A' || ch > 'Z') return ch
      let c = ch
      for (let i = rotors.length - 1; i >= 0; i--) c = decryptLetter(c, rotors[i], offsets[i])
      return c
    })
    .join('')
}

export function getLevelRotors(levelIndex, rotorCount) {
  return Array.from({ length: rotorCount }, (_, i) => createRotor(levelIndex, i))
}

export function caesarEncryptLetter(letter, offset) {
  return String.fromCharCode((letter.charCodeAt(0) - 65 + offset) % 26 + 65)
}

export function caesarDecryptLetter(letter, offset) {
  return String.fromCharCode((letter.charCodeAt(0) - 65 - offset + 26) % 26 + 65)
}

export function caesarEncryptMessage(plaintext, offsets) {
  return plaintext
    .toUpperCase()
    .split('')
    .map((ch) => {
      if (ch < 'A' || ch > 'Z') return ch
      let c = ch
      for (const offset of offsets) c = caesarEncryptLetter(c, offset)
      return c
    })
    .join('')
}

export function caesarDecryptMessage(ciphertext, offsets) {
  return ciphertext
    .toUpperCase()
    .split('')
    .map((ch) => {
      if (ch < 'A' || ch > 'Z') return ch
      let c = ch
      for (let i = offsets.length - 1; i >= 0; i--) c = caesarDecryptLetter(c, offsets[i])
      return c
    })
    .join('')
}

export function caesarEncryptSegmented(text, segments, offsets) {
  const chars = text.toUpperCase().split('')
  segments.forEach(({ start, end }, i) => {
    for (let p = start; p < end; p++) {
      if (chars[p] >= 'A' && chars[p] <= 'Z') chars[p] = caesarEncryptLetter(chars[p], offsets[i])
    }
  })
  return chars.join('')
}

export function caesarDecryptSegmented(text, segments, offsets) {
  const chars = text.toUpperCase().split('')
  segments.forEach(({ start, end }, i) => {
    for (let p = start; p < end; p++) {
      if (chars[p] >= 'A' && chars[p] <= 'Z') chars[p] = caesarDecryptLetter(chars[p], offsets[i])
    }
  })
  return chars.join('')
}
