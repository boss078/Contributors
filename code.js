/* eslint-disable jquery/no-hide */
/* eslint-disable jquery/no-show */

let dataArray;

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

function storeToArray() {
  const foundObjects = $('.bronse, .silver, .gold');
  dataArray = foundObjects;
  foundObjects.detach();
}

function moveFromArray() {
  $('#loaded_data_ptr').append(dataArray);
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
          const elementWrapper = $('<div></div>').addClass('row contributors__wrapper');

          const imageWrapper = $('<div></div>').addClass('col-2 contributors__element-wrapper');
          const elementImage = $('<img></img>').addClass('contributors__avatar');
          elementImage.attr('src', object.avatar_url);
          imageWrapper.append(elementImage);

          const loginWrapper = $('<div></div>').addClass('col-3 contributors__element-wrapper');
          const elementLogin = $('<div></div>').addClass('contributors__text login');
          elementLogin.text(object.login);
          loginWrapper.append(elementLogin);

          const urlWrapper = $('<div></div>').addClass('col-4 contributors__element-wrapper');
          const elementUrl = $('<a></a>').addClass('contributors__text contributors__link');
          elementUrl.text(object.html_url);
          elementUrl.attr('href', object.html_url);
          urlWrapper.append(elementUrl);

          const groupWrapper = $('<div></div>').addClass('col-2 contributors__element-wrapper');
          const elementGroup = $('<div></div>').addClass('contributors__text');
          elementGroup.text('Gold');
          elementWrapper.addClass('gold');
          if (object.contributions <= 15) {
            elementGroup.text('Silver');
            elementWrapper.addClass('silver');
            elementWrapper.removeClass('gold');
          }
          if (object.contributions <= 5) {
            elementGroup.text('Bronse');
            elementWrapper.addClass('bronse');
            elementWrapper.removeClass('gold');
            elementWrapper.removeClass('silver');
          }
          groupWrapper.append(elementGroup);

          const moreWrapper = $('<div></div>').addClass('col-1 contributors__element-wrapper');
          const elementMore = $('<button></button>').addClass('btn btn-secondary');
          elementMore.attr('data-toggle', 'collapse');
          elementMore.attr('data-target', `#info-${index}`);
          elementMore.text('More');
          moreWrapper.append(elementMore);

          const hiddenInfoWrapper = $('<div>/<div>').addClass('collapse');
          hiddenInfoWrapper.attr('id', `info-${index}`);

          const row1 = $('<div></div>').addClass('row');
          const name = $('<div></div>').addClass('col contributors__text');
          const location = $('<div></div>').addClass('col contributors__text');
          const row2 = $('<div></div>').addClass('row');
          const company = $('<div></div>').addClass('col contributors__text');
          const email = $('<div></div>').addClass('col contributors__text');

          fetch(object.url).then((objectResponse) => objectResponse.json())
            .then((objectData) => {
              name.text(`Name: ${objectData.name}`);
              location.text(`Location: ${objectData.location}`);
              company.text(`Company: ${objectData.company}`);
              email.text(`Email: ${objectData.email}`);
            });

          row1.append(name, location);
          row2.append(company, email);
          hiddenInfoWrapper.append(row1, row2);

          elementWrapper.append(imageWrapper, loginWrapper, urlWrapper, groupWrapper, moreWrapper);
          $('#loaded_data_ptr').append(elementWrapper);
          $('#loaded_data_ptr').append(hiddenInfoWrapper);
        }
      } else {
        noDataError(`${data.message}`);
      }
    },
    (error) => {
      noDataError(error);
    });
  $('#group-selector').change(() => {
    switch ($('#group-selector').find('option').filter(':selected')[0].innerText) {
      default:
      case 'All':
        $('.gold').show();
        $('.silver').show();
        $('.bronse').show();
        break;
      case 'Gold':
        $('.gold').show();
        $('.silver').hide();
        $('.bronse').hide();
        break;
      case 'Silver':
        $('.gold').hide();
        $('.silver').show();
        $('.bronse').hide();
        break;
      case 'Bronse':
        $('.gold').hide();
        $('.silver').hide();
        $('.bronse').show();
        break;
    }
  });
  $('#sort-direction-selector').change(() => {
    storeToArray();
    switch ($('#sort-direction-selector').find('option').filter(':selected')[0].innerText) {
      case 'Ascending':
        dataArray.sort((a, b) => {
          const x = a.childNodes[1].innerText.toLowerCase();
          const y = b.childNodes[1].innerText.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        break;
      case 'Descending':
        dataArray.sort((a, b) => {
          const x = a.childNodes[1].innerText.toLowerCase();
          const y = b.childNodes[1].innerText.toLowerCase();
          if (x < y) { return 1; }
          if (x > y) { return -1; }
          return 0;
        });
        break;
      default:
        break;
    }
    moveFromArray();
  });
});
