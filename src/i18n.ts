import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'fr'];

export default getRequestConfig(async ({requestLocale}) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale && locales.includes(requestedLocale) ? requestedLocale : 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
