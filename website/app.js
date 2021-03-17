// api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
/* Global Variables */
const weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = '7ca3206c612a7d4d7a17b980a9b34a7a';
const appBaseUrl = 'http://localhost:3000'
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();
const msgElement = document.querySelector('#msg');

const getCurrentTemperature = async (zipCode) => {
    let response = null;
    const url = `${weatherApiUrl}?zip=${zipCode}&appid=${apiKey}&units=metric`;
    try {
        response = await fetch(url);
    } catch (error) {
        throw new Error('Unable to get current weather data.');
    }
    if (response.status = 404 && response.statusText == "Not Found") {
        throw new Error('Please Enter Valid Zip Code');
    }
    let data = null;
    try {
        data = await response.json();
    } catch (error) {
        console.error(error)
        throw new Error('Unable to get current weather data.');
    }
    return data.main.temp;
}

const updateUI = (journal) => {
    const tempElement = document.querySelector('#temp');
    const dateElement = document.querySelector('#date');
    const contentElement = document.querySelector('#content');
    if (journal.date && journal.content && journal.temp){
        tempElement.innerHTML = `Temperature: ${journal.temp} C&deg;`;
        dateElement.textContent = `Date: ${journal.date}`;
        contentElement.textContent = `Your feelings: ${journal.content}`;
    } 
}

const saveJournal = async (url, data) => {
    console.log(JSON.stringify(data))
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseBody = await response.json();
        if (responseBody.status == 'fail') {
            throw new Error(responseBody.statusMsg);
        }
    } catch (error) {
        throw error;
    }
}

const getJournal = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {

    }
}

const showMessage = (msg, cssClass) => {
    msgElement.textContent = msg;
    msgElement.classList.add(cssClass);
}

const isValidInput = (zipCode, feelings) => {
    if ((!zipCode) || zipCode.length == 0) {
        showMessage('Please enter zip code.', 'error');
        return false;
    }
    if ((!feelings) || feelings.length == 0) {
        showMessage('Please enter your feelings.', 'error');
        return false;
    }
    return true;
}

const generateElement = document.querySelector('#generate');

generateElement.addEventListener('click', (event) => {
    event.preventDefault();
    msgElement.textContent = '';
    const zipCode = document.querySelector('#zip').value;
    const feelings = document.querySelector('#feelings').value;
    if (!isValidInput(zipCode, feelings)) {
        return;
    }
    getCurrentTemperature(zipCode)
        .then(temp => saveJournal(`${appBaseUrl}/journal`, {
            temp,
            date: newDate,
            content: feelings
        }))
        .then(data => {
            msgElement.textContent = 'Journal Saved Successfully';
            msgElement.classList.add('success');
            return getJournal(`${appBaseUrl}/journal`);
        }).then (journal => {
            updateUI(journal);
        })
        .catch(error => {
            showMessage(error.message, 'error');
        })
})



