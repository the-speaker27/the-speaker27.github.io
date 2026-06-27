/* ==========================================
   ROMANTIC LOGIC AND EFFECTS FOR TAPASYA & SUBHAM
   ========================================== */

// --- AUDIO SYSTEM (Web Audio API & Audio Element) ---
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicController = document.getElementById('music-controller');
let audioContext = null;
let synthInterval = null;
let isAudioRunning = false;
let synthActive = false;

// Procedural synthesizer as a fallback or extra romantic melody
function initProceduralMusic() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        isAudioRunning = true;
    } catch (e) {
        console.warn('Web Audio API not supported', e);
    }
}

function playHarpChime() {
    if (!audioContext) initProceduralMusic();
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (!audioContext) return;

    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50]; // C5, D5, E5, G5, A5, B5, C6
    const now = audioContext.currentTime;

    notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);
        
        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.45);
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.5);
    });
}

function startProceduralMelody() {
    if (!audioContext) initProceduralMusic();
    if (!audioContext) return;
    
    synthActive = true;
    let step = 0;
    // Romantic Arpeggio Progression (Cmaj9 - Amin9 - Fmaj7 - G11)
    const progressions = [
        [261.63, 329.63, 392.00, 493.88, 587.33], // C, E, G, B, D (Cmaj9)
        [220.00, 261.63, 329.63, 392.00, 493.88], // A, C, E, G, B (Amin9)
        [174.61, 220.00, 261.63, 329.63, 349.23], // F, A, C, E, F (Fmaj7)
        [196.00, 246.94, 293.66, 349.23, 440.00]  // G, B, D, F, A (G11)
    ];

    function playNote(freq, time, duration) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, time);
        filter.Q.setValueAtTime(1, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.06, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(time);
        osc.stop(time + duration);
    }

    function playTick() {
        if (!synthActive) return;
        const now = audioContext.currentTime;
        const chordIndex = Math.floor(step / 8) % progressions.length;
        const noteIndex = step % 8;
        const chord = progressions[chordIndex];
        
        let freq;
        if (noteIndex < 5) {
            freq = chord[noteIndex];
        } else if (noteIndex === 5) {
            freq = chord[3];
        } else if (noteIndex === 6) {
            freq = chord[2];
        } else {
            freq = chord[1];
        }
        
        playNote(freq, now, 1.2);
        step++;
    }

    // Play initial tick
    playTick();
    synthInterval = setInterval(playTick, 350); // Gentle arpeggio rhythm
}

function stopProceduralMelody() {
    synthActive = false;
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

function startMusic() {
    bgMusic.volume = 0.5;
    bgMusic.play()
        .then(() => {
            isAudioRunning = true;
            musicController.classList.remove('muted');
        })
        .catch(err => {
            console.log("Audio autoplay prevented, falling back to Web Audio synth or waiting for toggle click.");
            // Autoplay blocked, activate procedural synth immediately
            startProceduralMelody();
            musicController.classList.remove('muted');
        });
}

function toggleMusic() {
    if (isAudioRunning) {
        bgMusic.pause();
        stopProceduralMelody();
        isAudioRunning = false;
        musicController.classList.add('muted');
    } else {
        bgMusic.play()
            .then(() => {
                isAudioRunning = true;
                musicController.classList.remove('muted');
            })
            .catch(() => {
                // If audio still fails, trigger procedural synth
                startProceduralMelody();
                isAudioRunning = true;
                musicController.classList.remove('muted');
            });
    }
}

musicToggle.addEventListener('click', toggleMusic);

// --- NAVIGATION FLOW ---
const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dot');
const dotsNav = document.getElementById('dots-nav');
const envelope = document.getElementById('envelope');
const heartSeal = document.getElementById('heart-seal');

// Navigation click listeners
document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-next');
        navigateTo(nextId);
    });
});

document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
        const prevId = btn.getAttribute('data-prev');
        navigateTo(prevId);
    });
});

// Dot Navigation click listeners
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const targetId = dot.getAttribute('data-target');
        navigateTo(targetId);
    });
});

function navigateTo(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Show/hide navigation dots
        if (pageId === 'page-welcome' || pageId === 'page-proposal') {
            dotsNav.style.display = 'none';
        } else {
            dotsNav.style.display = 'flex';
            // Update active dot
            dots.forEach(dot => {
                if (dot.getAttribute('data-target') === pageId) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Trigger typewriter animation if arriving on letter page
        if (pageId === 'page-letter') {
            runTypewriter();
        }
    }
}

// Envelope Wax Seal Interaction
heartSeal.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid double trigger
    openEnvelope();
});

envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
        openEnvelope();
    }
});

function openEnvelope() {
    envelope.classList.add('open');
    playHarpChime();
    
    // Start background music controller visibility and playing
    musicController.style.display = 'block';
    startMusic();

    // Smooth transition to letter page after envelope animations finish
    setTimeout(() => {
        navigateTo('page-letter');
    }, 1500);
}

// --- TYPEWRITER EFFECT ---
const letterText = `Dear Tapasya,

From the moment our paths crossed, my world has changed in the most beautiful ways. Your laughter has a way of brightening even my darkest days, and your kindness inspires me to be a better person.

I made this little space just for you, hoping to express what words alone often fail to capture. Please take a small stroll with me through these pages...`;

let typewriterRan = false;
function runTypewriter() {
    if (typewriterRan) return; // Run once only
    typewriterRan = true;
    
    const container = document.getElementById('typewriter-letter');
    container.innerHTML = ''; // Clear initial placeholder HTML
    
    let index = 0;
    function type() {
        if (index < letterText.length) {
            const char = letterText.charAt(index);
            if (char === '\n') {
                container.innerHTML += '<br>';
            } else {
                container.innerHTML += char;
            }
            index++;
            setTimeout(type, 35); // Smooth typewriter speed
        }
    }
    type();
}

// --- CARD FLIPPING ---
function flipCard(card) {
    card.classList.toggle('flipped');
    // Play a tiny sweet click sound/chime procedurally
    if (audioContext && isAudioRunning) {
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.frequency.setValueAtTime(659.25, now); // E5 note
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}

// --- FLOATING HEARTS CANVAS (AMBIENT) ---
const canvasHearts = document.getElementById('canvas-hearts');
const ctxHearts = canvasHearts.getContext('2d');
let heartsArray = [];

function resizeCanvas() {
    canvasHearts.width = window.innerWidth;
    canvasHearts.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class HeartParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvasHearts.height; // Start at random Y initially so the screen isn't empty
    }

    reset() {
        this.x = Math.random() * canvasHearts.width;
        this.y = canvasHearts.height + Math.random() * 50;
        this.size = Math.random() * 14 + 6;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.15;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = Math.random() * 0.01 - 0.005;
        this.color = Math.random() > 0.5 ? 'rgba(244, 143, 177, opacity)' : 'rgba(224, 64, 96, opacity)';
    }

    draw() {
        ctxHearts.save();
        ctxHearts.translate(this.x, this.y);
        ctxHearts.rotate(this.rotation);
        ctxHearts.beginPath();
        
        const size = this.size;
        ctxHearts.moveTo(0, -size / 4);
        // Draw heart shape
        ctxHearts.bezierCurveTo(size / 2, -size / 2 - size / 4, size, -size / 4, 0, size);
        ctxHearts.bezierCurveTo(-size, -size / 4, -size / 2, -size / 2 - size / 4, 0, -size / 4);
        
        ctxHearts.fillStyle = this.color.replace('opacity', this.opacity);
        ctxHearts.fill();
        ctxHearts.restore();
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        // Wrap around sides
        if (this.x < -20 || this.x > canvasHearts.width + 20) {
            this.speedX *= -1;
        }

        // Fade out near top
        if (this.y < 100) {
            this.opacity -= 0.005;
        }

        if (this.y < -30 || this.opacity <= 0) {
            this.reset();
        }
    }
}

function initHearts() {
    heartsArray = [];
    const count = Math.min(45, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < count; i++) {
        heartsArray.push(new HeartParticle());
    }
}
initHearts();

function animateHearts() {
    ctxHearts.clearRect(0, 0, canvasHearts.width, canvasHearts.height);
    for (let i = 0; i < heartsArray.length; i++) {
        heartsArray[i].update();
        heartsArray[i].draw();
    }
    requestAnimationFrame(animateHearts);
}
animateHearts();


// --- RUNAWAY NO BUTTON LOGIC ---
const btnNo = document.getElementById('btn-no');

function teleportNoButton() {
    // Determine screen safe area bounds
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;
    
    // Maintain a padding from edges
    const padding = 40;
    
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    
    // Choose random coordinate
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    // Set position absolutely on screen
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
    btnNo.style.zIndex = '9999';
    
    // Play a tiny, cute failed beep noise
    if (audioContext && isAudioRunning) {
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.frequency.setValueAtTime(220, now); // Low A note
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }
}

// Mouse hover triggers runaway
btnNo.addEventListener('mouseover', () => {
    teleportNoButton();
});

