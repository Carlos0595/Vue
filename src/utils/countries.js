const countryCodeByName = {
  afghanistan: 'AF',
  alemania: 'DE',
  algeria: 'DZ',
  'arabia saudita': 'SA',
  argentina: 'AR',
  australia: 'AU',
  belgica: 'BE',
  bolivia: 'BO',
  brasil: 'BR',
  canada: 'CA',
  china: 'CN',
  colombia: 'CO',
  'corea del norte': 'KP',
  'corea del sur': 'KR',
  cuba: 'CU',
  egipto: 'EG',
  espana: 'ES',
  espanya: 'ES',
  'estados unidos': 'US',
  etiopia: 'ET',
  francia: 'FR',
  gaza: 'PS',
  georgia: 'GE',
  grecia: 'GR',
  india: 'IN',
  iran: 'IR',
  iraq: 'IQ',
  israel: 'IL',
  italia: 'IT',
  japon: 'JP',
  jordania: 'JO',
  libano: 'LB',
  libia: 'LY',
  marruecos: 'MA',
  mexico: 'MX',
  pakistan: 'PK',
  palestina: 'PS',
  peru: 'PE',
  polonia: 'PL',
  portugal: 'PT',
  'reino unido': 'GB',
  rumania: 'RO',
  rusia: 'RU',
  siria: 'SY',
  somalia: 'SO',
  sudan: 'SD',
  'sudan del sur': 'SS',
  taiwan: 'TW',
  turquia: 'TR',
  ucraina: 'UA',
  ucrania: 'UA',
  venezuela: 'VE',
  yemen: 'YE'
};

const normalizeCountryName = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const getCountryCode = (country = {}, countriesCatalog = []) => {
  if (country.code && /^[A-Z]{2}$/.test(country.code.trim().toUpperCase())) {
    return country.code.trim().toUpperCase();
  }

  const name = typeof country === 'string' ? country : country.name || '';
  const normalizedName = normalizeCountryName(name);

  if (!normalizedName) return null;

  const catalogMatch = countriesCatalog.find((item) => {
    const itemName = normalizeCountryName(item.name || item.countryName || '');
    const itemCode = (item.code || item.isoCode || item.iso2 || '').trim().toUpperCase();
    return itemName === normalizedName && /^[A-Z]{2}$/.test(itemCode);
  });

  if (catalogMatch) {
    return (catalogMatch.code || catalogMatch.isoCode || catalogMatch.iso2).trim().toUpperCase();
  }

  return countryCodeByName[normalizedName] || null;
};

export const normalizeConflictCountries = (countries = [], countriesCatalog = []) =>
  countries
    .filter(Boolean)
    .map((country) => {
      const name = typeof country === 'string' ? country.trim() : (country.name || '').trim();
      const code = getCountryCode(country, countriesCatalog);

      return {
        ...(typeof country === 'object' ? country : {}),
        name,
        code
      };
    })
    .filter((country) => country.name);
