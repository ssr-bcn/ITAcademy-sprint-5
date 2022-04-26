"use strict";
// CONFIGURATION --------------------------------------------------------------
// icanhazdadjoke: https://icanhazdadjoke.com
const JOKE_DAD_API = 'https://icanhazdadjoke.com';
// Chuck Norris API: https://api.chucknorris.io/
const JOKE_NORRIS_API = 'https://api.chucknorris.io/jokes/random';
// JokeAPI: https://sv443.net/jokeapi/v2/
const JOKE_JOKE_API = 'https://v2.jokeapi.dev/joke/Any?lang=es&blacklistFlags=nsfw&type=single';
// Weather API: https://www.weatherapi.com
const WEATHER_API = 'https://api.weatherapi.com/v1/current.json?key=6bcccdb5738c4fc1a1d134904222604&q=Barcelona&lang=es';
const reportJokes = [];
class reviewedJoke {
    constructor(joke, score, date) {
        this.joke = joke;
        this.score = score;
        this.date = date;
    }
}
const score = [
    {
        points: 1,
        emoji: '🙄'
    },
    {
        points: 2,
        emoji: '🙂'
    },
    {
        points: 3,
        emoji: '🤣'
    }
];
// FUNCTIONS ------------------------------------------------------------------
// Asking for a new joke
let jokeRequests = [
    {
        request: new Request(JOKE_DAD_API, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                'User-Agent': 'IT Academy - React Course'
            })
        }),
        property: 'joke'
    },
    {
        request: new Request(JOKE_NORRIS_API, {
            method: 'GET',
        }),
        property: 'value'
    },
    {
        request: new Request(JOKE_JOKE_API, {
            method: 'GET',
        }),
        property: 'joke'
    }
];
// Asking for actual weather information
let weatherRequest = new Request(WEATHER_API, {
    method: 'GET'
});
function getAPIResponse(request) {
    return fetch(request)
        .then(res => res.json())
        .then(json => json)
        .catch(error => error);
}
// INTERFACE ------------------------------------------------------------------
let UI = {
    message: {
        waiting: 'Estem buscant un acudit...',
        error: 'Hem trobat un problema. Torna a intentar-ho.',
        thanks: 'Gràcies pel teu feedback!'
    },
    jokeWrapper: document.getElementById('joke-text'),
    weatherWrapper: document.getElementById('weather-container'),
    showWeatherData({ icon, text }) {
        var _a, _b;
        let image, txt;
        image = document.createElement('img');
        image.setAttribute('src', icon);
        txt = document.createElement('span');
        txt.appendChild(document.createTextNode(text));
        (_a = this.weatherWrapper) === null || _a === void 0 ? void 0 : _a.appendChild(image);
        (_b = this.weatherWrapper) === null || _b === void 0 ? void 0 : _b.appendChild(txt);
    },
    showJoke(joke) {
        var _a, _b;
        let txt = document.createElement('span');
        txt.appendChild(document.createTextNode(joke));
        (_a = this.jokeWrapper) === null || _a === void 0 ? void 0 : _a.replaceChildren(txt);
        (_b = this.jokeWrapper) === null || _b === void 0 ? void 0 : _b.classList.add('filled');
        this.showFeedback();
        this.hideModal();
    },
    showFeedback() {
        var _a;
        let feedback = document.createElement('div');
        feedback.classList.add('feedback');
        feedback.innerHTML = `<p>Què opines sobre aquest acudit?</p>`;
        let emojis = score
            .map(({ points, emoji }) => `<a href="#" class="score" data-score="${points}">${emoji}</a>`);
        feedback.innerHTML += emojis.join('');
        (_a = this.jokeWrapper) === null || _a === void 0 ? void 0 : _a.appendChild(feedback);
    },
    showModal(msg) {
        let modal = document.createElement('div');
        modal.classList.add('modal');
        let paragraph = document.createElement('p');
        paragraph.appendChild(document.createTextNode(msg));
        modal.appendChild(paragraph);
        if (this.message.error === msg) {
            let btn = document.createElement('button');
            btn.appendChild(document.createTextNode('Tancar'));
            btn.setAttribute('id', 'close');
            paragraph = document.createElement('p');
            paragraph.appendChild(btn);
            modal.appendChild(paragraph);
        }
        document.body.prepend(modal);
    },
    hideModal() {
        let modal = document.querySelector('.modal');
        modal === null || modal === void 0 ? void 0 : modal.remove();
    }
};
// EVENT LISTENERS ------------------------------------------------------------
// Listening for a new joke request
let newJoke = document.getElementById('next-joke');
newJoke === null || newJoke === void 0 ? void 0 : newJoke.addEventListener('click', () => {
    UI.showModal(UI.message.waiting);
    let index = Math.floor(Math.random() * jokeRequests.length);
    getAPIResponse(jokeRequests[index].request)
        .then(response => {
        UI.hideModal();
        console.log(response);
        if (response[jokeRequests[index].property]) {
            UI.showJoke(response[jokeRequests[index].property]);
        }
        else {
            UI.showModal(UI.message.error);
        }
    });
});
// Listening for a modal close request
document.addEventListener('click', (e) => {
    var _a;
    if (e.target && ((_a = e.target) === null || _a === void 0 ? void 0 : _a.id) === 'close') {
        UI.hideModal();
    }
});
// Listening for a score vote
document.addEventListener('click', (e) => {
    var _a, _b, _c;
    if (e.target && ((_a = e.target) === null || _a === void 0 ? void 0 : _a.classList.contains('score'))) {
        let feedback, joke, score, date;
        feedback = e.target.parentElement;
        joke = ((_c = (_b = feedback.parentElement) === null || _b === void 0 ? void 0 : _b.firstChild) === null || _c === void 0 ? void 0 : _c.textContent) || '';
        score = e.target.getAttribute('data-score');
        let now = new Date();
        date = now.toISOString();
        reportJokes.push(new reviewedJoke(joke, score, date));
        console.log(reportJokes);
        feedback.replaceChildren(document.createTextNode(UI.message.thanks));
        e.preventDefault();
    }
});
// Listening for document ready
window.addEventListener('DOMContentLoaded', (e) => {
    getAPIResponse(weatherRequest)
        .then(response => {
        var _a, _b;
        if (response.current) {
            UI.showWeatherData(response.current.condition);
        }
        else {
            (_a = UI.weatherWrapper) === null || _a === void 0 ? void 0 : _a.classList.add('error');
            (_b = UI.weatherWrapper) === null || _b === void 0 ? void 0 : _b.appendChild(document.createTextNode(UI.message.error));
        }
    });
});
//# sourceMappingURL=index.js.map