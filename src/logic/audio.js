import * as Tone from 'tone'

let _initialized = false
let _staticNoise = null
let _staticGain = null

export async function initAudio() {
  if (_initialized) return
  _initialized = true
  await Tone.start()
  // Warm up context with a silent pulse
  const osc = new Tone.Oscillator(440, 'sine').toDestination()
  osc.volume.value = -Infinity
  osc.start().stop('+0.001')
  setTimeout(() => osc.dispose(), 200)
}

export function playRotorClick() {
  if (!_initialized) return
  const click = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 4,
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.06 },
  }).toDestination()
  click.volume.value = -10
  click.triggerAttackRelease('C2', '32n')
  setTimeout(() => click.dispose(), 300)
}

export function startStaticLoop() {
  if (!_initialized || _staticNoise) return
  _staticGain = new Tone.Gain(0.04).toDestination()
  _staticNoise = new Tone.Noise('brown').connect(_staticGain)
  _staticNoise.start()
}

export function stopStaticLoop() {
  if (_staticNoise) {
    _staticNoise.stop()
    _staticNoise.dispose()
    _staticNoise = null
  }
  if (_staticGain) {
    _staticGain.dispose()
    _staticGain = null
  }
}

export function playSuccess() {
  if (!_initialized) return
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.8 },
  }).toDestination()
  synth.volume.value = -12
  const now = Tone.now()
  synth.triggerAttackRelease('C5', '8n', now)
  synth.triggerAttackRelease('E5', '8n', now + 0.12)
  synth.triggerAttackRelease('G5', '4n', now + 0.24)
  setTimeout(() => synth.dispose(), 2000)
}

export function playTimeout() {
  if (!_initialized) return
  const synth = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.2 },
  }).toDestination()
  synth.volume.value = -14
  const now = Tone.now()
  synth.triggerAttackRelease('G3', '8n', now)
  synth.triggerAttackRelease('Eb3', '8n', now + 0.2)
  synth.triggerAttackRelease('C3', '4n', now + 0.4)
  setTimeout(() => synth.dispose(), 2000)
}
