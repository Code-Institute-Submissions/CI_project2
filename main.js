
/* eslint-disable array-callback-return */
const apiKey = '6df48307c89d085c39e197339c408e8f';
const baseUrl = 'https://api.themoviedb.org/3/';
const imageUrl = 'https://image.tmdb.org/t/p/w1280';
const searchBtn = $('#search-btn');

// generate images
function generateImg(movies) {
  let moviesHTML = '';

  // eslint-disable-next-line no-restricted-syntax
  for (const movie of movies) {
    if (movie.poster_path) {
      moviesHTML = moviesHTML.concat(`<img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id} class='movie-img'/>`);
    }
  }

  return moviesHTML;
}

// get genres of movie result
function getGenre(result) {
  let genres = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const genre of result.genres) {
    genres += `<span>${genre.name}</span> `;
  }
  return genres;
}

// create movie info container
function createMovieContainer(movies, title = '') {
  const movieTemplate = `
  <h3>${title}</h3>
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
    <p><span> ${result.runtime} minutes</span> <span>${(result.release_date).slice(0, 4)}</span></p>
    <p class='genre'>${getGenre(result)}</p>
    <p class='movie-overview'>${result.overview}</p>
  </div>
  `;
  return template;
}

// generate iframe for youtube trailer
function createMovieVideo(result) {
  const template = `
  <div class='movie-video-container'>
    <iframe src='https://www.youtube.com/embed/${result[0].key}?ps=docs&controls=1' width='460' height='350' frameborder='0' allowfullscreen></iframe>
  </div>
  `;
  return template;
}

// render searched movies
function renderSearchedMovies(response) {
  $('#searchedWrapper').html('');
  $('#search-text').val('');
  const movies = response.results;
  const movieList = createMovieContainer(movies, this.title);
  $('#searchedWrapper').append(movieList);
}

function renderMovies(response) {
  const movies = response.results;
  const movieList = createMovieContainer(movies, this.title);
  $('#movieWrapper').append(movieList);
}

// ajax request function
function ajaxRequest(url, onComplete) {
  $.ajax(url).done(onComplete);
}

function searchMovie(searchText) {
  const searchUrl = `${baseUrl}search/movie?api_key=${apiKey}&query=${searchText}`;
  const render = renderSearchedMovies.bind({ title: `You searched for '${searchText}'` });
  ajaxRequest(searchUrl, render);
}

function upComingMovies() {
  const upComingUrl = `${baseUrl}movie/upcoming?api_key=${apiKey}&language=en-US`;
  const render = renderMovies.bind({ title: 'Coming Soon' });
  ajaxRequest(upComingUrl, render);
}

function nowPlayingMovies() {
  const nowPlayingUrl = `${baseUrl}movie/now_playing?api_key=${apiKey}`;
  const render = renderMovies.bind({ title: 'Now Playing' });
  ajaxRequest(nowPlayingUrl, render);
}

function popularMovies() {
  const popularUrl = `${baseUrl}movie/popular?api_key=${apiKey}`;
  const render = renderMovies.bind({ title: 'Popular Movies' });
  ajaxRequest(popularUrl, render);
}


// when document is ready
$(() => {
  // listen click on search button
  searchBtn.on('click', (e) => {
    e.preventDefault();
    const searchText = $('#search-text').val();
    searchMovie(searchText);
  });

  // listen for click on image
  $(document).on('click', (e) => {
    e.preventDefault();
    const { target } = e;
    if (target.className === 'movie-img') {
      const movieImg = $(target);
      const movieInfoContainer = movieImg.parent().parent().next();
      movieInfoContainer.addClass('container-display');
      $('body,html').animate(
        {
          scrollTop: movieImg.offset().top,
        },
        900, // speed
      );


      const movieId = movieImg.attr('data-movie-id');
      console.log(movieId);

      const movieUrl = `${baseUrl}movie/${movieId}?api_key=${apiKey}`;
      const movieInfoBlock = movieInfoContainer.children().next().children().next();
      console.log(movieInfoBlock);

      // generate movie info box with movie info and trailer
      $.ajax(movieUrl).done((response) => {
        const videoUrl = `${baseUrl}movie/${movieId}/videos?api_key=${apiKey}`;

        $.ajax(videoUrl).done((response2) => {
          movieInfoBlock.html('');
          const result = response;
          const movieInfo = createMovieInfo(result);
          movieInfoBlock.html(movieInfo);
          if (result.backdrop_path) {
            movieInfoBlock.css('background', `url(${imageUrl + result.backdrop_path}) no-repeat center center`);
            movieInfoBlock.css('background-size', 'cover');
          } else {
            movieInfoBlock.css('background', 'linear-gradient(90deg, rgba(22,22,22,1) 0%, rgba(5,5,5,1) 0%, rgba(60,0,0,1) 100%, rgba(255,0,0,1) 100%)');
          }
          const result2 = response2.results;
          if (result2[0]) {
            const video = createMovieVideo(result2);
            movieInfoBlock.append(video);
          }
        });
      });
    }

    // arrow buttons to scroll movie list horizontally
    if (target.className === 'left') {
      const left = $(e.target);
      left.prev().animate({
        scrollLeft: '-=400px',
      }, 'slow');
    }

    if (target.parentElement.className === 'left') {
      const left = $(target).parent();
      left.prev().animate({
        scrollLeft: '-=400px',
      }, 'slow');
    }

    if (target.className === 'right') {
      const right = $(e.target);
      right.prev().prev().animate({
        scrollLeft: '+=400px',
      }, 'slow');
    }

    if (target.parentElement.className === 'right') {
      console.log($(target).parent());
      const right = $(target).parent();
      right.prev().prev().animate({
        scrollLeft: '+=400px',
      }, 'slow');
    }


    // closes movie info when clicking on close button
    if (target.classList.contains('close-movie-btn')) {
      const close = $(target);
      close.parent().parent().removeClass('container-display');
    }
  });
});

upComingMovies();

nowPlayingMovies();

popularMovies();
