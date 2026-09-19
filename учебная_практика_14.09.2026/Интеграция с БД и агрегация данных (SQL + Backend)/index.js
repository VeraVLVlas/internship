// тестовый скрипт для проверки выполнения запроса

import { getPartnerWithDiscount } from './partnerService.js';
import { pool } from './db.js';

const partner = await getPartnerWithDiscount(1);

console.log(partner);

await pool.end();
