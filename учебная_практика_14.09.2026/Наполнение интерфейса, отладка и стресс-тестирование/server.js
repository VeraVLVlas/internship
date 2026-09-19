import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getPartnersWithDiscount
} from '../Интеграция с БД и агрегация данных (SQL + Backend)/partnerService.js';

const app = express();

const port = 3000;

const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);

const uiPath = path.resolve(
  dirname,
  '../Разработка интерфейса (UI) по руководству по стилю'
);

app.use(express.static(uiPath));

app.get('/api/partners', async (request, response) => {
  try {
    const partners = await getPartnersWithDiscount();

    response.json(partners);
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message: 'Не удалось загрузить список партнеров'
    });
  }
});

app.get('/', (request, response) => {
  response.sendFile(
    path.join(uiPath, 'index.html')
  );
});

app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}`);
});
