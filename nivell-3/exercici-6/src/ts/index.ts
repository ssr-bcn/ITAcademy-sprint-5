// CONFIGURATION --------------------------------------------------------------

// icanhazdadjoke: https://icanhazdadjoke.com
const JOKE_DAD_API :string = 'https://icanhazdadjoke.com';

// Chuck Norris API: https://api.chucknorris.io/
const JOKE_NORRIS_API :string = 'https://api.chucknorris.io/jokes/random';

// JokeAPI: https://sv443.net/jokeapi/v2/
const JOKE_JOKE_API :string = 'https://v2.jokeapi.dev/joke/Any?lang=en&blacklistFlags=nsfw&type=single';

// Weather API: https://www.weatherapi.com
const WEATHER_API :string = 'https://api.weatherapi.com/v1/current.json?key=6bcccdb5738c4fc1a1d134904222604&q=Barcelona&lang=es';

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


  function getAPIResponse(request :Request) {
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

  main: document.querySelector('main'),
  jokeWrapper: document.getElementById('joke-text'),
  weatherWrapper: document.getElementById('weather-container'),

  showWeatherData(icon :string, temp :string) {
    let image :Element, txt :Element;
    image = document.createElement('img');
    image.setAttribute('src', icon);

    txt = document.createElement('span');
    txt.appendChild( document.createTextNode(`${temp} °C`) );

    this.weatherWrapper?.appendChild(image);
    this.weatherWrapper?.appendChild(txt);
  },

  showJoke(joke :string) {
    let txt :Element = document.createElement('span');
    txt.appendChild( document.createTextNode( joke.replace('\n', ' ') ) );

    this.jokeWrapper?.replaceChildren( txt );

    this.showFeedback();
    this.hideModal();
  },

  showFeedback() {
    let feedback :Element = document.createElement('div');
    feedback.classList.add('feedback');
    feedback.innerHTML = `<p>Què opines sobre aquest acudit?</p>`;

    let emojis :Array<string> = score
      .map( ({points, emoji} ) => `<a href="#" class="score" data-score="${points}">${emoji}</a>` );

    feedback.innerHTML += emojis.join('');

    this.jokeWrapper?.appendChild(feedback);
  },

  showModal(msg :string) {
    let modal : Element = document.createElement('div');
    modal.classList.add('modal');

    let paragraph : Element = document.createElement('p');
    paragraph.appendChild( document.createTextNode(msg) );

    modal.appendChild(paragraph);

    if (this.message.error === msg) {
      let btn :Element = document.createElement('button');
      btn.appendChild( document.createTextNode('Tancar') );
      btn.setAttribute('id', 'close');

      paragraph = document.createElement('p');
      paragraph.appendChild(btn);

      modal.appendChild(paragraph);
    }

    document.body.prepend(modal);
  },

  hideModal() {
    let modal :Element | null= document.querySelector('.modal');
    modal?.remove();
  },

  changeBackground() {
    let classes :DOMTokenList | undefined = this.main?.classList;
    classes?.remove(...classes);
    classes?.add(`bg${ Math.floor( Math.random() * 8 ) + 1}`)
  }
};


// EVENT LISTENERS ------------------------------------------------------------

  // Listening for a new joke request

  let newJoke :Element | null = document.getElementById('next-joke');

  newJoke?.addEventListener('click', () => {
    UI.showModal(UI.message.waiting);

    let index :number = Math.floor( Math.random() * jokeRequests.length );

    getAPIResponse( jokeRequests[index].request )
      .then( response => {
        UI.hideModal();

        if (response[ jokeRequests[index].property ]) {
          UI.showJoke(response[ jokeRequests[index].property ]);
          UI.changeBackground();
        } else {
          UI.showModal(UI.message.error);
        }
      });
  });


  // Listening for a modal close request

  document.addEventListener('click', (e :any) => {
    if ( e.target && e.target?.id === 'close' ) {
      UI.hideModal();
    }
  });


  // Listening for a score vote

  document.addEventListener('click', (e :any) => {
    if ( e.target && e.target?.classList.contains('score') ) {
      let feedback :Element, joke :string, score :number, date :string;

      feedback = e.target.parentElement;
      joke = feedback?.parentElement?.firstChild?.textContent || '';
      score = e.target.getAttribute('data-score');
      let now = new Date();
      date = now.toISOString();

      reportJokes.push( new reviewedJoke(joke, score, date) );
      console.log(reportJokes);

      feedback.replaceChildren( document.createTextNode(UI.message.thanks) );

      e.preventDefault();
    }
  });

  // Listening for document ready

  window.addEventListener('DOMContentLoaded', (e :any) => {
    getAPIResponse( weatherRequest )
      .then( response => {
        if ( response.current ) {
          UI.showWeatherData(response.current.condition.icon, response.current.temp_c);
        } else {
          UI.weatherWrapper?.classList.add('error');
          UI.weatherWrapper?.appendChild( document.createTextNode(UI.message.error) );
        }
      });
  });
