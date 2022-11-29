const getUrl = name =>
  `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`;

const fetchCountries = name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;

  const url = getUrl(parsedName);
  return fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('No countries for such query!');

      return res.json();
    })
    .then(countries => {
      console.log(countries);
      if (countries.length > 10)
        return displayAlert('Too many countries found. Be more specific!');
      if (countries.length === 1) return displayCountryCard(countries[0]);
      return displayCountriesList(countries);
    })
    .catch(error => {
      console.error(error);
      displayAlert(error.message, 'error');
    });
};

export { fetchCountries };
