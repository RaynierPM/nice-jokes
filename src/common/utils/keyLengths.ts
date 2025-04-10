const RegWilds = Object.freeze({
  "*": ".",
});

export function getKeyLengths<T = unknown>(
  data: Record<string, T>,
  key: string,
) {
  const keys = Object.keys(data);
  const keyRegExp = getRegexp(key);

  return keys.reduce<number>((state, curKey) => {
    if (keyRegExp.test(curKey)) {
      state++;
    }
    return state;
  }, 0);
}

function getRegexp(value: string) {
  let newValue = value;
  Object.entries(RegWilds).forEach(([wild, regValue]) => {
    newValue = newValue
      .replace(new RegExp(`\\${regValue}`, "gi"), `\\${regValue}`)
      .replace(wild, regValue);
  });

  return new RegExp(newValue);
}
