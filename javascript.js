const cat = document.getElementById('cat');
const meowSound = document.getElementById('meow-sound');
const purrSound = document.getElementById('purr-sound');

const walkFrames = ['images/cat1.png', 'images/cat2.png', 'images/cat3.png', 
'images/cat4.png', 'images/cat5.png', 'images/cat6.png', 'images/cat7.png',
'images/cat8.png', 'images/cat9.png'
];
const scaredFrame = 'images/scaredcat.png';
const happyFrame = 'images/happycat.png';
const bounceFrame = 'images/catbounce.png';

let direction = -1;
let position = 0;
let frameIndex = 0;
let speed = 5;
let walking = true;
let toggle = true;

async function walkCat() {
  while (true) {
    if (walking) {
      cat.style.bottom = '-30px';
      const screenWidth = window.innerWidth;
      const nextPos = position + direction * speed;
      if (nextPos + 70 >= screenWidth) {
          cat.style.left = screenWidth - 70 + 'px';
          await bounceCat(-1);
          cat.style.transform = `scaleX(${direction})`;
          direction *= -1;
      }
      else if (nextPos + 25 <= 0) {
          cat.style.left = -30 + 'px';
          await bounceCat(1);
          cat.style.transform = `scaleX(${direction})`;
          direction *= -1;
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

async function bounceCat(direction) {
  walking = false;
  cat.style.bottom = '5px';
  cat.src = bounceFrame;
  cat.style.transform = `scaleX(${-direction})`;
  await new Promise(resolve => setTimeout(resolve, 150));
  cat.style.bottom = '-30px';
  walking = true;
}

cat.addEventListener('click', () => {
  meowSound.currentTime = 0; 
  meowSound.play();
  purrSound.pause();
  purrSound.currentTime = 0;
  walking = false;
  const currentFrame = cat.src;
  cat.src = scaredFrame;
  cat.style.bottom = '-5px';
  cat.style.transform = `scaleX(${-direction})`;

  setTimeout(() => {
    if (toggle) {
      walking = true;
    }
    cat.style.bottom = '-30px';
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
  cat.style.bottom = '-30px';
  cat.addEventListener('mouseleave', () => {
    purrSound.pause();
    purrSound.currentTime = 0;
    if (toggle) {
      walking = true;
    }
    cat.src = currentFrame;
    cat.style.transform = `scaleX(${-direction})`;
  }, { once: true });
});

document.getElementById('faster-btn').addEventListener('click', () => {
  speed = Math.min(speed + 10, 200);
});
document.getElementById('slower-btn').addEventListener('click', () => {
  speed = Math.max(speed - 10, 1);
});
document.getElementById('enable-btn').addEventListener('click', () => {
  toggle = !toggle;
  walking = !walking;
});

walkCat();

async function loadProjects() {
  const response = await fetch('projects.json');
  let projects = await response.json();
  projects.sort((a, b) => new Date(b.date) - new Date(a.date));

  const container = document.getElementById('projects');
  projects.forEach(project => {
    container.innerHTML += `
      <div class="project-card hover-increase-size">
        <img src="${project.image}" alt="${project.name}" id="cover_image"/>
        <h3>${project.title}</h3>
        <p>${project.datte}</p>
      </div>
    `;
  });
}
loadProjects();