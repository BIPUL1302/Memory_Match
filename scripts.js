class AudioController {
    constructor() {
        this.bgMusic = new Audio('Assets/Audio/Pokemon.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameover.wav');
        this.bgMusic.volume = 0.2;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining =totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(()=>{
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountdown();
            this.busy=false;
        }, 500);
        this.hideCards();
        this.timer.innerText =this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    
    hideCards(){
        this.cardsArray.forEach(card =>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck){
                this.checkForCardMatch(card);
            }
            else{
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    cardMatch(card1,card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    cardMisMatch(card1, card2) {
        this.busy =true;
        setTimeout(()=>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        },800);
    }

    getCardType(card) {
        return card.getElementsByClassName('front-face')[0].src;
    }

    startCountdown() {
        return setInterval(()=>{
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        },800);
    }

    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    shuffleCards() {
        for(let i = this.cardsArray.length -1; i>0 ; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order =randIndex;
        }
    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes() && card !== this.cardToCheck;
    }
}

function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('memory-card'));
    let game = new MixOrMatch(50,cards);

    overlays.forEach(overlays => {
        overlays.addEventListener('click', () =>{
            overlays.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach( card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });

}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoader', ready() );
}
else{
    ready();
}


// const cards = document.querySelectorAll('.memory-card');

// let hasFlippedCard = false;
// let lockBoard=false;        //used to lock the board until the unflipping of previous cards is performed. 
// let firstCard, secondCard;

// function flipCard() {
//     if(lockBoard) return;

//     if(this === firstCard) return;   // to avoid the double click on the same card

//     this.classList.add('flip');

//     if (!hasFlippedCard){
//         //first click
//         hasFlippedCard = true;
//         firstCard = this;

//         return;
//     }
    
//     //second click
//     secondCard=this;

//     checkForMatch();
// }

// function checkForMatch(){
//     //match or not
//     if(firstCard.dataset.framework === secondCard.dataset.framework){
//         //its a match
//         disableCards();
//     }
//     else{
//         //not a match
//         unflipCards();
//     }
// }

// function disableCards(){
//     firstCard.removeEventListener('click',flipCard);
//     secondCard.removeEventListener('click',flipCard);
    
//     resetBoard();
// }

// function unflipCards(){
//     lockBoard = true;
//     setTimeout(() =>{
//         firstCard.classList.remove('flip');
//         secondCard.classList.remove('flip');

//         resetBoard();
//     }, 800);
// }

// function resetBoard() {
//     [hasFlippedCard, lockBoard] = [false,false];
//     [firstCard,secondCard] = [null, null];
// }

// (function shuffle(){
//     cards.forEach(card => {
//         let randomPos = Math.floor(Math.random()*16);
//         card.style.order = randomPos;
//     });
// })();

// cards.forEach(card => card.addEventListener('click', flipCard));
