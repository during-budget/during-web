export function isEnumValue<T extends Record<string, any>>(
  enumObj: T,
  value: any
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}
