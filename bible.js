// Data for the books of the Bible
const books = {
    oldTestament: [
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", 
        "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", 
        "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
        "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", 
        "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", 
        "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
        "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", 
        "Zephaniah", "Haggai", "Zechariah", "Malachi"
    ],
    newTestament: [
        "Matthew", "Mark", "Luke", "John", "Acts", 
        "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", 
        "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", 
        "2 Timothy", "Titus", "Philemon", "Hebrews", "James", 
        "1 Peter", "2 Peter", "1 John", "2 John", "3 John", 
        "Jude", "Revelation"
    ]
};

// --- Game State Variables ---
let currentLevel = 0;
let score = 0;
let selectionsInLevel = 0;
let timer;
let timeRemaining;
let currentBook;
let allBooks = [];

// Difficulty settings map (in total seconds per level)
// We will use 12 books/level * time/book to calculate total level time
const difficultySettings = {
    // These are now TOTAL SECONDS FOR THE LEVEL
    'Easy': 15,   // 12 selections * 15s/selection (generous)
    'Normal': 10, // 12 selections * 12s/selection (your target)
    'Hard': 7   // 12 selections * 9s/selection (challenging)
};
let levelTimeLimit = difficultySettings['Normal']; // Default total level time

// --- DOM Elements ---
const levelElement = document.getElementById('level');
const timeElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const bookNameElement = document.getElementById('book-name');
const oldTestamentBtn = document.getElementById('old-testament');
const newTestamentBtn = document.getElementById('new-testament');
const bgMusic = document.getElementById('bg-music');

const overlay = document.getElementById('overlay');
const messageText = document.getElementById('message-text');
const nextLevelBtn = document.getElementById('next-level-btn');
const restartBtn = document.getElementById('restart-btn');
const gameContainer = document.getElementById('game-container');

// Menu Elements
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const settingsMenu = document.getElementById('settings-menu');
const settingsButton = document.getElementById('settings-button');
const closeSettingsBtn = document.getElementById('close-settings');
const musicToggle = document.getElementById('music-toggle');
const difficultyRadios = document.getElementsByName('difficulty');

const highScoreMenu = document.getElementById('high-score-menu');
const highScoreButton = document.getElementById('high-score-button');
const highestScoreElement = document.getElementById('highest-score');
const clearScoresBtn = document.getElementById('clear-scores');
const closeHighScoreBtn = document.getElementById('close-high-score');


// --- Utility Functions ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getHighScore() {
    return parseInt(localStorage.getItem('bibleBookHighScore') || 0);
}

function saveHighScore(newScore) {
    if (newScore > getHighScore()) {
        localStorage.setItem('bibleBookHighScore', newScore);
    }
}


// --- Game Logic Functions ---

/**
 * @function startTimer
 * Starts the countdown for the ENTIRE LEVEL.
 */
function startTimer() {
    clearInterval(timer);
    
    // Timer starts and continues until the level is complete or time runs out.
    timer = setInterval(() => {
        timeRemaining--;
        timeElement.textContent = `${timeRemaining}s`;
        
        if (timeRemaining <= 0) {
            endGame(false); // Time's up!
        }
    }, 1000);
}

/**
 * @function displayNextBook
 * Shows the next book in the round or completes the level.
 * ***NOTE: This function no longer resets the timer!***
 */
function displayNextBook() {
    // 12 selections required to complete the level
    if (selectionsInLevel >= 12) {
        clearInterval(timer);
        if (currentLevel >= 50) {
            endGame(true); // Player won the entire game
        } else {
            showMessageCard("Well Done!", true);
        }
        return;
    }

    // Get the next book from the shuffled list
    if (allBooks.length === 0) {
        allBooks = [...books.oldTestament, ...books.newTestament];
        shuffleArray(allBooks);
    }
    
    currentBook = allBooks.pop();
    bookNameElement.textContent = currentBook;
    selectionsInLevel++;
}

/**
 * @function checkAnswer
 * Compares player selection to the correct testament.
 * ***NOTE: This function no longer affects the timer count.***
 */
function checkAnswer(playerChoice) {
    let correctAnswer = '';
    
    if (books.oldTestament.includes(currentBook)) {
        correctAnswer = 'oldTestament';
    } else if (books.newTestament.includes(currentBook)) {
        correctAnswer = 'newTestament';
    } else {
        console.error("Current book not found in any testament.");
        return; 
    }

    if (playerChoice === correctAnswer) {
        score += 2; 
        scoreElement.textContent = score;
        
        // This continues the level progress, but the timer keeps ticking independently.
        displayNextBook(); 
    } else {
        endGame(false); // Player made a wrong selection
    }
}

/**
 * @function startNewLevel
 * Initializes variables for the next round and starts the level timer.
 */
