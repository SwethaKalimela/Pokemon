let resultElement = document.getElementById('result');
let pokemonImageElement = document.getElementById('pokemonImage');
let optionsContainer = document.getElementById('options');
const pointsElement = document.getElementById('pointsValue');
const totalCount = document.getElementById('totalCount');
const mainContainer = document.getElementsByClassName('container');
const loadingContainer = document.getElementById('loadingContainer');

let count = 0;
let points = 0;
let showLoading = false;
let usedPokemonIds = []; // Array used to store the list of already used/displayed pokemons

const showPuzzleWindow = () => {
    loadingContainer.classList.remove('show');
    mainContainer[0].classList.remove('hide');
    mainContainer[0].classList.add('show');
}

const hidePuzzleWindow = () => mainContainer[0].classList.add('hide');

const showLoadingWindow = () => {
    mainContainer[0].classList.remove('show');
    loadingContainer.classList.remove('hide');
    loadingContainer.classList.add('show');
}

const hideLoadingWindow = () => loadingContainer.classList.add('hide');

// Fetch Single Pokemon
async function fetchPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

async function loadQuestionWithOptions() {
    showLoadingWindow();
    hidePuzzleWindow();
    // Fetch correct answer first
    let pokemonId = getRandomPokemonId();

    // Check if the current question has already been used/displayed earlier
    if (usedPokemonIds.includes(pokemonId)) {
        pokemonId = getRandomPokemonId();
    } else {
        usedPokemonIds.push(pokemonId);
    }

    const pokemon = await fetchPokemonById(pokemonId);

    // Reset the options array with the correct answer (pokemon.name)
    const options = [pokemon.name]

    // Fetch additional random Pokemon names to use as options
    while (options.length < 4) {
        const randomPokemonId = getRandomPokemonId();
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;

        // Ensure fetched option does not exist in the options list
        if (!options.includes(randomPokemon)) {
            options.push(randomOption);
        }
    }

    // Shuffle the 4 options array always to change the place of right answer always
    shuffleArray(options);

    // Clear any previous result and update pokemon image to fetched image URL from the "sprites"
    resultElement.textContent = "Who's this Pokemon?";
    pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

    // Create options HTML elements from options array in the DOM
    optionsContainer.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = (event) => checkAnswer(option === pokemon.name, event);
        optionsContainer.appendChild(button);
    });
    hideLoadingWindow();
    showPuzzleWindow();
}

function checkAnswer(isCorrect, event) {
    // Check if any button is already selected
    const selectedButton = document.querySelector('.selected');

    // If already a button is selected, do nothing
    if (selectedButton) {
        return;
    }

    // Else, mark the clicked button as selected
    event.target.classList.add('selected');
    count++;
    totalCount.textContent = count;

    if (isCorrect) {
        displayResult('Correct answer', 'correct');
        // If correct increase the points by 1
        points++;
        pointsElement.textContent = points;
        event.target.classList.add('correct');
    } else {
        displayResult('Wrong answer', 'wrong');
        event.target.classList.add('wrong');
    }

    setTimeout(() => {
        showLoadingWindow();
        hidePuzzleWindow();
    }, 1000);

    // Load next question with 2 sec delay
    setTimeout(() => {
        loadQuestionWithOptions();
    }, 2000);
}

// Function to update result text and class name
function displayResult(result) {
    resultElement.textContent = result;
}

function getRandomPokemonId() {
    return Math.floor(Math.random() * 151) + 1;
}

// Step [1]: Initial load
loadQuestionWithOptions();

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}