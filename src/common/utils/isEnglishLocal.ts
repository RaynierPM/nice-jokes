const englishRegExp = /^en(.*)$/gi;

export function isEnglishLocale(locale: string) {
  return locale.match(englishRegExp);
}
