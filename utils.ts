export const isPlainObject = (value: unknown): boolean => {
  return (
    typeof value === "object" &&
    !!value &&
    Object.prototype.toString.call(value) === "[object Object]" &&
    value.constructor === Object
  );
};
