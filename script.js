/* ── Falling petals ── */
const petalContainer = document.getElementById('petals');
for (let i = 0; i < 35; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.cssText = `
    left: ${Math.random() * 100}vw;
    width: ${4 + Math.random() * 8}px;
    height: ${8 + Math.random() * 12}px;
    animation-duration: ${6 + Math.random() * 12}s;
    animation-delay: ${-Math.random() * 15}s;
    opacity: 0.3;
  `;
  petalContainer.appendChild(p);
}

/* ── Romantic Music Player with actual romantic tracks ── */
class RomanticMusic {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.currentTrack = 0;
    // Romantic piano tracks (royalty free from Pixabay)
    this.playlist = [
      'https://cdn.pixabay.com/download/audio/2022/10/25/audio_180e1b1d5b.mp3',
      'https://cdn.pixabay.com/download/audio/2022/05/16/audio_7f7a2b5c8e.mp3',
      'https://cdn.pixabay.com/download/audio/2022/03/17/audio_bb617db8a6.mp3'
    ];
    this.init();
  }

  init() {
    this.audio = new Audio();
    this.audio.loop = false;
    this.audio.volume = 0.25;
    this.loadTrack(0);

    this.audio.addEventListener('ended', () => {
      this.nextTrack();
    });

    document.getElementById('musicControl').addEventListener('click', () => this.toggle());
  }

  loadTrack(index) {
    this.currentTrack = index % this.playlist.length;
    this.audio.src = this.playlist[this.currentTrack];
    this.audio.load();
  }

  nextTrack() {
    this.loadTrack(this.currentTrack + 1);
    if (this.isPlaying) {
      this.audio.play().catch(e => console.log('Play error:', e));
    }
  }

  async play() {
    try {
      await this.audio.play();
      this.isPlaying = true;
      const musicBtn = document.getElementById('musicControl');
      musicBtn.innerHTML = '🎵';
      musicBtn.style.background = 'rgba(196,41,74,0.9)';
      musicBtn.style.boxShadow = '0 0 15px rgba(201,168,76,0.6)';
    } catch (e) {
      console.log('Auto-play prevented');
      this.isPlaying = false;
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    const musicBtn = document.getElementById('musicControl');
    musicBtn.innerHTML = '🔇';
    musicBtn.style.background = 'rgba(139,26,46,0.8)';
    musicBtn.style.boxShadow = 'none';
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  startOnInteraction() {
    if (!this.isPlaying) {
      this.play();
    }
  }
}

const romanticMusic = new RomanticMusic();

/* ── Game State ── */
let questions = [];
let images = [];
let current = 0;
let usedImages = [];
let shrinkCount = 0;
let yesClickCount = 0;
let currentNoScale = 1;

/* ── DOM Elements ── */
const noBtn = document.getElementById('btn-no');
const yesBtn = document.getElementById('btn-yes');
const attemptCounter = document.getElementById('attemptCounter');
const sizeIndicator = document.getElementById('sizeIndicator');

/* ── Load Questions from questions.txt ── */
async function loadQuestions() {
  try {
    const response = await fetch('questions.txt');
    const text = await response.text();
    questions = text.split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    if (questions.length === 0) {
      questions = ["Do you love me? 💕", "Do I make you happy? ✨", "Will you be my Valentine? 🌹"];
    }

    showQuestion();
  } catch (error) {
    console.error('Error loading questions:', error);
    questions = ["Do you love me? 💕", "Do I make you happy? ✨", "Will you be my Valentine? 🌹"];
    showQuestion();
  }
}

/* ── Load Images from images folder ── */
async function loadImages() {
  // For static hosting, we need to pre-define images or use a manifest
  // Alternative: List images manually or use a simple array
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const imageNames = [];

  // You can manually list your images here, or use a manifest.json approach
  // For simplicity, we'll try to load images from the images folder
  // Since we can't list directory contents in static hosting, you have two options:

  // Option 1: Manually list your images (recommended)
  // images = ['/images/photo1.jpg', '/images/photo2.jpg', '/images/photo3.jpg'];

  // Option 2: Create a manifest file (I'll help you with this)
  try {
    const manifestResponse = await fetch('images/manifest.json');
    const manifest = await manifestResponse.json();
    images = manifest.images.map(img => `/images/${img}`);
  } catch (error) {
    console.log('No manifest.json found, using default images');
    // Default placeholder images if none found
    images = [];
  }

  usedImages = [...images];

  if (images.length === 0) {
    console.log('No images found. Add photos to /images folder and create manifest.json');
  }
}

/* ── Create Image Manifest Helper ── */
// Run this function once to generate manifest.json
function generateManifest() {
  // This is just a helper - you'll need to manually create the manifest
  console.log('Create images/manifest.json with: {"images": ["photo1.jpg", "photo2.jpg"]}');
}

function showQuestion() {
  if (current >= questions.length) { showDone(); return; }
  const total = questions.length;
  document.getElementById('q-counter').textContent = `Question ${current + 1} of ${total}`;
  document.getElementById('question-text').textContent = questions[current];
  document.getElementById('progress-bar').style.width = `${(current / total) * 100}%`;

  shrinkCount = 0;
  currentNoScale = 1;
  updateNoButtonVisual();
  placeNoButton();
}

function updateNoButtonVisual() {
  const scale = Math.max(0.15, 1 - (shrinkCount * 0.085));
  currentNoScale = scale;
  noBtn.style.transform = `scale(${scale})`;
  noBtn.style.transition = 'transform 0.08s ease';
  const percent = Math.floor(scale * 100);
  sizeIndicator.innerHTML = `📏 NO size: ${percent}%`;

  if (scale < 0.4) {
    noBtn.style.background = 'rgba(100,20,35,0.5)';
    noBtn.style.border = '1px solid rgba(201,168,76,0.3)';
  } else if (scale < 0.6) {
    noBtn.style.background = 'rgba(139,26,46,0.6)';
  } else {
    noBtn.style.background = 'rgba(139,26,46,0.8)';
  }
}

function shrinkNoButton() {
  shrinkCount++;
  currentNoScale = Math.max(0.15, 1 - (shrinkCount * 0.085));
  updateNoButtonVisual();
  attemptCounter.innerHTML = `💢 NO shrunk: ${shrinkCount} times`;

  noBtn.style.animation = 'shrinkWobble 0.15s ease';
  setTimeout(() => {
    noBtn.style.animation = '';
  }, 150);

  if (currentNoScale < 0.3) {
    const randomX = Math.random() * (window.innerWidth - 80);
    const randomY = Math.random() * (window.innerHeight - 60);
    noBtn.style.left = Math.max(5, Math.min(window.innerWidth - 80, randomX)) + 'px';
    noBtn.style.top = Math.max(5, Math.min(window.innerHeight - 50, randomY)) + 'px';
  }
}

function growYesButton() {
  yesClickCount++;

  yesBtn.classList.remove('permanent-grow', 'permanent-grow-2x', 'permanent-grow-3x');

  if (yesClickCount >= 6) {
    yesBtn.classList.add('permanent-grow-3x');
    yesBtn.style.transform = 'scale(1.6)';
  } else if (yesClickCount >= 3) {
    yesBtn.classList.add('permanent-grow-2x');
    yesBtn.style.transform = 'scale(1.4)';
  } else if (yesClickCount >= 1) {
    yesBtn.classList.add('permanent-grow');
    yesBtn.style.transform = 'scale(1.2)';
  }

  yesBtn.classList.add('grow-animation');
  setTimeout(() => {
    yesBtn.classList.remove('grow-animation');
  }, 300);

  yesBtn.style.boxShadow = '0 0 50px rgba(196,41,74,0.9)';
  setTimeout(() => {
    yesBtn.style.boxShadow = '0 4px 20px rgba(196,41,74,0.5)';
  }, 300);
}

function placeNoButton() {
  const yesRect = yesBtn.getBoundingClientRect();
  const margin = 30;
  let left = yesRect.right + margin;
  let top = yesRect.top;

  const noBtnWidth = 100;
  if (left + noBtnWidth > window.innerWidth - margin) {
    left = yesRect.left - noBtnWidth - margin;
  }
  top = Math.max(margin, Math.min(window.innerHeight - 60, top));
  left = Math.max(margin, Math.min(window.innerWidth - noBtnWidth - margin, left));

  noBtn.style.left = left + 'px';
  noBtn.style.top = top + 'px';
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes shrinkWobble {
    0% { transform: scale(${currentNoScale}) rotate(0deg); }
    25% { transform: scale(${currentNoScale * 0.7}) rotate(-3deg); }
    75% { transform: scale(${currentNoScale * 0.8}) rotate(3deg); }
    100% { transform: scale(${currentNoScale}) rotate(0deg); }
  }
  @keyframes floatUp {
    0% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-40px); }
  }
  @keyframes massiveGrow {
    0% { transform: scale(1); }
    50% { transform: scale(1.4); box-shadow: 0 0 30px rgba(196,41,74,0.8); }
    100% { transform: scale(1.2); box-shadow: 0 4px 25px rgba(196,41,74,0.6); }
  }
  .btn-yes.grow-animation {
    animation: massiveGrow 0.3s ease-out forwards;
  }
  .btn-yes.permanent-grow { transform: scale(1.2); }
  .btn-yes.permanent-grow-2x { transform: scale(1.4); }
  .btn-yes.permanent-grow-3x { transform: scale(1.6); }
