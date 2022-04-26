// CONFIGURATION --------------------------------------------------------------

const JOKE_API :string = 'https://icanhazdadjoke.com';

const reportJokes :Array<object> = [];

class reviewedJoke {
  joke :string;
  score :number;
  date :string;

  constructor (joke :string, score :number, date :string) {
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

  let request = new Request(JOKE_API, {
    method: 'GET',
    headers: new Headers({
        'Accept': 'application/json',
        'User-Agent': 'IT Academy - React Course'
      })
  });

  function getRandomJoke() {
    return fetch(request)
      .then( res => res.json() )
      .then( json => json )
      .catch( error => error );
  }


// INTERFACE ------------------------------------------------------------------

let UI = {
  message: {
    waiting: 'Estem buscant un acudit...',
    error: 'Hem trobat un problema. Torna a intentar-ho.',
    thanks: 'Gràcies pel teu feedback!'
  },

  jokeWrapper: document.getElementById('joke-text'),

  showJoke(joke :string) {
    let txt = document.createElement('span');
    txt.appendChild( document.createTextNode(joke) );
    this.jokeWrapper?.replaceChildren( txt );
    this.jokeWrapper?.classList.add('filled');
    this.showFeedback();
    this.hideModal();
  },

  showFeedback() {
    let feedback = document.createElement('div');
    feedback.classList.add('feedback');
    feedback.innerHTML = `<p>Què opines sobre aquest acudit?</p>`;

    let emojis = score
      .map( item => `<a href="#" class="score" data-score="${item.points}">${item.emoji}</a>` );

    feedback.innerHTML += emojis.join('');

    this.jokeWrapper?.appendChild(feedback);
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


// EVENT LISTENERS ------------------------------------------------------------

  // Listening for a new joke request

  let newJoke = document.getElementById('next-joke');

  newJoke?.addEventListener('click', function() {
    UI.showModal(UI.message.waiting);

    getRandomJoke()
      .then( response => {
        UI.hideModal();

        if (response.joke) {
          UI.showJoke(response.joke);
        } else {
          UI.showModal(UI.message.error);
        }
      });
  });


  // Listening for a modal close request

  document.addEventListener('click', function(e :any) {
    if ( e.target && e.target?.id === 'close' ) {
      UI.hideModal();
    }
  });


  // Listening for joke votes

  document.addEventListener('click', function(e :any) {
    if ( e.target && e.target?.classList.contains('score') ) {
      let feedback, joke, score, date;

      feedback = e.target.parentElement;
      joke = feedback.parentElement.firstChild.innerText;
      score = e.target.getAttribute('data-score');
      let now = new Date();
      date = now.toISOString();

      reportJokes.push( new reviewedJoke( joke, score, date ) );
      console.log(reportJokes);

      feedback.replaceChildren( document.createTextNode( UI.message.thanks ) );

      e.preventDefault();
    }
  });
