"use strict";
const JOKE_API = 'https://icanhazdadjoke.com';
// Requesting a joke
let request = new Request(JOKE_API, {
    method: 'GET',
    headers: new Headers({
        'Accept': 'application/json',
        'User-Agent': 'IT Academy - React Course'
    })
});
function getRandomJoke() {
    fetch(request)
        .then(res => res.json())
        .then(json => {
        console.log(json);
        UI.showJoke(json.joke);
    })
        .catch(error => {
        console.log(error);
        UI.hideModal();
        UI.showModal(UI.message.error);
    });
}
// INTERFACE
let UI = {
    message: {
        waiting: 'Estem buscant un acudit...',
        error: 'Hem trobat un problema. Torna a intentar-ho.'
    },
    jokeWrapper: document.getElementById('joke-text'),
    showJoke(joke) {
        var _a, _b;
        (_a = this.jokeWrapper) === null || _a === void 0 ? void 0 : _a.replaceChildren(document.createTextNode(joke));
        (_b = this.jokeWrapper) === null || _b === void 0 ? void 0 : _b.classList.add('filled');
        this.hideModal();
    },
    showModal(msg) {
        let modal = document.createElement('div');
        modal.classList.add('modal');
        let paragraph = document.createElement('p');
        paragraph.appendChild(document.createTextNode(msg));
        modal.appendChild(paragraph);
        if (this.message.error === msg) {
            paragraph = document.createElement('p');
            let btn = document.createElement('button');
            btn.appendChild(document.createTextNode('Tancar'));
            btn.setAttribute('id', 'close');
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
// EVENT LISTENERS
let newJoke = document.getElementById('next-joke');
newJoke === null || newJoke === void 0 ? void 0 : newJoke.addEventListener('click', function () {
    UI.showModal(UI.message.waiting);
    getRandomJoke();
});
document.addEventListener('click', function (e) {
    var _a;
    if (e.target && ((_a = e.target) === null || _a === void 0 ? void 0 : _a.id) === 'close') {
        UI.hideModal();
    }
});
//# sourceMappingURL=index.js.map