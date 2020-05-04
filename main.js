const apiKey = '6df48307c89d085c39e197339c408e8f';
const baseUrl = 'https://api.themoviedb.org/3/';

$(() => {
  $('#search-btn').on('click', (e) => {
    e.preventDefault();
    const searchText = $('#search-text').val();
    console.log(searchText);

    const settings = {
      url: `${baseUrl}search/movie?api_key=${apiKey}&query=${searchText}`,
      method: 'GET',
      timeout: 0,
    };

    $.ajax(settings).done((response) => {
      console.log(response);
    });
  });
});
