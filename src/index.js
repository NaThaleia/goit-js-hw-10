import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  clinPage();

  let searchCountry = e.target.value.trim();

  if (!searchCountry) {
    Notify.info('Type country name.');
    return;
  }

  fetchCountries(searchCountry)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      }
      if (countries.length > 1 && countries.length <= 10) {
        renderList(countries);
      } else if (countries.length === 1) {
        renderCountry(countries[0]);
      }
    })
    .catch(onError);
}

function renderList(countries) {
  const elements = countries
    .map(country => {
      return `<li class="country-list__item"><img class="icon" src=${country.flags.svg} alt="Flag of country" width="20">${country.name.official}</li>`;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('afterbegin', elements);
}

function renderCountry(country) {
  const lang = Object.values(country.languages);
  const markup = ` <div><img src=${country.flags.svg} alt="Flag of country" width="40"><h2>${country.name.official}</h2></div>
<p><span">Capital:</span> ${country.capital}</p>
<p><span">Population:</span> ${country.population}</p>
<p><span">Languages:</span> ${lang}</p>`;

  refs.countryInfo.insertAdjacentHTML('afterbegin', markup);
}

function clinPage() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function onError() {
  clinPage();
  Notify.failure('Oops, there is no country with that name');
}
