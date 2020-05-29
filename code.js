function serverError(error) {
  const serverErrorWrapper = $('<div></div>').addClass('row');
  const serverErrorMessage = $('<div></div>').text(`Data could not be received due to server error\nError message: ${error}`);
  serverErrorMessage.addClass('col');
  serverErrorMessage.addClass('contributors__error-message');
  serverErrorWrapper.append(serverErrorMessage);
  $('#loaded_data_ptr').append(serverErrorWrapper);
}

function noDataError(error) {
  const serverErrorWrapper = $('<div></div>').addClass('row');
  const serverErrorMessage = $('<div></div>').text(`Looks like contributors list is empty\nError message: ${error}`);
  serverErrorMessage.addClass('col');
  serverErrorMessage.addClass('contributors__error-message');
  serverErrorWrapper.append(serverErrorMessage);
  $('#loaded_data_ptr').append(serverErrorWrapper);
}

$(() => {
  fetch('https://api.github.com/repos/thomasdavis/backbonetutorials/contributors')
    .then((response) => {
      if (typeof response === 'undefined') {
        serverError('response undefined');
      }
      return response.json();
    },
    (error) => {
      serverError(error);
    })
    .then((data) => {
      if (data.constructor === Array) {
        for (let index = 0; index < data.length; index += 1) {
          const object = data[index];
          const elementWrapper = $('<div></div>').addClass('row');
          elementWrapper.addClass('contributors__wrapper');

          const loginWrapper = $('<div></div>').addClass('col');
          loginWrapper.addClass('contributors__element-wrapper');
          const elementLogin = $('<div></div>').addClass('contributors__text');
          elementLogin.text(object.login);
          loginWrapper.append(elementLogin);

          const imageWrapper = $('<div></div>').addClass('col-2');
          imageWrapper.addClass('contributors__element-wrapper');
          const elementImage = $('<img></img>').addClass('contributors__avatar');
          elementImage.attr('src', object.avatar_url);
          imageWrapper.append(elementImage);

          const urlWrapper = $('<div></div>').addClass('col');
          urlWrapper.addClass('contributors__element-wrapper');
          const elementUrl = $('<a></a>').addClass('contributors__text');
          elementUrl.addClass('contributors__link');
          elementUrl.text(object.html_url);
          elementUrl.attr('href', object.html_url);
          urlWrapper.append(elementUrl);

          elementWrapper.append(imageWrapper, loginWrapper, urlWrapper);
          $('#loaded_data_ptr').append(elementWrapper);
        }
      } else {
        noDataError(`${data.message}`);
      }
    },
    (error) => {
      noDataError(error);
    });
});
