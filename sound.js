// Sistema de sonido usando Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundEnabled = true;

function playSound(type) {
  if (!soundEnabled) return;

  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  const sounds = {
    attack: { freq: 800, duration: 0.1 },
    spell: { freq: 1200, duration: 0.15 },
    heal: { freq: 1600, duration: 0.2 },
    shield: { freq: 1000, duration: 0.12 },
    coin: { freq: 2000, duration: 0.1 },
    levelup: { freq: 1400, duration: 0.3 },
    log: { freq: 600, duration: 0.05 }
  };

  const sound = sounds[type] || sounds.attack;

  osc.frequency.value = sound.freq;
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + sound.duration);

  osc.start(now);
  osc.stop(now + sound.duration);
}