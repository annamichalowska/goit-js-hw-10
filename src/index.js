import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.getElementById('search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');
//const linkCountry = document.getElementById('link-country');

inputCountry.addEventListener(
  'input',
  debounce(countryInInput, DEBOUNCE_DELAY)
);

function countryInInput() {
  const countries = inputCountry.value.trim();
  var RegExpression = /^[a-zA-Z\s\-]*$/;
  if (countries === '') {
    return (listCountry.innerHTML = ''), (infoCountry.innerHTML = '');
  } else if (!RegExpression.test(countries)) {
    Notify.failure('Please use only letters, spaces and "-"');
  } else {
    fetchCountries(countries)
      .then(text => {
        if (text.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
          return;
        }
        renderMarkup(text);
      })
      .catch(err => {
        listCountry.innerHTML = '';
        infoCountry.innerHTML = '';
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

const renderMarkup = text => {
  if (text.length === 1) {
    listCountry.innerHTML = '';
    const markupInfo = renderInfoCountry(text);
    infoCountry.innerHTML = markupInfo;
  } else {
    inputCountry.innerHTML = '';
    const markupList = renderListCountry(text);
    listCountry.innerHTML = markupList;
    listCountry.addEventListener('click', event => {
      const countryFromLink = event.target.innerHTML;
      listCountry.innerHTML = '';
      fetchCountries(countryFromLink).then(text => {
        renderMarkup(text);
      });
    });
  }
};

const renderListCountry = text => {
  return text
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.common}" width="60" height="40"><a href="#" id=link-country>${name.common}</a></li>`
    )
    .join('');
};

const renderInfoCountry = text => {
  return text.map(
    ({ name, capital, population, flags, languages }) => `<h1><img src="${
      flags.png
    }" alt="${name.common}" width="40" height="40">${name.common}</h1>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages).join(', ')} </p>`
  );
};
