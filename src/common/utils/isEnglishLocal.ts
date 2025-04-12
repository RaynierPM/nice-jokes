const englishRegExp = /^en(.*)$/gi;

export function isEnglishLocale(locale: string) {
  return englishRegExp.test(locale);
}
