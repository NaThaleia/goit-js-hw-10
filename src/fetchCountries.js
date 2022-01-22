const BASE_REQUEST = 'https://restcountries.com/v3.1';

export default function fetchCountries(name) {
  return fetch(`${BASE_REQUEST}/name/${name}?fields=name,capital,population,flags,languages`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    },
  );
}
