const JOKE_API :string = 'https://icanhazdadjoke.com';


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
    .then( res => res.json() )
    .then( json => {
      console.log(json);
      UI.showJoke(json.joke);
    })
    .catch( error => {
      console.log(error);
      UI.hideModal();
      UI.showModal( UI.message.error );
    });
}

// INTERFACE

let UI = {
  message: {
    waiting: 'Estem buscant un acudit...',
    error: 'Hem trobat un problema. Torna a intentar-ho.'
  },

  jokeWrapper: document.getElementById('joke-text'),

  showJoke(joke :string) {
    this.jokeWrapper?.replaceChildren( document.createTextNode(joke) );
    this.jokeWrapper?.classList.add('filled');
    this.hideModal();
  },

  showModal(msg :string) {
    let modal = document.createElement('div');
    modal.classList.add('modal');
    let paragraph = document.createElement('p');
    paragraph.appendChild( document.createTextNode(msg) );
    modal.appendChild(paragraph);

    if (this.message.error === msg) {
      paragraph = document.createElement('p');
      let btn = document.createElement('button');
      btn.appendChild( document.createTextNode('Tancar') );
      btn.setAttribute('id', 'close');
      paragraph.appendChild(btn);
      modal.appendChild(paragraph);
    }

    document.body.prepend(modal);
  },

  hideModal() {
    let modal = document.querySelector('.modal');
    modal?.remove();
  }
};


// EVENT LISTENERS
let newJoke = document.getElementById('next-joke');

newJoke?.addEventListener('click', function() {
  UI.showModal( UI.message.waiting );
  getRandomJoke();
});

document.addEventListener('click', function(e :any) {
  if( e.target && e.target?.id === 'close' ){
    UI.hideModal();
  }
});