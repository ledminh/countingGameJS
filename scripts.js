const screen = document.querySelector(".screen");
const panel = document.querySelector(".panel");
const resetButton = document.querySelector(".reset-button");

const gameEngine = getGameEngine(screen, panel, 
                                        {
                                            clickedClass: "buttonClicked",
                                            clickedResultClass: "resultClicked",
                                            screenWidth: 600,
                                            screenHeight:600,
                                            buttonSize: 60,
                                            minimumButtonSpace: 10
                                        
                                        });

gameEngine.start();

resetButton.addEventListener('click', () => gameEngine.start());


/****************************************************************
 * GAME ENGINE
 * 
 * 
 */

function getGameEngine(screen, panel, 
                        {
                            clickedClass, clickedResultClass, 
                            screenWidth, screenHeight,
                            buttonSize, minimumButtonSpace
                        }) {
    /**********************
     * Private
     */
    
    let buttons = null;
    let resultBlocks = null;
    let currentIndex = 0;
    let maxNum = Math.floor((screenWidth*screenHeight)/((buttonSize + minimumButtonSpace)*(buttonSize + minimumButtonSpace))/3);
    let numCount = Math.floor(maxNum/2);
    let testSeries = null;

    
    

    const isCorrectButton = (text) => testSeries[currentIndex] === text;
    const isFinished = () => currentIndex === testSeries.length;

    const moveOn = () => {
        currentIndex++;
    }

    function clear() {
        buttons = null;
        resultBlocks = null;
        currentIndex = 0;

        screen.innerHTML = "";
        panel.innerHTML = "";
    }


    function createNotificationScreen() {
        const notifScreen = document.createElement("div");

        notifScreen.classList.add("notification-screen");

        return notifScreen;
    }

    function numberRangeHandle(number){
        numCount = parseInt(number);

        const numberDisplayDiv = document.querySelector(".number-display");

        numberDisplayDiv.innerText = numCount;
    }

    function createCustomizePanel(buttonText){
        const customizePanel = document.createElement("div");
        customizePanel.classList.add("customize-panel");
        
        // Add numRange Slider
        const form = document.createElement("form");
        form.classList.add("numRange");

            // Create label
        const label = document.createElement("label");
        label.for = "numRange";
        label.innerText = "How many numbers do you want to count?";

        form.appendChild(label);

            // Create input
        const input = document.createElement("input");
        input.type = "range";
        input.min = "0";
        input.max = maxNum;
        input.value = numCount;
        input.id = "numRange";
                
        input.addEventListener('input', e => numberRangeHandle(e.target.value));


        form.appendChild(input);

            // Create number-display
        const numberDisplayDiv = document.createElement("div");
        numberDisplayDiv.classList.add("number-display");
        numberDisplayDiv.innerText = numCount;

        form.appendChild(numberDisplayDiv);

        

        customizePanel.appendChild(form);
        

        // Add Start Button
        const button = document.createElement("button");
        button.classList.add("start-button");
        button.innerText = buttonText;

        button.addEventListener('click', play);


        customizePanel.appendChild(button);

        


        return customizePanel;
    }

    function createEndgameScreen(winningStatus) {
        const endScreen = createNotificationScreen();

        endScreen.innerHTML = `
            <div class="game-status">YOU ${winningStatus? "WON!!!" : "LOSE"}</div>
            <div class="credit-screen">
                <p>This game is created by Minh Le.</p>
                <p>You can find me at: </p>
                <p><a href="https://www.linkedin.com/in/ledminh/">LinkedIn</a></p>
                <p><a href="https://github.com/ledminh">Github</a></p>
                <p><a href="https://www.ledminh.com/">LEDMINH.COM</a></p>
                <p><a href="https://www.ledminh.dev/">LEDMINH.DEV</a></p>
            </div>            
        `

        const customizePanel = createCustomizePanel("PLAY AGAIN?");
        endScreen.appendChild(customizePanel);

        return endScreen;
    }

    function createStartgameScreen() {
        const startScreen = createNotificationScreen();

        startScreen.innerHTML = `
            <div class="game-title">HOW MANY NUMBERS CAN YOU COUNT?</div>
            <div class="intro">
                <p>Use the bar below to set how many numbers you want to count then press PLAY.</p>
                <P>In order to win, you have to click on these numbers one by one from the smallest to the largest.</p>
            </div>
        `;

        const customizePanel = createCustomizePanel("PLAY");

        startScreen.appendChild(customizePanel);

        return startScreen;
    }

    function setTestSeries() {
        testSeries = Array.from({length: numCount}, (_, i) => i + 1);
    }

    function setupGame() {
        setTestSeries();
        let positionsArr = generatePositionsArr()

        buttons = createButtons(positionsArr);
        resultBlocks = createResultBlocks();


        buttons.forEach(button => screen.appendChild(button));
        resultBlocks.forEach(block => panel.appendChild(block));
    }

    function incorrectAlert() {
        screen.classList.add("incorrectAlert");

        setTimeout(() => screen.classList.remove("incorrectAlert"), 1000);
    }


    function endGame() {
        const endGameScreen = createEndgameScreen(true);

        screen.appendChild(endGameScreen);
    }

    function getOnClickHandler(text) {

        return () => {
            if(isCorrectButton(text)){
                moveOn();

                const btns = document.getElementsByTagName("button");
                const resultblcks = document.getElementsByTagName("span");

                for(let i = 0; i < currentIndex; i++) {
                    btns[i].classList.add(clickedClass);

                    //Get rid of the rotateZ if user clicks the right button
                    btns[i].style.transform = "";

                    resultblcks[i].classList.add(clickedResultClass);
                }


                if(isFinished()){
                    setTimeout(endGame, 700);
                    
                }
            }
            else {
                incorrectAlert();
            }

        };
    }
    
    function createButtons(positionsArr) {
        return testSeries.map((text, i) => {
            const button = document.createElement("button");
            button.innerText = text;
            button.classList.add("num-button");

            //Set position
            button.style.top = positionsArr[i].top + "px";
            button.style.left = positionsArr[i].left + "px";

            //Set rotate degree
            const degree = randomNumBetween(-60, 60);
            button.style.transform = `rotateZ(${degree}deg)`;


            button.addEventListener('click', getOnClickHandler(text));

            return button;
        });
    }



    function createResultBlocks() {
        return testSeries.map(text => {
            const block = document.createElement("span");
            block.innerText = text;
    
            return block;
        });

    }

    const randomNumBetween = (from, to) => Math.floor(Math.random()*to + from); 

    
  

    function generatePositionsArr() {
        const arr = [];

        
        for(let i = 0; i < testSeries.length; i++) {
            let pos = {
                top: randomNumBetween(minimumButtonSpace, screenHeight - (buttonSize + minimumButtonSpace)),
                left: randomNumBetween(minimumButtonSpace, screenWidth - (buttonSize + minimumButtonSpace))
            };


            let isAccepted = arr.every((currentPos) => !isCollided(pos, currentPos, minimumButtonSpace + buttonSize));
            
            while(!isAccepted){
                pos = {
                    top: randomNumBetween(minimumButtonSpace, screenHeight - (buttonSize + minimumButtonSpace)),
                    left: randomNumBetween(minimumButtonSpace, screenWidth - (buttonSize + minimumButtonSpace))    
                };
                
                isAccepted = arr.every((currentPos) => !isCollided(pos, currentPos, minimumButtonSpace + buttonSize));


            }


            

            arr.push(pos);

            

            
            
        }


        return arr;
    }

    function isCollided(box1, box2, boxSize) {
        const box1Left = box1.left, box1Right = box1.left + boxSize,
                box1Top = box1.top, box1Bottom = box1.top + boxSize,
                box2Left = box2.left, box2Right = box2.left + boxSize,
                box2Top = box2.top, box2Bottom = box2.top + boxSize;               


        if(box1Left >= box2Left && box1Left <= box2Right && box1Top >= box2Top && box1Top <= box2Bottom)
            return true;

        if(box2Left >= box1Left && box2Left <= box1Right && box2Top >= box1Top && box2Top <= box1Bottom)
            return true;

        if(box1Left >= box2Left && box1Left <= box2Right && box1Bottom >= box2Top && box1Bottom <= box2Bottom)
            return true;
        
        if(box2Left >= box1Left && box2Left <= box1Right && box2Bottom >= box1Top && box2Bottom <= box1Bottom)
            return true;
        

        return false;


    }

    


    /**********************
     * Public
     */
    function start() {
        const startScreen = createStartgameScreen();
        screen.appendChild(startScreen);     

    }



    function play() {
        clear();
        setupGame();
    }










    return {
        start,
        play

    }
}