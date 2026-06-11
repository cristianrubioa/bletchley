export function countPlaintextWords(decryptedText, plaintext) {
  const words = plaintext.toUpperCase().split(' ').filter(Boolean)
  const text = decryptedText.toUpperCase()
  const found = words.filter((w) => text.includes(w)).length
  return { found, total: words.length }
}

// Returns [{start, end}] ranges where revealed cribs (or prefixes ≥ 3 chars) appear in text.
// Ranges are non-overlapping and sorted by start position.
export function findCribRanges(decryptedText, revealedCribs) {
  if (!revealedCribs || revealedCribs.length === 0) return []

  const text = decryptedText.toUpperCase()
  const raw = []

  for (const crib of revealedCribs) {
    const word = crib.toUpperCase()

    // Full match
    let idx = text.indexOf(word)
    while (idx !== -1) {
      raw.push({ start: idx, end: idx + word.length })
      idx = text.indexOf(word, idx + 1)
    }

    // Prefix matches (length 3 up to word.length - 1) when no full match found
    if (word.length > 3) {
      for (let len = Math.min(word.length - 1, text.length); len >= 3; len--) {
        const prefix = word.slice(0, len)
        let pi = text.indexOf(prefix)
        while (pi !== -1) {
          raw.push({ start: pi, end: pi + len })
          pi = text.indexOf(prefix, pi + 1)
        }
      }
    }
  }

  if (raw.length === 0) return []

  // Merge overlapping / contained ranges
  raw.sort((a, b) => a.start - b.start)
  const merged = [raw[0]]
  for (let i = 1; i < raw.length; i++) {
    const last = merged[merged.length - 1]
    if (raw[i].start <= last.end) {
      last.end = Math.max(last.end, raw[i].end)
    } else {
      merged.push(raw[i])
    }
  }

  return merged
}

// Highlights individual letter positions where decrypted[pos] matches the expected
// plaintext letter of the crib at that position. Used for Caesar levels so players
// see letters "lock in" as they approach the correct offset.
export function findCribRangesPerLetter(decryptedText, plaintext, cribs) {
  if (!cribs || cribs.length === 0) return []

  const text = decryptedText.toUpperCase()
  const pt = plaintext.toUpperCase()
  const raw = []

  for (const crib of cribs) {
    const word = crib.toUpperCase()
    const cribStart = pt.indexOf(word)
    if (cribStart === -1) continue

    let rangeStart = null
    for (let i = 0; i < word.length; i++) {
      const pos = cribStart + i
      if (pos < text.length && text[pos] === word[i]) {
        if (rangeStart === null) rangeStart = pos
      } else {
        if (rangeStart !== null) {
          raw.push({ start: rangeStart, end: pos })
          rangeStart = null
        }
      }
    }
    if (rangeStart !== null) {
      raw.push({ start: rangeStart, end: cribStart + word.length })
    }
  }

  return raw
}
