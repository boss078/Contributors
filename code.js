/* eslint-disable jquery/no-hide */
/* eslint-disable jquery/no-show */

let dataArray = [];
let contributors = [];

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

async function getAllObjects(objectUrls) {
  const promises = [];
  for (let i = 0; i < objectUrls.length; i += 1) {
    promises.push(fetch(objectUrls[i]).then((objectResponse) => objectResponse.json()));
  }
  let results = [];
  // Now that all the asynchronous operations are running, here we wait until they all complete.
  await Promise.all(promises).then((localResults) => {
    results = localResults;
  });
  return results;
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
    .then(async (data) => {
      if (data.constructor === Array) {
        const urls = [];
        for (let index = 0; index < data.length; index += 1) {
          urls.push(data[index].url);
        }
        contributors = await getAllObjects(urls);
        for (let index = 0; index < data.length; index += 1) {
          const object = data[index];
          const contributorWrapper = $('<div></div>').addClass('contributors__wrapper');
          const elementWrapper = $('<div></div>').addClass('row');

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
          contributorWrapper.addClass('gold');
          if (object.contributions <= 15) {
            elementGroup.text('Silver');
            contributorWrapper.addClass('silver');
            contributorWrapper.removeClass('gold');
          }
          if (object.contributions <= 5) {
            elementGroup.text('Bronse');
            contributorWrapper.addClass('bronse');
            contributorWrapper.removeClass('gold');
            contributorWrapper.removeClass('silver');
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
          const row3 = $('<div></div>').addClass('row');
          const editProfileButton = $('<button>Edit Profile</button>').addClass(`btn btn-primary col modal-${index}`);
          editProfileButton.attr('type', 'button');
          editProfileButton.attr('data-toggle', 'modal');
          editProfileButton.attr('data-target', '#profile-edit-modal');
          editProfileButton.attr('data-contributor-id', `${index}`);

          name.text(`Name: ${contributors[index].name}`);
          location.text(`Location: ${contributors[index].location}`);
          company.text(`Company: ${contributors[index].company}`);
          email.text(`Email: ${contributors[index].email}`);

          row1.append(name, location);
          row2.append(company, email);
          row3.append(editProfileButton);
          hiddenInfoWrapper.append(row1, row2, row3);

          elementWrapper.append(imageWrapper, loginWrapper, urlWrapper, groupWrapper, moreWrapper);
          contributorWrapper.append(elementWrapper);
          contributorWrapper.append(hiddenInfoWrapper);
          $('#loaded_data_ptr').append(contributorWrapper);
        }
      } else {
        noDataError(`${data.message}`);
      }
    },
    (error) => {
      serverError(error);
    });
  $('#group-selector').change(() => {
    $('.collapse').removeClass('show');
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
          const x = a.childNodes[0].childNodes[1].innerText.toLowerCase();
          const y = b.childNodes[0].childNodes[1].innerText.toLowerCase();
          if (x < y) { return -1; }
          if (x > y) { return 1; }
          return 0;
        });
        break;
      case 'Descending':
        dataArray.sort((a, b) => {
          const x = a.childNodes[0].childNodes[1].innerText.toLowerCase();
          const y = b.childNodes[0].childNodes[1].innerText.toLowerCase();
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
  // Triggered when modal is about to be shown
  $('#profile-edit-modal').on('show.bs.modal', (e) => {
    $('#modal-first-name').val('');
    $('#modal-last-name').val('');
    $('#modal-location').val('');
    $('#modal-phone').val('');
    $('#modal-extension').val('');
    $('#modal-company').val('');
    $('#modal-email').val('');
    $('#modal-account-name').text('');
    $('#modal-account-number').text('');

    const contributorId = $(e.relatedTarget).data('contributor-id');
    const currObject = contributors[contributorId];
    if (typeof currObject.name === 'string') {
      const nameSplitResult = currObject.name.split(' ');
      $('#modal-first-name').val(nameSplitResult[0]);
      let lastNameValue = '';
      for (let i = 1; i < nameSplitResult.length; i += 1) {
        lastNameValue += `${nameSplitResult[i]} `;
      }
      $('#modal-last-name').val(lastNameValue);
    }
    $('#modal-location').val(currObject.location);
    $('#modal-company').val(currObject.company);
    $('#modal-email').val(currObject.email);
    $('#modal-account-name').text(currObject.login);
    $('#modal-account-number').text(currObject.id);
  });
});
