import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.getElementById('search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

inputCountry.addEventListener(
  'input',
  debounce(countryInInput, DEBOUNCE_DELAY)
);

const cleanMarkup = ref => (ref.innerHTML = '');

function countryInInput() {
  const countries = inputCountry.value.trim();
  if (countries === '') {
    return (listCountry.innerHTML = ''), (infoCountry.innerHTML = '');
  }

  fetchCountries(countries)
    .then(text => {
      console.log(text);
      if (text.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(text);
    })
    .catch(err => {
      cleanMarkup(listCountry);
      cleanMarkup(infoCountry);
      Notify.failure('Oops, there is no country with that name');
    });
}

const renderMarkup = text => {
  if (text.length === 1) {
    cleanMarkup(listCountry);
    const markupInfo = renderInfoCountry(text);
    infoCountry.innerHTML = markupInfo;
  } else {
    cleanMarkup(inputCountry);
    const markupList = renderListCountry(text);
    listCountry.innerHTML = markupList;
  }
};

const renderListCountry = text => {
  return text
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const renderInfoCountry = text => {
  return text.map(
    ({ name, capital, population, flags, languages }) => `<h1><img src="${
      flags.png
    }" alt="${name.official}" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};
