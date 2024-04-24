/*
    --- Game params ---

    Set global game params here, by declaring `var params`.

    Do not remove or ammend any provided parameters.
*/

var assets = {"imgs" : {}, "fonts" : {}}
// ------------------
// -- Optional params
var REQUIRES_FULLSCREEN = false;
var params = {verbose: false, positionMode: "PERCENTAGE", textAlign: "CENTER", imageMode: "CENTER", rectMode: "CENTER"}
var player = new Player();
// -------------------------------------------------------

var fpt;
var fpt2;
var pBrainImg;
var myBandit;

function gameInit() {

}

function handleClick(e){
    pClickListener(e)
}

// -------------------------------------------------------

/* 
    --- P5 functions ---

    p5.js game required game functions. Do not remove or move functions.

    - preload(): function for preloading and caching statics (eg. images, fonts)
    - setup(): contains initialisations required before first animation loop runs.
    - draw(): animation draw loop. Runs `frameRate()` number of times per second (~30).

    See p5js for more (TODO include options for onresize etc.)

*/

function preload(){
    /*
        p5.js static preloader. Used for loading images and fonts etc.
        Statics are stored in a global object called `assets` with nested objects `imgs` and `fonts`.
        This can be added to, eg. to include gifs, by setting:

                assets.gifs = {};

        To preload an image, add it to the asset obj using:

                assets.imgs["image1"] = loadImage("path/to/image1.png");

        To load a font, similarly use:

                assets.fonts["kalam-bold"] = loadFont("path/to/font/kalam-bold.ttf")

    */

    assets.imgs.brain = loadImage("static/imgs/brain.svg");
    assets.imgs.slotMachine = loadImage("static/imgs/slotMachine.jpg");

}

function setup() {
    /*
        Initialisations to be run before first animation loop. Includes:

            - Define canvas
            - Define Psychex/raw p5 components
            - Set p5.js params
            - Declare any event (e.g. click) listeners
    */

    var canvas = createCanvas(window.screen.width, window.screen.height);
    canvas.parent("gameCanvas");

    canvas.mouseClicked((e) => handleClick(e))
    begin = true

    fpt = new pText("Welcome to Psychex.", 50, 15).setTextSize("2xl");
    fpt2 = new pText("If you're seeing this, you've loaded Psychex successfully.", 50, 22.5).setTextSize("lg");
    pBrainImg = new pImage(50, 50, assets.imgs.brain).toggleClickable();
    pBrainImg.onClick = () => {
        pBrainImg.updatePosition(_.random(10, 90), _.random(10, 90));
    }
    myBandit = new MyNewBanditTask(0, 0, 2, "random")

    // === HANDLE FULLSCREEN ========================================================================================
    // - If fullscreen mode is required, show initial message and request fullscreen click
    // - NB: Fullscreen cannot be entered without user interaction. A click anywhere on the document page handles the interaction.
    if (REQUIRES_FULLSCREEN){
        document.addEventListener("click", () => {
            if (!begin){
                isFullScreen = true
                requestFullScreen(document.documentElement)
                document.getElementById("fullscreenText").classList.add("hidden");
                // After the click, pause for 0.25s to prevent overlap in fullscreen detection in animation loop
                setTimeout(() => {
                    begin = true;
                    // hide fullscreen message and show img container
                    document.getElementById("gameCanvas").classList.remove("hidden");
                    canvas.mouseClicked((e) => handleClick(e))
                }, 250)
            }
        })
    }
    // ==============================================================================================================

}

function draw(){
    // Clear contents of loop each iteration. Prevents waterfall effect when animating.
    clear();
    background('white');

    if (blockLoop) return;

    if (begin) {
        if (isFullScreen || !REQUIRES_FULLSCREEN){
            // Check if the user is in fullscreen mode, and proceed unless REQUIRES_FULLSCREEN is set to false
            if (detectFullscreen() == undefined){
                if (REQUIRES_FULLSCREEN) {
                    isFullScreen = false;
                    // After 1s, redirect user to the debfrief screen
                    setTimeout(() => {
                        handleEndgameRedirect(true)
                        console.log("exiting")
                        isFullScreen = false;
                    }, 1000)
                } else {
                    // =============================================================================================
                    // INSERT DRAWABLE CONTENT HERE
                    // =============================================================================================
                    // fpt.draw();
                    // fpt2.draw();
                    // pBrainImg.draw();
                    myBandit.draw();
                }  
            } 
        }   
    }
}

function handleEndgameRedirect(earlyExit){
    /*Handles several endgame redirect cases
        1) No URL params provided, so includes the playerID and early exit status
        2) Provides all URL params EXCEPT playerId, so attaches the generated ID to the params, with early exit status
        3) All URL params provided, so attaches those plus early exit status to redirect link
    */
    blockLoop = true;

    // Proceed to debrief screen based on exit condition, either:
    //  - true : usually due to fullscreen exit
    //  - false: standard end of game procedure

    if (location.search.length == 0){
        // Redirect condition if not using URL parameters
        window.location.replace(`/debrief?ki=${earlyExit}`);
    } else {
        // TODO add in window URLS plus optional extras
    }
}


// class MyNewBanditTask extends NArmBandit {
//     constructor(x, y, nArms, probabilities){
//         super(x, y, nArms, probabilities);

//         this.slotMachines = [
//             new pImage(30, 50, assets.imgs.slotMachine).toggleClickable(),
//             new pImage(70, 50, assets.imgs.slotMachine).toggleClickable(),
//         ]

//         this.slotMachines.forEach((sm, ix) => {
//             sm.onClick = () => {
//                 let outcome = this.pullArm(ix)
//                 console.log(`Clicked on arm ${ix}, with result: ${outcome}`)
//             }
//         })

//     }

//     draw() {
//         this.slotMachines.forEach(sm => sm.draw());
//     }
// }


class MyNewBanditTask extends NArmBandit{
    constructor(x, y, nArms, probs){
        super(x, y, nArms, probs);
        let width = 60;
        let singleWidth=25;
        this.pullNumber = 0;
        this.slotMachines = [];
        _.range(this.nArms).forEach((sm, ix) => {
            this.slotMachines.push(
                new pImage(20 + (singleWidth*ix), 50, assets.imgs.slotMachine).toggleClickable().setScale(0.5),
            )
        })

        this.slotMachines.forEach((sm, ix) => {
            sm.onClick = (e) => {
                let result = this.pullArm(ix)
                console.log(`Arm ${ix} gave reward: ${result}`)
                if (result == true){
                    this.feedbackText.text = `You won on ${ix}!`
                } else {
                    this.feedbackText.text = `You lost on ${ix} :/`
                }
                this.logScore(this.pullNumber, ix, result)
                this.pullNumber++;
                setTimeout(() => {
                    this.feedbackText.text = ""
                }, 1000)
            }
        })

        this.feedbackText = new pText("", 50, 20).setTextSize(48);
    }

    logScore(pullNumber, arm, result){
        player.data.push(
            {
                pullNumber: pullNumber,
                arm: arm,
                probs: this.probabilities,
                result: result,
                timestamp: Date.now(),
                timestring: Date()
            }
        )
    }

    draw(){
        this.slotMachines.forEach(sm => sm.draw());
        this.feedbackText.draw();
    }
}