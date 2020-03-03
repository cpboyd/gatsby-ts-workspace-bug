export function regexEscape(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, `\\$&`);
}

export function replaceAll(
  str: string,
  toReplace: string,
  replaceWith = ``
): string {
  const regex = RegExp(regexEscape(toReplace), `gi`);
  return str.replace(regex, replaceWith);
}

export function trimAll(str: string, characters: string): string {
  const regex = RegExp(`^[${characters}]+|[${characters}]+$`, `g`);
  return str.replace(regex, ``);
}
