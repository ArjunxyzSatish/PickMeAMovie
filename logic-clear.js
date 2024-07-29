const button = document.querySelector('button');
let number = document.querySelector("#number");
const list = document.querySelector(`ul`);
let genre = document.querySelector("#genre");
const poster = document.querySelector("#poster");

let urlBase = `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=`;

const genreList = [
		{
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }

]


let credentials;

fetch('/api/credentials')
.then(response => response.json())
.then(data => {
  credentials = data;
})
.catch(error => console.error('Error fetching credentials: ', error));

button.addEventListener("click", () => {
	let randomId = genreList[Math.floor(19*Math.random())].id;

	let genreId = genre.value;
	let numSug = number.value;

	if(genreId == 0) {
		genreId = randomId;
	}
	
	let urlFinal = `${urlBase}${genreId}&api_key=${credentials.api_key}`;  

	list.innerHTML = "";
	poster.innerHTML = "";

  for(let i=0; i<numSug; i++){
  fetch(`${urlFinal}&page=${i+1}`)
  .then(data => {return data.json()})
  .then(res => movies = res)
  .then( (movies) => {
    selectAndAttach();
  });
}
});

function selectAndAttach() {
	let maxNumber = movies.results.length;
	let randomNumber = Math.floor(maxNumber*Math.random());

	let newItem = document.createElement("li");
    let node = document.createTextNode(`${movies.results[randomNumber].title} : ${movies.results[randomNumber].vote_average}/10`);

	let moviePoster = document.createElement("img");
	let posterPath = `https://image.tmdb.org/t/p/w185_and_h278_bestv2${movies.results[randomNumber].poster_path}`;

    moviePoster.src=`${posterPath}`;
    moviePoster.classList.add("padmeup");

    var tmdbURL = `https://www.themoviedb.org/movie/${movies.results[randomNumber].id}`;

    moviePoster.addEventListener("click", () => {
        window.open(tmdbURL)
    });

	newItem.appendChild(node);
    list.appendChild(newItem);
  
    newItem.classList.add("movieList");
    newItem.addEventListener("click", () => {
        window.open(tmdbURL)
    })

    poster.appendChild(moviePoster);
}
