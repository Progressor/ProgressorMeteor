export function escapeRegExp(value) {
  return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}
