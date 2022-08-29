const firstScreen = document.querySelector('.options-and-rules');
const game = document.querySelector('.game');
const restart = document.querySelector('.restart');
const startButton = document.querySelector('.options-and-rules__button');
const restartButton = document.querySelector('.restart__button');

const advancedLevel = document.querySelector('.options-level__number');
const healthNumber = document.querySelector('.options-health__number');

let difficultLevel;
let setHealth;

let score = 0;
let level = 1;

startButton.addEventListener('click', () => {
  difficultLevel = advancedLevel.value;
  setHealth = healthNumber.value;
  firstScreen.classList.add('hide');
  game.classList.remove('hide');
  createGameBlock();
});


function createGameBlock() {
  const health = document.querySelector('.health');
  const levelNumber = document.querySelector('.level');
  const scoreNumber = document.querySelector('.score');
  
  const leftWall = document.querySelector('.leftWall').getBoundingClientRect().width; 
  const topWall = document.querySelector('.topWall').getBoundingClientRect().height; 
  const rightWall = document.querySelector('.topWall').getBoundingClientRect().width; 
  const rightWallWidth = document.querySelector('.topWall').getBoundingClientRect().height; 
  const bottomWall = document.querySelector('.rightWall').getBoundingClientRect().height; 
  const blocks = document.querySelector('.blocks');
  
  const platform = document.querySelector('.platform');
  const platformInfo = platform.getBoundingClientRect();
  
  const ball = document.querySelector('.ball');
  const ballInfo = ball.getBoundingClientRect();
  
  document.addEventListener('keydown', startGame); 
  document.addEventListener('keydown', movePlatformWihtBall); 
  
  let healthPoint = setHealth;
  health.innerHTML = `Health: ${healthPoint}`;
  
  
  levelNumber.innerHTML = `Level: ${level}`;
  
  
  scoreNumber.innerHTML = `Score: ${score}`;
  
  let intervalMove;
  
  let vx = 5, vy = -5;
  
  const ballDiameter = ballInfo.height;

  let posX = ballInfo.left + ballDiameter/2;
  let posY = ballInfo.top;
  // let ballBottomSide = posY + ballInfo.height;

  
  const platformWidth = platformInfo.width;
  const platformHeight = platformInfo.height; 
  let platformPosX = platformInfo.left; 
  const vPlatform = 15;
  
  // создание группы блоков внутри тега blocks
  
  function renderBlocks () {
    const createBlocks = (i, j, color) => {
      return `<div class="block-row-${i} block-column-${j} block-${color} block"></div>`;
    };
    
    for (let i = 1; i < 21; i++) {
      for (let j = 1; j < 6; j++) {
        let color = randomColor(1, 4);
        blocks.innerHTML += createBlocks(i, j, color);
      };
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
  };
  renderBlocks();
    
  let block = document.querySelectorAll('.block');
  
  // запуск игры, функционал движения мяча и платформы
  
  function startGame (event) {
    if (event.keyCode === 32) {
      intervalMove = setInterval(moveBall, 1000/40);
      document.removeEventListener('keydown', startGame);
      document.removeEventListener('keydown', movePlatformWihtBall);
      document.addEventListener('keydown', movePlatform);
      if (level >= difficultLevel) {
        fallShells();
      };
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
  
  function movePlatformWihtBall(event) {
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
    posX += vx; 
    posY += vy;

    //взаимодействие со стенами и платформой

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
      if (posX >= platformPosX - ballDiameter && posX <= platformPosX + platformInfo.width) {
        posY = bottomWall - platformHeight - ballDiameter;
        vy = -vy;
      };
    };
    ball.style.top = posY + 'px';
    ball.style.left = posX + 'px';
  
    // при попадании мяча в запретную зону, убрать HP или закончить игру.
  
    if (posY + ballDiameter > bottomWall) {
      death();
    };

    // взаимодействие с блоками

    function contactWithBlock() {
      Object.values(block).map((elem) => {
        let elemTop = elem.getBoundingClientRect().top;
        let elemBottom = elem.getBoundingClientRect().top + elem.getBoundingClientRect().height;
        let elemLeft = elem.getBoundingClientRect().left;
        let elemRight = elem.getBoundingClientRect().left + elem.getBoundingClientRect().width;

        if (posY + ballDiameter/4 < elemBottom && posY > elemTop && posX > elemLeft && posX < elemRight) {
          removeBlock(elem);
          vy = -vy;
        };
        if (posX + ballDiameter + ballDiameter/4 > elemLeft && posX < elemRight && posY + ballDiameter/2  > elemTop && posY + ballDiameter/2 < elemBottom) {
          removeBlock(elem);
          vx = -vx;
        };
        if (posX - ballDiameter/2 < elemRight && posX > elemLeft && posY + ballDiameter/2 > elemTop && posY + ballDiameter/2 < elemBottom) {
          removeBlock(elem);
          vx = -vx;
        };
         if (posY + ballDiameter/2 + ballInfo.height > elemTop && posY + ballInfo.height < elemBottom && posX > elemLeft && posX < elemRight) {
          removeBlock(elem);
          vy = -vy;
        };
      });
    };
    contactWithBlock();
  
    // если закончились блоки, создать новую группу блоков и перейти на следующий уровень 
  
    if (!blocks.children.length) {
      stopGame();
      level += 1;
      levelNumber.innerHTML = `Level: ${level}`;
      renderBlocks();
      block = document.querySelectorAll('.block');
      contactWithBlock();
    };
  };
  
  function removeBlock(elem) {
    if(elem.classList.contains('block-red')) {
      elem.classList.remove('block-red');
      elem.classList.add('block-green');
      score +=1;
      scoreNumber.innerHTML = `Score: ${score}`;
    } else if (elem.classList.contains('block-green')) {
      elem.classList.remove('block-green');
      elem.classList.add('block-blue');
      score +=1;
      scoreNumber.innerHTML = `Score: ${score}`;
    } else {
      elem.remove();
      score +=1;
      scoreNumber.innerHTML = `Score: ${score}`;
    };
  };

  // запуск снарядов
  
  let intervalGenerateShells;
    
  function fallShells() {
  
    intervalGenerateShells  = setInterval(generateShells, 3000);
  
    const shellsblock = document.querySelector('.shells-block');
  
    let shells;
    let shellsY;
    let shellsX;
    let shellsHeight;
    let shellsWidth;
    const vShellsY = 5;
  
    function generateShells() {
      let shellRandomPosishon = shellPosishon(5, 95);
      shellsblock.innerHTML += `<div class = "shells" style = "left: ${shellRandomPosishon}%"></div>`;
      function shellPosishon (min, max) {
        return Math.floor(Math.random()*(max - min)+min);
      };
      shells = shellsblock.querySelector('.shells');
      shellsY = shells.getBoundingClientRect().top;
      shellsX = shells.getBoundingClientRect().left;
      shellsHeight = shells.getBoundingClientRect().height;
      shellsWidth = shells.getBoundingClientRect().width;
    };

    // механика движения снарядов

    setInterval(shellsMove, 1000/50);
    function shellsMove() {
      shellsY += vShellsY;
      if (shells) {
        shells.style.top = shellsY + 'px';
      };
      if (shellsY + shellsHeight > bottomWall) {
        shells.remove();
        shellsX = 0;
        shellsY = 0;
      };
      if (shellsY + shellsHeight > bottomWall - platformHeight && shellsX > platformPosX && shellsX + shellsWidth < platformPosX + platformWidth) {
        shellsX = 0;
        shellsY = 0;
        shells.remove();
        death();
      };
    };
  };
  
  // остановка игры 
  
  function stopGame () {
    clearInterval(intervalMove);
    clearInterval(intervalGenerateShells);
    document.addEventListener('keydown', startGame);
    document.addEventListener('keydown', movePlatformWihtBall);
    document.removeEventListener('keydown', movePlatform);
    posX = platformPosX + platformWidth/2;
    posY = bottomWall - platformHeight - ballDiameter; 
    ball.style.top = posY + 'px';
    ball.style.left = posX + 'px';
  };
  
  // попадание мяча за поле и попадание снаряда по платформе
  
  function death () {
    if (healthPoint === 1){
      gameOver();
    } else {
      stopGame();
      healthPoint -= 1;
      health.innerHTML = `Health: ${healthPoint}`;
    };
  };

  // окончание игры и вывод результатов

  function gameOver() {
    clearInterval(intervalMove);
    clearInterval(intervalGenerateShells);
    document.removeEventListener('keydown', movePlatform);
    const numberOfLevels = document.querySelector('.number-of-levels');
    const numberOfpoints = document.querySelector('.number-of-points');
    numberOfLevels.innerHTML = level;
    numberOfpoints.innerHTML = score;
    game.classList.add('hide');
    restart.classList.remove('hide');
  };
};

// кнопка перезапуска игры

restartButton.addEventListener('click', () => {
  location.reload();
});