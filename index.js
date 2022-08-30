const firstScreen = document.querySelector('.options-and-rules');
const game = document.querySelector('.game');
const restart = document.querySelector('.restart');
const startButton = document.querySelector('.options-and-rules__button');
const restartButton = document.querySelector('.restart__button');

const advancedLevel = document.querySelector('.options-level__number');
const healthNumber = document.querySelector('.options-health__number');

let difficultLevel;
let setHealth;

let isGameStarted = false;

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

  let platform = document.querySelector('.platform');
  let platformInfo = platform.getBoundingClientRect();

  const ball = document.querySelector('.ball');
  const ballInfo = ball.getBoundingClientRect();


  let healthPoint = setHealth;
  health.innerHTML = `Health: ${healthPoint}`;

  levelNumber.innerHTML = `Level: ${level}`;

  scoreNumber.innerHTML = `Score: ${score}`;

  let intervalMoveBall;
  let intervalMovePlatform; 
  
  let ballSpeedX = 4, ballSpeedY = -4;

  const ballDiameter = ballInfo.height;

  let ballPosX = ballInfo.left + ballDiameter / 2;
  let ballPosY = ballInfo.top;


  const platformWidth = platformInfo.width;
  const platformHeight = platformInfo.height;
  let platformPosX = platformInfo.left;
  const platformSpeed = 10;

  // выбор фунцкии для события

  function handleKeyDown(event) {
    if (!isGameStarted && event.key === ' ') {
      startGame();
    }
    if (!isGameStarted && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      movePlatformWihtBall(event);
    }
    if (isGameStarted && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      movePlatform(event);
    }
  };

  // создание группы блоков внутри тега blocks

  function renderBlocks() {
    const createBlocks = (i, j, color) => {
      return `<div class="block-row-${i} block-column-${j} block-${color} block"></div>`;
    };

    for (let i = 1; i < 21; i++) {
      for (let j = 1; j < 6; j++) {
        let color = randomColor(1, 4);
        blocks.innerHTML += createBlocks(i, j, color);
      };
    };

    function randomColor(min, max) {
      if (Math.floor(Math.random() * (max - min) + min) === 1) {
        return 'blue';
      } else if (Math.floor(Math.random() * (max - min) + min) === 2) {
        return 'green';
      } else {
        return 'red';
      };
    };
  };
  renderBlocks();

  let block = document.querySelectorAll('.block');

  // запуск игры, функционал движения мяча и платформы

  function startGame() {
    isGameStarted = true;
    intervalMoveBall = requestAnimationFrame(moveBall);
    fallGift();
    if (level >= difficultLevel) {
      fallShells();
    }
  };

  function movePlatform(event) {
    if (event.key === 'ArrowLeft') {
      movePlatformlLeft();
    }
    if (event.key === 'ArrowRight') {
      movePlatformRight();
    }
  };

  function movePlatformWihtBall(event) {
    if (event.key === 'ArrowLeft') {
      movePlatformWihtBallLeft();
    }
    if (event.key === 'ArrowRight') {
      movePlatformWihtBallRight();
    }
  };

  function movePlatformlLeft () {
    let start = Date.now()
    let interval = setInterval(move, 15);
    function move() {
      let timePassed = Date.now() - start;
      if (timePassed >= 375) {
        clearInterval(interval)
      }
      platformPosX -= 1;
      platform.style.left = `${platformPosX}px`;
      platform = document.querySelector('.platform');
      platformInfo = platform.getBoundingClientRect();
      platformPosX = platformInfo.left;
      if (platformPosX < leftWall) {
        platformPosX = leftWall;
        platform.style.left = `${platformPosX}px`;
      }
    };
  };

  function movePlatformRight () {
    let start = Date.now()
    let interval = setInterval(move, 15);
    function move() {
      let timePassed = Date.now() - start;
      if (timePassed >= 375) {
        clearInterval(interval)
      }
      platformPosX += 1;
      platform.style.left = `${platformPosX}px`;
      platform = document.querySelector('.platform');
      platformInfo = platform.getBoundingClientRect();
      const platformWidth = platformInfo.width;
      platformPosX = platformInfo.left;
      if (platformPosX + platformWidth > rightWall) {
        platformPosX = rightWall - platformWidth;
        platform.style.left = `${platformPosX}px`;
      }
    };
  };


  function movePlatformWihtBallLeft () {
    let start = Date.now()
    let interval = setInterval(move, 15);
    function move() {
      let timePassed = Date.now() - start;
      if (timePassed >= 375) {
        clearInterval(interval)
      }
      platformPosX -= 1;
      ballPosX -= 1;
      platform.style.left = `${platformPosX}px`;
      ball.style.left = `${ballPosX}px`;
      platform = document.querySelector('.platform');
      platformInfo = platform.getBoundingClientRect();
      const platformWidth = platformInfo.width;
      platformPosX = platformInfo.left;
      if (platformPosX < leftWall) {
        platformPosX = leftWall;
        ballPosX = platformPosX + platformWidth / 2 - leftWall;
        platform.style.left = `${platformPosX}px`;
        ball.style.left = `${ballPosX}px`;
      }
    }  
  };


  function movePlatformWihtBallRight () {
    let start = Date.now()
    let interval = setInterval(move, 15);
    function move() {
      let timePassed = Date.now() - start;
      if (timePassed >= 375) {
        clearInterval(interval)
      }
      platformPosX += 1;
      ballPosX += 1;
      platform.style.left = `${platformPosX}px`;
      ball.style.left = `${ballPosX}px`;
      platform = document.querySelector('.platform');
      platformInfo = platform.getBoundingClientRect();
      const platformWidth = platformInfo.width;
      platformPosX = platformInfo.left;
      if (platformPosX + platformWidth + rightWallWidth > rightWall) {
        platformPosX = rightWall - rightWallWidth - platformWidth;
        ballPosX = rightWall - rightWallWidth - platformWidth / 2;
        platform.style.left = `${platformPosX}px`;
        ball.style.left = `${ballPosX}px`;
      }
    };
  };

  // function updatePlatformInfo () {
  //   platform = document.querySelector('.platform');
  //   platformInfo = platform.getBoundingClientRect();
  //   const platformWidth = platformInfo.width;
  //   platformPosX = platformInfo.left;
  // }

  // механика перемещения шара в пространстве и контакта соприкосновения с границами и блоками

  function moveBall() {
    ballPosX += ballSpeedX; 
    ballPosY += ballSpeedY;

    if(isGameStarted) {
      requestAnimationFrame(moveBall);
    }

    //взаимодействие со стенами и платформой

    if (ballPosX < leftWall) {
      ballPosX = leftWall;
      ballSpeedX = -ballSpeedX;
    }
    if (ballPosY < topWall) {
      ballPosY = topWall;
      ballSpeedY = -ballSpeedY;
    }
    if (ballPosX + ballDiameter + rightWallWidth > rightWall) {
      ballPosX = rightWall - ballDiameter - rightWallWidth;
      ballSpeedX = -ballSpeedX;
    }
    if (ballPosY > bottomWall - platformHeight - ballDiameter) {
      if (ballPosX >= platformPosX - ballDiameter && ballPosX <= platformPosX + platformInfo.width) {
        ballPosY = bottomWall - platformHeight - ballDiameter;
        ballSpeedY = -ballSpeedY;
      }
    }
    ball.style.top = `${ballPosY}px`;
    ball.style.left = `${ballPosX}px`;

    // при попадании мяча в запретную зону, убрать HP или закончить игру.

    if (ballPosY + ballDiameter > bottomWall) {
      death();
    };

    // взаимодействие с блоками

    function contactWithBlock() {
      Object.values(block).map((elem) => {
        const elemTop = elem.getBoundingClientRect().top;
        const elemBottom = elem.getBoundingClientRect().top + elem.getBoundingClientRect().height;
        const elemLeft = elem.getBoundingClientRect().left;
        const elemRight = elem.getBoundingClientRect().left + elem.getBoundingClientRect().width;

        if (ballPosY + ballDiameter / 4 <= elemBottom && ballPosY > elemTop && ballPosX > elemLeft && ballPosX < elemRight) {
          removeBlock(elem);
          ballSpeedY = -ballSpeedY;
        }
        if (ballPosX + ballDiameter + ballDiameter / 4 >= elemLeft && ballPosX <= elemRight && ballPosY + ballDiameter / 2 > elemTop && ballPosY + ballDiameter / 2 < elemBottom) {
          removeBlock(elem);
          ballSpeedX = -ballSpeedX;
        }
        if (ballPosX - ballDiameter / 2 <= elemRight && ballPosX >= elemLeft && ballPosY + ballDiameter / 2 > elemTop && ballPosY + ballDiameter / 2 < elemBottom) {
          removeBlock(elem);
          ballSpeedX = -ballSpeedX;
        }
        if (ballPosY + ballDiameter / 2 + ballInfo.height >= elemTop && ballPosY + ballInfo.height <= elemBottom && ballPosX > elemLeft && ballPosX < elemRight) {
          removeBlock(elem);
          ballSpeedY = -ballSpeedY;
        }
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
    }
  };

  function removeBlock(elem) {
    if (elem.classList.contains('block-red')) {
      elem.classList.remove('block-red');
      elem.classList.add('block-green');
      score += 1;
      scoreNumber.innerHTML = `Score: ${score}`;
    } else if (elem.classList.contains('block-green')) {
      elem.classList.remove('block-green');
      elem.classList.add('block-blue');
      score += 1;
      scoreNumber.innerHTML = `Score: ${score}`;
    } else {
      elem.remove();
      score += 1;
      scoreNumber.innerHTML = `Score: ${score}`;
    }
  };

  // запуск снарядов

  let intervalGenerateShells;

  function fallShells() {

    intervalGenerateShells = setInterval(generateShells, 3000);

    const shellsblock = document.querySelector('.shells-block');

    let shells;
    let shellsPosY;
    let shellsPosX;
    let shellsHeight;
    let shellsWidth;
    const shellsSpeedY = 6;

    function generateShells() {
      let shellRandomPosishon = shellPosishon(5, 95);
      shellsblock.innerHTML += `<div class = "shells" style = "left: ${shellRandomPosishon}%"></div>`;
      function shellPosishon(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      };
      shells = shellsblock.querySelector('.shells');
      shellsPosY = shells.getBoundingClientRect().top;
      shellsPosX = shells.getBoundingClientRect().left;
      shellsHeight = shells.getBoundingClientRect().height;
      shellsWidth = shells.getBoundingClientRect().width;
    };

    // механика движения снарядов

    setInterval(shellsMove, 20);
    function shellsMove() {
      shellsPosY += shellsSpeedY;
      if (shells) {
        shells.style.top = `${shellsPosY}px`;
      }
      if (shellsPosY + shellsHeight > bottomWall) {
        shells.remove();
        shellsPosX = 0;
        shellsPosY = 0;
      }
      if (shellsPosY + shellsHeight > bottomWall - platformHeight && shellsPosX > platformPosX && shellsPosX + shellsWidth < platformPosX + platformWidth) {
        shellsPosX = 0;
        shellsPosY = 0;
        shells.remove();
        death();
      }
    };
  };

  // механика падения подарков 

  let intervalGenerateGift;

  function fallGift() {

    intervalGenerateGift = setInterval(generateGift, 5000);

    const giftBlock = document.querySelector('.gift-block');

    let gift;
    let giftPosY;
    let giftPosX;
    let giftHeight;
    let giftWidth;
    const giftSpeedY = 8;

    function generateGift() {
      let giftRandomPosishon = giftPosishon(5, 95);
      giftBlock.innerHTML += `<div class = "gift" style = "left: ${giftRandomPosishon}%"></div>`;
      function giftPosishon(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      };
      gift = giftBlock.querySelector('.gift');
      giftPosY = gift.getBoundingClientRect().top;
      giftPosX = gift.getBoundingClientRect().left;
      giftHeight = gift.getBoundingClientRect().height;
      giftWidth = gift.getBoundingClientRect().width;
    };

  // механика движения подарков

    setInterval(giftMove, 20);
    function giftMove() {
      giftPosY += giftSpeedY;
      if (gift) {
        gift.style.top = `${giftPosY}px`;
      }

      platform = document.querySelector('.platform');
      platformInfo = platform.getBoundingClientRect();
      const platformWidth = platformInfo.width;
      platformPosX = platformInfo.left;

      if (giftPosY + giftHeight > bottomWall) {
        gift.remove();
        giftPosX = 0;
        giftPosY = 0;
      }
      if (giftPosY + giftHeight > bottomWall - platformHeight && giftPosX > platformPosX && giftPosX + giftWidth < platformPosX + platformWidth) {
        giftPosX = 0;
        giftPosY = 0;
        gift.remove();
        applyBonus();
      }
    };
    
    // механика случайного бонуса

    function applyBonus() {
      platform.style.width = `${randomBonus(3, 30)}%`
      function randomBonus(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      };
    };
  };

  // остановка игры 

  function stopGame() {
    isGameStarted = false;
    clearInterval(intervalGenerateShells);
    clearInterval(intervalGenerateGift);

    platform = document.querySelector('.platform');
    platformInfo = platform.getBoundingClientRect();
    const platformWidth = platformInfo.width;
    platformPosX = platformInfo.left;

    ballPosX = platformPosX + platformWidth / 2;
    ballPosY = bottomWall - platformHeight - ballDiameter;
    ball.style.top = `${ballPosY}px`;
    ball.style.left =`${ballPosX}px`;
  };

  // попадание мяча за поле и попадание снаряда по платформе

  function death() {
    if (healthPoint === 1) {
      gameOver();
    } else {
      stopGame();
      healthPoint -= 1;
      health.innerHTML = `Health: ${healthPoint}`;
    };
  };

  // окончание игры и вывод результатов

  function gameOver() {
    const numberOfLevels = document.querySelector('.number-of-levels');
    const numberOfpoints = document.querySelector('.number-of-points');
    numberOfLevels.innerHTML = level;
    numberOfpoints.innerHTML = score;
    game.classList.add('hide');
    restart.classList.remove('hide');
  };

  document.addEventListener('keydown', handleKeyDown);
};

// кнопка перезапуска игры

restartButton.addEventListener('click', () => {
  location.reload();
});