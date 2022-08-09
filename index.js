const drawNumberInstructionsArr = [
    [1, 2, 3, 4, 5, 6],
    [4, 5],
    [2, 3, 5, 6, 7],
    [3, 4, 5, 6, 7],
    [1, 4, 5, 7],
    [1, 3, 4, 6, 7],
    [1, 2, 3, 4, 6, 7],
    [4, 5, 6],
    [1, 2, 3, 4, 5, 6, 7],
    [1, 3, 4, 5, 6, 7]
]

const drawLedInstructionsObj = {
    1: 'f',
    2: 's',
    3: 't'
}

const showLedInstructions = {
    1: [],
    2: ['second-number'],
    3: ['second-number', 'third-number']
}

document.addEventListener("DOMContentLoaded", fetchAsync('https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300'))

var randomNumber = 0


async function fetchAsync(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.value) {
        drawError(data.StatusCode)
    }

    randomNumber = data.value
    console.log(data)
    return data;
}

console.log(randomNumber)

function compareGuess() {
    const guess = parseInt(document.getElementById('input').value)
    const feedback = document.getElementById('message')

    if (guess > 999 || guess < 0) {
        feedback.innerHTML = 'Digite um número entre 1 e 999'
        ledReset()
    }

    if (isNaN(guess)) {
        feedback.innerHTML = 'Digite um número'
    }

    if (guess === randomNumber) {
        drawNumber(guess, true);

        feedback.classList.add('is-right')
        feedback.innerHTML = 'Você acertou!!!'

        const button = document.getElementById('button')
        button.classList.replace('submit-btn', 'submit-btn-disabled')
        button.disabled = true

        const input = document.getElementById('input')
        input.disabled = true

        const newGameBtn = document.getElementById('new-game-btn')
        newGameBtn.classList.remove('hidden')
    }

    if (guess >= 0 && guess < 999) {
        if (guess > randomNumber) {
            drawNumber(guess);
            feedback.innerHTML = 'É menor'
        }
    
        if (guess < randomNumber) {
            drawNumber(guess);
            feedback.innerHTML = 'É maior'
        }
    }

    const input = document.getElementById('input')
    input.value = ''
}

async function newGame() {
    const newGameBtn = document.getElementById('new-game-btn')
    newGameBtn.classList.add('hidden')

    const feedback = document.getElementById('message')
    feedback.classList.remove('is-right')
    feedback.innerHTML = ''

    const button = document.getElementById('button')
    button.disabled = false
    button.classList.replace('submit-btn-disabled', 'submit-btn')

    const input = document.getElementById('input')
    input.disabled = false
    input.value = ''
    ledReset()

    await fetchAsync('https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300')
}

function drawNumber(guess, isRight) {
    ledReset()

    const number = guess.toString()
    const numberArr = Array.from(number)
    const algarisms = numberArr.length
    const hideLedArr = showLedInstructions[algarisms]

    if (algarisms < 4 && hideLedArr.length) {
        hideLedArr.forEach((ledNumb) => {
            const led = document.getElementById(ledNumb)
            led.classList.remove('led-hidden')
        })
    }

    const numberDraw = numberArr.map((number) => {
        return drawNumberInstructionsArr[number]
    })

    if (isRight) {
        numberDraw.map((itemToColorize, idx) => {
            console.log('loop')
            itemToColorize.forEach((item) => {
                console.log('painting: ', `${item}`, drawLedInstructionsObj[idx + 1])
                document.getElementById(`${item}${drawLedInstructionsObj[idx + 1]}`).classList.replace('inactive', 'led-right')
            });
        })
    } else {
        numberDraw.map((itemToColorize, idx) => {
            console.log('loop')
            itemToColorize.forEach((item) => {
                console.log('painting: ', `s${item}`, drawLedInstructionsObj[idx + 1])
                document.getElementById(`${item}${drawLedInstructionsObj[idx + 1]}`).classList.replace('inactive', 'active')
            });
        })
    }
}

function drawError(error) {
    ledReset()
    const feedback = document.getElementById('message')
    feedback.classList.add('error')
    feedback.innerHTML = 'ERRO'
    const number = error.toString()
    const numberArr = Array.from(number)
    document.getElementById('second-number').classList.remove('led-hidden')
    document.getElementById('third-number').classList.remove('led-hidden')
    const numberDraw = numberArr.map((number) => {
        return drawNumberInstructionsArr[number]
    })

    numberDraw.map((itemToColorize, idx) => {
        console.log('loop')
        itemToColorize.forEach((item) => {
            console.log('painting: ', `${item}`, drawLedInstructionsObj[idx + 1])
            document.getElementById(`${item}${drawLedInstructionsObj[idx + 1]}`).classList.replace('inactive', 'error-led')
        });
    })

    const button = document.getElementById('button')
    button.classList.replace('submit-btn', 'submit-btn-disabled')
    button.disabled = true

    const input = document.getElementById('input')
    input.value = ''
    input.disabled = true

    const newGameBtn = document.getElementById('new-game-btn')
    newGameBtn.classList.remove('hidden')
}

function ledReset() {
    const feedback = document.getElementById('message')
    feedback.classList.remove('error')
    feedback.classList.remove('is-right')

    document.getElementById('second-number').classList.add('led-hidden')
    document.getElementById('third-number').classList.add('led-hidden')

    const ledRightAlgArr = document.querySelectorAll('.led-right')
    ledRightAlgArr.forEach((item) => {
        item.classList.replace('led-right', 'inactive')
    })

    const ledAlgArr = document.querySelectorAll('.active')
    ledAlgArr.forEach((item) => {
        item.classList.replace('active', 'inactive')
    })

    const ledErrAlgArr = document.querySelectorAll('.error-led')
    ledErrAlgArr.forEach((item) => {
        item.classList.replace('error-led', 'inactive')
    })
}