`;
document.head.appendChild(style);

/* ── Mouse tracking for NO button evasion ── */
document.addEventListener('mousemove', (e) => {
  if (current >= questions.length) return;
  if (!noBtn) return;

  const noRect = noBtn.getBoundingClientRect();
  const btnCX = noRect.left + noRect.width / 2;
  const btnCY = noRect.top + noRect.height / 2;
  const dx = e.clientX - btnCX;
  const dy = e.clientY - btnCY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const dangerZone = 150;
  const shrinkZone = 100;

  if (dist < dangerZone) {
    if (dist < shrinkZone && shrinkCount < 12) {
      shrinkNoButton();
    }

    const angle = Math.atan2(dy, dx);
    const escapeForce = Math.min(200, (dangerZone - dist) * 2.5);
    const fleeX = Math.cos(angle + Math.PI) * (escapeForce + 80);
    const fleeY = Math.sin(angle + Math.PI) * (escapeForce + 80);

    let newLeft = noRect.left + fleeX;
    let newTop = noRect.top + fleeY;

    const margin = 10;
    newLeft = Math.max(margin, Math.min(window.innerWidth - noRect.width - margin, newLeft));
    newTop = Math.max(margin, Math.min(window.innerHeight - noRect.height - margin, newTop));

    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';

    if (dist < shrinkZone && Math.random() > 0.7) {
      growYesButton();
    }
  }
});

// Touch support
document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  document.dispatchEvent(new MouseEvent('mousemove', {
    clientX: t.clientX, clientY: t.clientY
  }));
}, { passive: false });

// NO button click
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (current >= questions.length) return;

  for (let i = 0; i < 3; i++) {
    setTimeout(() => shrinkNoButton(), i * 30);
  }

  const randomX = Math.random() * (window.innerWidth - 100);
  const randomY = Math.random() * (window.innerHeight - 60);
  noBtn.style.left = Math.max(5, Math.min(window.innerWidth - 100, randomX)) + 'px';
  noBtn.style.top = Math.max(5, Math.min(window.innerHeight - 60, randomY)) + 'px';

  growYesButton();
  growYesButton();

  showFloatingMessage('💨 Nice try!', e.clientX, e.clientY);
});

function showFloatingMessage(msg, x, y) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.position = 'fixed';
  div.style.left = x + 'px';
  div.style.top = y + 'px';
  div.style.color = 'var(--gold-soft)';
  div.style.fontSize = '0.8rem';
  div.style.fontFamily = 'monospace';
  div.style.pointerEvents = 'none';
  div.style.zIndex = '2000';
  div.style.animation = 'floatUp 0.8s ease-out forwards';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 800);
}

/* ── YES button reward ── */
function pickImage() {
  if (usedImages.length === 0) usedImages = [...images];
  if (usedImages.length === 0) return null;
  const idx = Math.floor(Math.random() * usedImages.length);
  return usedImages.splice(idx, 1)[0];
}

const captions = [
  "💕 I knew it!", "✨ You're amazing!", "🌹 My heart belongs to you",
  "💫 Forever and always", "🥰 You make me so happy", "💞 Every time, yes!",
  "💖 I love you more each day", "🌸 You're my everything", "💗 Perfect answer, as always"
];

function showReward() {
  const overlay = document.getElementById('reward-overlay');
  const img = document.getElementById('reward-img');
  const caption = document.getElementById('reward-caption');
  const timerEl = document.getElementById('reward-timer');
  const imgSrc = pickImage();

  if (imgSrc) {
    img.src = imgSrc;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }

  caption.textContent = captions[Math.floor(Math.random() * captions.length)];
  overlay.classList.add('show');

  let secs = 3;
  timerEl.textContent = `continuing in ${secs}…`;
  const interval = setInterval(() => {
    secs--;
    if (secs <= 0) {
      clearInterval(interval);
      overlay.classList.remove('show');
      current++;
      showQuestion();
    } else {
      timerEl.textContent = `continuing in ${secs}…`;
    }
  }, 1000);
}

document.getElementById('btn-yes').addEventListener('click', () => {
  if (current >= questions.length) return;
  showReward();
  growYesButton();

  if (shrinkCount > 0) {
    shrinkCount = Math.max(0, shrinkCount - 1);
    updateNoButtonVisual();
  }
});

function showDone() {
  document.getElementById('question-screen').style.display = 'none';
  document.getElementById('done-screen').classList.add('show');
  noBtn.style.display = 'none';
  document.getElementById('progress-bar').style.width = '100%';
  document.getElementById('attemptCounter').style.background = 'rgba(201,168,76,0.3)';
  document.getElementById('sizeIndicator').style.opacity = '0';
}

/* ── Initialize ── */
window.addEventListener('load', async () => {
  await loadQuestions();
  await loadImages();
  setTimeout(() => placeNoButton(), 100);

  document.body.addEventListener('click', () => {
    romanticMusic.startOnInteraction();
  }, { once: true });

  setTimeout(() => {
    const msg = document.createElement('div');
    msg.textContent = '💕 Try to catch the NO button! It shrinks fast! 💕';
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = 'rgba(0,0,0,0.8)';
    msg.style.color = 'var(--gold-soft)';
    msg.style.padding = '12px 24px';
    msg.style.borderRadius = '40px';
    msg.style.fontSize = '0.9rem';
    msg.style.zIndex = '1000';
    msg.style.border = '1px solid var(--gold)';
    msg.style.whiteSpace = 'nowrap';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }, 1500);
});

window.addEventListener('resize', () => {
  placeNoButton();
});