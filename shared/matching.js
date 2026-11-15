export function matchEvent(event, needs) {
  const supported = needs.filter((k) => event.access[k] === true);
  const unavailable = needs.filter((k) => event.access[k] === false);
  const unknown = needs.filter((k) => event.access[k] == null);
  return {
    supported,
    unavailable,
    unknown,
    total: needs.length,
    score: needs.length
      ? Math.round((supported.length / needs.length) * 100)
      : null,
  };
}