function startNewLevel() {
    currentLevel++;
    selectionsInLevel = 0;
    
    levelElement.textContent = currentLevel;
    
    // --- CRITICAL FIX: Set total time and start timer once per level ---
    timeRemaining = levelTimeLimit; 
    timeElement.textContent = `${timeRemaining}s`;
    startTimer();
    // -------------------------------------------------------------------
    
    // Hide message card and un-blur game container
    overlay.classList.add('hidden');
    gameContainer.classList.remove('blur');

    // Combine all books and shuffle them
    allBooks = [...books.oldTestament, ...books.newTestament];
    shuffleArray(allBooks);

    // Display the first book (without starting the timer again)
    displayNextBook();
}

/**
 * @function showMessageCard
 * Displays the "Well Done" or "Game Over" card.
 */
function showMessageCard(message, isLevelComplete) {
    messageText.textContent = message;
    overlay.classList.remove('hidden');
    gameContainer.classList.add('blur');
    
    nextLevelBtn.classList.toggle('hidden', !isLevelComplete);
    restartBtn.classList.toggle('hidden', isLevelComplete);
}

/**
 * @function endGame
 * Halts the game, saves the score, and displays the final message.
 */
function endGame(win) {
    clearInterval(timer);
    bgMusic.pause();
    bgMusic.currentTime = 0;

    saveHighScore(score); 

    let finalMessage = win 
        ? `Congratulations! You beat all 50 levels! Final Score: ${score}.`
        : `Oops, Game Over! Final Score: ${score}.`;

    finalMessage += ` Your High Score: ${getHighScore()}`;
    showMessageCard(finalMessage, false); 
}

/**
 * @function startGame
 * Resets the game state and initiates the first level.
 */
function startGame() {
    currentLevel = 0;
    score = 0;
    scoreElement.textContent = score;
    overlay.classList.add('hidden');
    gameContainer.classList.remove('blur');

    if (musicToggle.checked) {
        bgMusic.play().catch(e => console.error("Audio play failed:", e));
    }
    
    // Ensure time display is correct based on chosen difficulty BEFORE starting
    timeElement.textContent = `${levelTimeLimit}s`;
    
    startNewLevel();
}

// --- Menu Functions ---

function openSettings() {
    settingsMenu.classList.remove('hidden');
    startScreen.classList.add('hidden');
}

function closeSettings() {
    settingsMenu.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

function toggleMusic() {
    if (musicToggle.checked) {
        if (!gameContainer.classList.contains('hidden') && !bgMusic.paused) {
             bgMusic.play().catch(e => console.error("Audio play failed:", e));
        }
    } else {
        bgMusic.pause();
    }
}

function updateDifficulty(event) {
    const newDifficulty = event.target.value;
    levelTimeLimit = difficultySettings[newDifficulty];
    
    // If the game is not running, update the displayed time immediately
    if(startScreen.classList.contains('hidden') && gameContainer.classList.contains('blur')) {
         timeElement.textContent = `${levelTimeLimit}s`;
    }
}

function openHighScores() {
    highestScoreElement.textContent = getHighScore();
    highScoreMenu.classList.remove('hidden');
    startScreen.classList.add('hidden');
}

function closeHighScores() {
    highScoreMenu.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

function clearHighScores() {
    localStorage.setItem('bibleBookHighScore', 0);
    highestScoreElement.textContent = 0;
    alert('High scores cleared!');
}


// --- Event Listeners Initialization ---

// Game Buttons
oldTestamentBtn.addEventListener('click', () => checkAnswer('oldTestament'));
newTestamentBtn.addEventListener('click', () => checkAnswer('newTestament'));
nextLevelBtn.addEventListener('click', startNewLevel);
restartBtn.addEventListener('click', startGame);

// Start Screen Buttons (User Gesture)
startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    startGame();
});
settingsButton.addEventListener('click', openSettings);
highScoreButton.addEventListener('click', openHighScores);

// Settings Menu Buttons/Toggles
closeSettingsBtn.addEventListener('click', closeSettings);
musicToggle.addEventListener('change', toggleMusic);
difficultyRadios.forEach(radio => radio.addEventListener('change', updateDifficulty));

// High Score Menu Buttons
clearScoresBtn.addEventListener('click', clearHighScores);
closeHighScoreBtn.addEventListener('click', closeHighScores);


// --- Initial Setup on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Difficulty Radio Button (set display text based on default)
    const normalRadio = document.querySelector(`input[value="Normal"]`);
    if (normalRadio) {
        normalRadio.checked = true;
    }

    // Start with the Start Screen visible
    startScreen.classList.remove('hidden');
    gameContainer.classList.add('hidden');
});



const howToPlayButton = document.getElementById('how-to-play-button');
const howToPlayModal = document.getElementById('how-to-play-modal');
const closeHowToPlayBtn = document.getElementById('close-how-to-play');
howToPlayButton.addEventListener('click', () => {
    howToPlayModal.classList.remove('hidden');
    startScreen.classList.add('hidden');
});

closeHowToPlayBtn.addEventListener('click', () => {
    howToPlayModal.classList.add('hidden');
    startScreen.classList.remove('hidden');
});