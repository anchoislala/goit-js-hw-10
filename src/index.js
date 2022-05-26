import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const divCountry = document.querySelector('.country-info');
const listCountries = document.querySelector('.country-list');

inputCountry.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(evt) {
    
    const searchCountry = inputCountry.value.trim();
    divCountry.innerHTML = '';
    listCountries.innerHTML = '';

    if (searchCountry) {

    fetchCountries(searchCountry)
    .then(showResultOfSearchingCountries)
    .catch(onFetchError);  
    }
};

function showResultOfSearchingCountries(country) {

    if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }

    renderCountry(country);
}

function renderCountry(country) {

    const countriesListMarkup = country.map(({ flags: { svg }, name: { common } }) => {
        return `<li><img src="${svg}" alt="${common}" width="60" height="40"/><span class ="country">${common}</span></li>`;
      })
        .join('');

    if (country.length == 1) {
        listCountries.innerHTML = '';
        renderCountryCard(country);
        return;
    }
   
   return listCountries.insertAdjacentHTML('beforeend', countriesListMarkup);
}

function renderCountryCard(country) {

    const languages = Object.values(country[0].languages).join(', ');
    const countryMarkup = `<h2>
        <img src="${country[0].flags.svg}" alt="${country[0].name.common}" width="60" height="35">
        Country: ${country[0].name.common}</h2>
      <ul>
        <li><span>Capital:</span> ${country[0].capital}</li>
        <li><span>Population:</span> ${country[0].population}</li>
        <li><span>Languages:</span> ${languages}</li>
      </ul> `;

    divCountry.insertAdjacentHTML('beforeend', countryMarkup);
};

function onFetchError(error) {
    Notify.failure('Oops, there is no country with that name');
};












