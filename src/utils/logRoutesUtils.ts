import { Endpoint } from 'express-list-endpoints';

export function displayDataInTable(data: Endpoint[]) {
  console.table(data, ['path', 'methods', 'middlewares']);
}
