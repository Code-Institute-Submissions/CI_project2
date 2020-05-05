/* eslint-disable array-callback-return */
const apiKey = '6df48307c89d085c39e197339c408e8f';
const baseUrl = 'https://api.themoviedb.org/3/';
const imageUrl = 'https://image.tmdb.org/t/p/w500';
const searchBtn = $('#search-btn');

function generateImg(movies) {
  // eslint-disable-next-line consistent-return
  return movies.map((movie) => {
    if (movie.poster_path) {
      return `
      <img src=${imageUrl + movie.poster_path} data-movie-id=${movie.id}/>    
    `;
    }
  });
}

function createMovieContainer(movies) {
  const movieTemplate = `
  <section class='movie-list'>
    ${generateImg(movies)}
  </section>
  <div class='movie-info'>
    <p id='closeBtn'>X</p>
  </div>
  `;

  return movieTemplate;
}

$(() => {
  searchBtn.on('click', (e) => {
    e.preventDefault();

    const searchText = $('#search-text').val();
    console.log(searchText);

    const settings = {
      url: `${baseUrl}search/movie?api_key=${apiKey}&query=${searchText}`,
      method: 'GET',
      timeout: 0,
    };

    $.ajax(settings).done((response) => {
      $('.movie').html('');
      console.log(response);
      const movies = response.results;
      const movieList = createMovieContainer(movies);
      $('.movie').append(movieList);
    });
  });
});
