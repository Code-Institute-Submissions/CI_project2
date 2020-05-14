
/* eslint-disable array-callback-return */
const apiKey = '6df48307c89d085c39e197339c408e8f';
const baseUrl = 'https://api.themoviedb.org/3/';
const imageUrl = 'https://image.tmdb.org/t/p/w1280';
const searchBtn = $('#search-btn');

// generate images
function generateImg(movies) {
  // eslint-disable-next-line consistent-return
  return movies.map((movie) => {
    if (movie.poster_path) {
      return `
      <div class='movie-card'>
        <img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id} class='movie-img'/> 
      </div>
    `;
    }
  });
}

// get genres of movie result
function getGenre(result) {
  let genres = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const genre of result.genres) {
    genres += `${genre.name} `;
  }
  return genres;
}

// create movie info container
function createMovieContainer(movies) {
  const movieTemplate = `
  <section class='movie-list'>
    ${generateImg(movies)}
  </section>
  <div class='movie-info-container'>
    <div class='movie-info'></div>
  </div>
  `;

  return movieTemplate;
}

// create movie info html
function createMovieInfo(result) {
  const template = `
  <div class='movie-info-text'>
    <h1 class='movie-title'>${result.title}</h1>
    <p> ${result.runtime} minutes, ${(result.release_date).slice(0, 4)}</p>
    <p class='genre'>${getGenre(result)}</p>
    <p class='movie-overview'>${result.overview}</p>
  </div>
  `;
  return template;
}

$(() => {
  // listen click on search button
  searchBtn.on('click', (e) => {
    e.preventDefault();

    const searchText = $('#search-text').val();
    console.log(searchText);

    const settings = {
      url: `${baseUrl}search/movie?api_key=${apiKey}&query=${searchText}`,
      method: 'GET',
      timeout: 0,
    };

    // generate movie list
    $.ajax(settings).done((response) => {
      $('.movie').html('');
      $('#search-text').val('');
      const movies = response.results;
      const movieList = createMovieContainer(movies);
      $('.movie').append(movieList);
    });
  });

  // listen for click on image
  $(document).on('click', (e) => {
    const { target } = e;
    if (target.className === 'movie-img') {
      const movieImg = $(target);
      const movieId = movieImg.attr('data-movie-id');
      console.log(movieId);

      const settings = {
        url: `${baseUrl}movie/${movieId}?api_key=${apiKey}`,
        method: 'GET',
        timeout: 0,
      };

      $.ajax(settings).done((response) => {
        $('.movie-info').html('');
        console.log(response);
        const result = response;
        const movieInfo = createMovieInfo(result);
        $('.movie-info').html(movieInfo);
        $('.movie-info').css('background-image', `url(${imageUrl + result.backdrop_path})`);
      });
    }
  });
});
