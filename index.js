const health = document.querySelector('.health');


const leftWall = document.querySelector('.leftWall').getBoundingClientRect().width; 
const topWall = document.querySelector('.topWall').getBoundingClientRect().height; 
const rightWall = document.querySelector('.topWall').getBoundingClientRect().width; 
const rightWallWidth = document.querySelector('.topWall').getBoundingClientRect().height; 
const bottomWall = document.querySelector('.rightWall').getBoundingClientRect().height; 
const blocks = document.querySelector('.blocks');

const platform = document.querySelector('.platform');
const platformInfo = platform.getBoundingClientRect();

const ball = document.querySelector('.ball');
const ballInfo = ball.getBoundingClientRect()

document.addEventListener('keydown', startGame); 
document.addEventListener('keydown', movePlatformWidhtBall); 

let healthPoint = 2;

health.innerHTML = `Health: ${healthPoint}`


let intervalMove;

let vx = 5, vy = -5;

const ballDiameter = ballInfo.height;

let posX = ballInfo.left + ballDiameter/2;
let posY = ballInfo.top - ballDiameter/2;
console.log (posX, posY)

const platformWidth = platformInfo.width;
const platformHeight = platformInfo.height; 
let platformPosX = platformInfo.left; 
const vPlatform = 10;



// создание группы блоков внутри тега blocks

const createBlocks = (i, j, color, id) => {
  return `
    <div class="block-row-${i} block-column-${j} block-${color} block"></div>
  `
};

for (let i = 1; i < 21; i++) {
  for (let j = 1; j < 6; j++) {
    let color = randomColor(1, 4);
    blocks.innerHTML += createBlocks(i, j, color);
  }
};

function randomColor (min, max) {
  if (Math.floor(Math.random()*(max - min)+min) === 1) {
    return 'blue';
  } else if (Math.floor(Math.random()*(max - min)+min) === 2) {
    return 'green';
  } else {
    return 'red';
  };
};

const block = document.querySelectorAll('.block');



// запуск игры, функционал движения мяча и платформы

function startGame (event) {
  if (event.keyCode === 32) {
  intervalMove = setInterval(moveBall, 1000/40);
  document.removeEventListener('keydown', startGame);
  document.removeEventListener('keydown', movePlatformWidhtBall);
  document.addEventListener('keydown', movePlatform);
  };
};

function movePlatform(event) {
  if(event.keyCode === 37) {
    platformPosX -= vPlatform;
  };
  if(event.keyCode == 39) {
    platformPosX += vPlatform;
  };
  if (platformPosX < leftWall) {
    platformPosX = leftWall;
  };
  if (platformPosX + platformWidth > rightWall) {
    platformPosX = rightWall - platformWidth;
  };
  platform.style.left = platformPosX + 'px';
};

function movePlatformWidhtBall(event) {
  if(event.keyCode === 37) {
    platformPosX -= vPlatform;
    posX -= vPlatform;
  };
  if(event.keyCode == 39) {
    platformPosX += vPlatform;
    posX += vPlatform;
  };
  if (platformPosX < leftWall) {
    platformPosX = leftWall;
    posX = platformPosX + platformWidth/2 - leftWall;
  };
  if (platformPosX + platformWidth + rightWallWidth > rightWall) {
    platformPosX = rightWall - rightWallWidth - platformWidth;
    posX = rightWall - rightWallWidth - platformWidth/2;
  };
  platform.style.left = platformPosX + 'px';
  ball.style.left = posX + 'px';
};

// механика перемещения шара в пространстве и контакта соприкосновения с границами и блоками

function moveBall () { 
  posX += vx // тут нужно допилить случайное присвоение начального вектора направления движения + либо -
  posY += vy;

  Object.values(block).map((elem) => {

    if (posX > elem.getBoundingClientRect().left && posX < elem.getBoundingClientRect().left + elem.getBoundingClientRect().width && posY - ballDiameter/2 < elem.getBoundingClientRect().top) {
      if(elem.classList.contains('block-red')) {
        elem.classList.remove('block-red');
        elem.classList.add('block-green');
      } else if (elem.classList.contains('block-green')) {
        elem.classList.remove('block-green');
        elem.classList.add('block-blue');
      } else {
        elem.classList.add('hide');
      }
      elem.classList.add('hide')
      vy = -vy
    };
    // нужно добавить условие, для касаний по правому и левому раю блока.
  });

  if (posX < leftWall) {
    posX = leftWall;
    vx = -vx;
  };
  if (posY < topWall) {
    posY = topWall;
    vy = -vy;
  };
  if (posX + ballDiameter + rightWallWidth > rightWall) {
    posX = rightWall - ballDiameter - rightWallWidth;
    vx = -vx;
  };
  if (posY > bottomWall - platformHeight - ballDiameter) {
    if (posX >= platformPosX&& posX <= platformPosX + platformInfo.width) {
      posY = bottomWall - platformHeight - ballDiameter;
      vy = -vy;
    };
  };
  ball.style.top = posY + 'px';
  ball.style.left = posX + 'px';

  if (posY + ballDiameter > bottomWall) {
    if (healthPoint === 1){
      clearInterval(intervalMove);
      document.removeEventListener('keydown', movePlatform);
      console.log('game over');
    } else {
      healthPoint -= 1;
      vy = -vy;
      health.innerHTML = `Health: ${healthPoint}`
    }
  };
};


