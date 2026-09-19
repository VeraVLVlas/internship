const requestsCount = 30;

const startedAt = Date.now();

const requests = Array.from(
  { length: requestsCount },
  () => fetch('http://localhost:3000/api/partners')
);

const results = await Promise.allSettled(requests);

const successful = results.filter(
  (result) =>
    result.status === 'fulfilled' &&
    result.value.ok
).length;

const failed = requestsCount - successful;

const duration = Date.now() - startedAt;

console.log(`Запросов: ${requestsCount}`);

console.log(`Успешно: ${successful}`);

console.log(`Ошибок: ${failed}`);

console.log(`Время: ${duration} ms`);
