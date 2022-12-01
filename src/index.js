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

function countryInInput() {
  const text = inputCountry.value.trim();
  if (text === '') {
    return (listCountry.innerHTML = ''), (infoCountry.innerHTML = '');
  }

  fetchCountries(text)
    .then(countries => {
      listCountry.innerHTML = '';
      infoCountry.innerHTML = '';
      if (countries.length === 1) {
        listCountry.insertAdjacentHTML('beforeend', renderlistCountry(text));
        infoCountry.insertAdjacentHTML('beforeend', renderInfoCountry(text));
      } else if (text.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      } else {
        listCountry.insertAdjacentHTML('beforeend', renderlistCountry(text));
      }
    })
    .catch(Notify.failure('Oops, there is no country with that name'));
}

function renderlistCountry(text) {
  const markup = text
    .map(({ name, flags }) => {
      return `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`;
    })
    .join('');
}

function renderInfoCountry(text) {
  const markup = text
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1><img src="${flags.png}" alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`;
    })
    .join('');
  return markup;
}