// Mobile touch start triggers runaway (ensures touchscreens can't tap it!)
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Stop actual tap
    teleportNoButton();
});


// --- CONFETTI & FIREWORKS SYSTEM ---
const canvasConfetti = document.getElementById('canvas-confetti');
const ctxConfetti = canvasConfetti.getContext('2d');
let confettiParticles = [];
let fireworkParticles = [];
let animationFrameId = null;

function resizeConfettiCanvas() {
    canvasConfetti.width = window.innerWidth;
    canvasConfetti.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

class Confetti {
    constructor() {
        this.x = Math.random() * canvasConfetti.width;
        this.y = -20 - Math.random() * 100;
        this.size = Math.random() * 8 + 6;
        this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 4 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
    }

    draw() {
        ctxConfetti.save();
        ctxConfetti.translate(this.x, this.y);
        ctxConfetti.rotate(this.rotation * Math.PI / 180);
        ctxConfetti.fillStyle = this.color;
        ctxConfetti.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctxConfetti.restore();
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvasConfetti.height + 20) {
            this.y = -20;
            this.x = Math.random() * canvasConfetti.width;
            this.speedY = Math.random() * 4 + 4;
        }
    }
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        const count = 40;
        const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.2;
            const velocity = Math.random() * 5 + 2;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                alpha: 1,
                decay: Math.random() * 0.015 + 0.01,
                color: color
            });
        }
    }

    draw() {
        this.particles.forEach(p => {
            ctxConfetti.save();
            ctxConfetti.globalAlpha = p.alpha;
            ctxConfetti.beginPath();
            ctxConfetti.arc(p.x, p.y, Math.random() * 2 + 1.5, 0, Math.PI * 2);
            ctxConfetti.fillStyle = p.color;
            ctxConfetti.shadowBlur = 8;
            ctxConfetti.shadowColor = p.color;
            ctxConfetti.fill();
            ctxConfetti.restore();
        });
    }

    update() {
        let active = false;
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; // Gravity pull
            p.alpha -= p.decay;
            if (p.alpha > 0) active = true;
        });
        return active;
    }
}

function launchRandomFirework() {
    const x = Math.random() * canvasConfetti.width;
    const y = Math.random() * (canvasConfetti.height * 0.6) + 100;
    fireworkParticles.push(new Firework(x, y));
    
    // Cute firework sound procedurally
    if (audioContext && isAudioRunning) {
        const now = audioContext.currentTime;
        // Pop sound
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 + Math.random() * 300, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }
}

function startCelebration() {
    confettiParticles = [];
    fireworkParticles = [];
    for (let i = 0; i < 100; i++) {
        confettiParticles.push(new Confetti());
    }

    let fireworkTimer = 0;

    function animateCelebration() {
        ctxConfetti.clearRect(0, 0, canvasConfetti.width, canvasConfetti.height);
        
        // Confetti
        confettiParticles.forEach(c => {
            c.update();
            c.draw();
        });

        // Fireworks
        fireworkParticles = fireworkParticles.filter(f => {
            const active = f.update();
            f.draw();
            return active;
        });

        fireworkTimer++;
        if (fireworkTimer % 45 === 0) {
            launchRandomFirework();
        }

        animationFrameId = requestAnimationFrame(animateCelebration);
    }

    animateCelebration();
}

function stopCelebration() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        ctxConfetti.clearRect(0, 0, canvasConfetti.width, canvasConfetti.height);
    }
}


// --- THE YES BUTTON CELEBRATION ---
const btnYes = document.getElementById('btn-yes');
const proposalBox = document.getElementById('proposal-box');
const successBox = document.getElementById('success-box');
const whatsappLink = document.getElementById('whatsapp-link');

btnYes.addEventListener('click', () => {
    proposalBox.style.display = 'none';
    successBox.style.display = 'block';
    
    // Dynamic WhatsApp Link generation
    const subhamNumber = ""; // User can add phone number if desired, otherwise standard share link
    const waText = "Yes Subham! I read your beautiful letter, and I accept your proposal! I would love to marry you and spend my life with you! ❤️💍";
    whatsappLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    
    // Play celebratory sound progression
    if (audioContext && isAudioRunning) {
        stopProceduralMelody(); // Turn off repeating synth arpeggios
        
        // Joyful chime chord
        const now = audioContext.currentTime;
        const majorChord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        
        majorChord.forEach((freq, idx) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0, now + idx * 0.05);
            gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.2);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 1.5);
        });
    }

    // Launch fireworks and confetti!
    startCelebration();
});
