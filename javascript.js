const cat = document.getElementById('cat');
const meowSound = document.getElementById('meow-sound');
const purrSound = document.getElementById('purr-sound');

const walkFrames = ['images/cat1.png', 'images/cat2.png', 'images/cat3.png', 
'images/cat4.png', 'images/cat5.png', 'images/cat6.png', 'images/cat7.png',
'images/cat8.png', 'images/cat9.png'
];
const scaredFrame = 'images/scaredcat.png';
const happyFrame = 'images/happycat.png';

let direction = -1;
let position = 0;
let frameIndex = 0;
const speed = 5;
let walking = true;

async function walkCat() {
  while (true) {
    const screenWidth = window.innerWidth;
    if (walking) {
      const nextPos = position + direction * speed;
      if (nextPos + cat.offsetWidth > screenWidth) {
        direction = -1;
      } else if (nextPos < 0) {
        direction = 1;
      }

      position += direction * speed;
      cat.style.left = position + 'px';

      cat.style.transform = `scaleX(${-direction})`;

      frameIndex = (frameIndex + 1) % walkFrames.length;
      cat.src = walkFrames[frameIndex];
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

cat.addEventListener('click', () => {
  meowSound.currentTime = 0; 
  meowSound.play();
  purrSound.pause();
  purrSound.currentTime = 0;
  walking = false;
  const currentFrame = cat.src;
  cat.src = scaredFrame;
  cat.style.transform = `scaleX(${-direction})`;

  setTimeout(() => {
    walking = true;
    cat.src = currentFrame;
    meowSound.pause();
    meowSound.currentTime = 0;
    cat.style.transform = `scaleX(${-direction})`;
  }, 1000);
});

cat.addEventListener('mouseover', () => {
  purrSound.currentTime = 0; 
  purrSound.play();
  walking = false;
  const currentFrame = cat.src;
  cat.src = happyFrame;
  cat.style.transform = `scaleX(${-direction})`;

  cat.addEventListener('mouseleave', () => {
    purrSound.pause();
    purrSound.currentTime = 0;
    walking = true;
    cat.src = currentFrame;
    cat.style.transform = `scaleX(${-direction})`;
  }, { once: true });
});

walkCat();
