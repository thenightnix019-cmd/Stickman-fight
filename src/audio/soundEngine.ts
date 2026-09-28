/**
 * Procedural Web Audio Sound Engine for Stick Arena
 * Fully self-contained, zero external asset dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playJump() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playDoubleJump() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.14);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playPunch() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.09);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playSword() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Metallic slash chime + noise
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.15);

    oscGain.gain.setValueAtTime(0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  public playGunShot() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playRocketLaunch() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.linearRampToValueAtTime(350, t + 0.2);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playExplosion() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.45);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.46);
  }

  public playRope() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.16);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  public playAxe() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Heavy low woosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.16);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.19);

    // Metallic blade ring
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(900, t + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(260, t + 0.15);

    gain2.gain.setValueAtTime(0.18, t + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.03);
    osc2.stop(t + 0.16);
  }

  public playMagnet() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(240, t + 0.1);
    osc.frequency.linearRampToValueAtTime(180, t + 0.2);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  public playPowerUp() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.18, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.13);
    });
  }

  public playHit() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  public playDeath() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  public playEventAlert() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [440, 554, 659].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.22);
    });
  }

  public playRouletteTick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playButton() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + 0.06);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  public playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 392, d: 0.15 }, // G
      { f: 523.25, d: 0.15 }, // C
      { f: 659.25, d: 0.15 }, // E
      { f: 783.99, d: 0.4 }, // G
    ];

    let curr = t;
    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, curr);

      gain.gain.setValueAtTime(0.25, curr);
      gain.gain.exponentialRampToValueAtTime(0.001, curr + n.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(curr);
      osc.stop(curr + n.d + 0.02);
      curr += n.d;
    });
  }

  public playInfect() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.3);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  // ==================== BACKGROUND MUSIC (BGM) ====================
  public musicEnabled: boolean = true;
  public musicVolume: number = 0.35;
  private bgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmMasterGain: GainNode | null = null;
  private bgmStep: number = 0;
  private nextNoteTime: number = 0;

  public initBGM() {
    if (!this.bgmMasterGain && this.ctx) {
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
      this.bgmMasterGain.connect(this.ctx.destination);
    }
  }

  public startBGM() {
    if (this.bgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;
    this.initBGM();

    this.bgmPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.bgmStep = 0;

    // Scheduler tick every 40ms to schedule ahead
    this.bgmIntervalId = window.setInterval(() => {
      this.scheduleBGM();
    }, 40);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public toggleBGM(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.bgmMasterGain && this.ctx) {
      this.bgmMasterGain.gain.setValueAtTime(
        this.musicEnabled ? this.musicVolume : 0,
        this.ctx.currentTime
      );
    }
    if (this.musicEnabled && !this.bgmPlaying) {
      this.startBGM();
    }
    return this.musicEnabled;
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.bgmMasterGain && this.ctx && this.musicEnabled) {
      this.bgmMasterGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  private scheduleBGM() {
    if (!this.bgmPlaying || !this.ctx || !this.bgmMasterGain) return;

    // Tempo: 128 BPM -> 16th note = 60 / 128 / 4 = 0.1171875s
    const secondsPer16th = 0.1171875;
    const scheduleAheadTime = 0.25;

    // Bassline root notes (C minor pentatonic progression: C -> Eb -> F -> G)
    const bassPatterns = [
      130.81, 0, 130.81, 0, 155.56, 0, 174.61, 0,
      130.81, 0, 130.81, 130.81, 196.00, 0, 174.61, 155.56,
      116.54, 0, 116.54, 0, 130.81, 0, 155.56, 0,
      130.81, 130.81, 0, 130.81, 196.00, 174.61, 155.56, 130.81,
    ];

    // Melodic Arp Notes (Hz)
    const arpNotes = [
      261.63, 311.13, 392.00, 523.25, 392.00, 311.13, 261.63, 392.00,
      311.13, 392.00, 523.25, 622.25, 523.25, 392.00, 311.13, 392.00,
      233.08, 293.66, 349.23, 466.16, 349.23, 293.66, 233.08, 349.23,
      261.63, 311.13, 392.00, 523.25, 587.33, 523.25, 392.00, 311.13,
    ];

    while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
      const t = this.nextNoteTime;
      const step = this.bgmStep % 32;

      if (this.musicEnabled) {
        // 1. Kick on beats 0, 4, 8, 12, 16, 20, 24, 28
        if (step % 4 === 0) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(140, t);
          kickOsc.frequency.exponentialRampToValueAtTime(38, t + 0.08);

          kickGain.gain.setValueAtTime(0.38, t);
          kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

          kickOsc.connect(kickGain);
          kickGain.connect(this.bgmMasterGain);
          kickOsc.start(t);
          kickOsc.stop(t + 0.1);
        }

        // 2. Snare / Clack on beats 4, 12, 20, 28
        if (step % 8 === 4) {
          const snareOsc = this.ctx.createOscillator();
          const snareGain = this.ctx.createGain();
          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(220, t);
          snareOsc.frequency.exponentialRampToValueAtTime(80, t + 0.07);

          snareGain.gain.setValueAtTime(0.2, t);
          snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

          snareOsc.connect(snareGain);
          snareGain.connect(this.bgmMasterGain);
          snareOsc.start(t);
          snareOsc.stop(t + 0.09);
        }

        // 3. Hi-hat on offbeats
        if (step % 2 === 1) {
          const hatOsc = this.ctx.createOscillator();
          const hatGain = this.ctx.createGain();
          hatOsc.type = 'sawtooth';
          hatOsc.frequency.setValueAtTime(9500, t);

          hatGain.gain.setValueAtTime(0.06, t);
          hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

          hatOsc.connect(hatGain);
          hatGain.connect(this.bgmMasterGain);
          hatOsc.start(t);
          hatOsc.stop(t + 0.05);
        }

        // 4. Bassline
        const bassFreq = bassPatterns[step];
        if (bassFreq > 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sawtooth';
          bassOsc.frequency.setValueAtTime(bassFreq, t);

          bassGain.gain.setValueAtTime(0.18, t);
          bassGain.gain.exponentialRampToValueAtTime(0.001, t + secondsPer16th * 0.9);

          bassOsc.connect(bassGain);
          bassGain.connect(this.bgmMasterGain);
          bassOsc.start(t);
          bassOsc.stop(t + secondsPer16th);
        }

        // 5. Arp Lead (smooth arcade chiptune vibe)
        const arpFreq = arpNotes[step];
        if (arpFreq) {
          const arpOsc = this.ctx.createOscillator();
          const arpGain = this.ctx.createGain();
          arpOsc.type = 'square';
          arpOsc.frequency.setValueAtTime(arpFreq, t);

          arpGain.gain.setValueAtTime(0.07, t);
          arpGain.gain.exponentialRampToValueAtTime(0.001, t + secondsPer16th * 0.75);

          arpOsc.connect(arpGain);
          arpGain.connect(this.bgmMasterGain);
          arpOsc.start(t);
          arpOsc.stop(t + secondsPer16th * 0.8);
        }
      }

      this.nextNoteTime += secondsPer16th;
      this.bgmStep++;
    }
  }
}

export const sounds = new SoundEngine();
