
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
      return `<img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id} class='movie-img'/>`;
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
    <div class='image-list'>
      ${generateImg(movies)}
    </div>
    <button class='left'><i class="fas fa-chevron-left"></i></button>
    <button class='right'><i class="fas fa-chevron-right"></i></button>
  </section>
  <div id="movieInfoContainer" class='movie-info-container'>
    <p class="close-movie-info"><i class=" close-movie-btn far fa-times-circle"></i></p>
    <div class='movie-info-wrapper'>
      <div class='backdrop-overlay'></div>
      <div class='movie-info'></div>
    </div>
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

function createMovieVideo(result) {
  const template = `
  <div class='movie-video-container'>
    <iframe src='https://www.youtube.com/embed/${result[0].key}?ps=docs&controls=1' width='460' height='350' frameborder='0' allowfullscreen autoplay=1></iframe>
  </div>
  `;
  return template;
}

function renderSearchedMovies(response) {
  $('.movie').html('');
  $('#search-text').val('');
  const movies = response.results;
  const movieList = createMovieContainer(movies);
  $('.movie').append(movieList);
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
    $.ajax(settings).done(renderSearchedMovies);
  });

  // listen for click on image
  $(document).on('click', (e) => {
    e.preventDefault();
    const { target } = e;
    if (target.className === 'movie-img') {
      $('#movieInfoContainer').addClass('container-display');
      const movieImg = $(target);
      const movieId = movieImg.attr('data-movie-id');
      console.log(movieId);

      const settings = {
        url: `${baseUrl}movie/${movieId}?api_key=${apiKey}`,
        method: 'GET',
        timeout: 0,
      };

      $.ajax(settings).done((response) => {
        const settings2 = {
          url: `${baseUrl}movie/${movieId}/videos?api_key=${apiKey}`,
          method: 'GET',
          timeout: 0,
        };

        $.ajax(settings2).done((response2) => {
          $('.movie-info').html('');
          console.log(response);
          const result = response;
          const movieInfo = createMovieInfo(result);
          $('.movie-info').html(movieInfo);
          if (result.backdrop_path) {
            $('.movie-info').css('background-image', `url(${imageUrl + result.backdrop_path})`);
          } else {
            $('.movie-info').css('background', 'linear-gradient(90deg, rgba(22,22,22,1) 0%, rgba(5,5,5,1) 0%, rgba(60,0,0,1) 100%, rgba(255,0,0,1) 100%)');
          }
          const result2 = response2.results;
          if (result2[0]) {
            const video = createMovieVideo(result2);
            $('.movie-info').append(video);
          }
        });
      });
    }

    if (target.className === 'left') {
      console.log('clicked left');
      $('.image-list').animate({
        scrollLeft: '-=400px',
      }, 'slow');
    }
    if (target.className === 'right') {
      console.log('clicked right');
      $('.image-list').animate({
        scrollLeft: '+=400px',
      }, 'slow');
    }

    if (target.classList.contains('close-movie-btn')) {
      $('#movieInfoContainer').removeClass('container-display');
    }
  });
});
