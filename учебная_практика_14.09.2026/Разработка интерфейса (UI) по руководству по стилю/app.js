const partnersList = document.querySelector('#partners-list');
const status = document.querySelector('#status');
const refreshButton = document.querySelector('#refresh-button');

function createInfoLine(text) {
  const paragraph = document.createElement('p');

  paragraph.textContent = text;

  return paragraph;
}

function createPartnerCard(partner) {
  const card = document.createElement('article');

  card.className = 'partner-card';

  const header = document.createElement('div');

  header.className = 'partner-card__header';

  const name = document.createElement('h2');

  name.className = 'partner-card__name';

  name.textContent = partner.company_name;

  const discount = document.createElement('p');

  discount.className = 'partner-card__discount';

  discount.textContent = `${partner.discount}%`;

  header.append(name, discount);

  const info = document.createElement('div');

  info.className = 'partner-card__info';

  info.append(
    createInfoLine(`ИНН: ${partner.inn ?? 'Не указан'}`),
    createInfoLine(`Email: ${partner.contact_email ?? 'Не указан'}`),
    createInfoLine(`Телефон: ${partner.phone ?? 'Не указан'}`),
    createInfoLine(`Рейтинг: ${partner.rating ?? 'Не указан'}`),
    createInfoLine(`Объем продаж: ${partner.total_quantity} ед.`)
  );

  card.append(header, info);

  return card;
}

function renderPartners(partners) {
  partnersList.replaceChildren();

  if (partners.length === 0) {
    status.textContent = 'Партнеры не найдены';

    return;
  }

  partners.forEach((partner) => {
    partnersList.append(createPartnerCard(partner));
  });

  status.textContent = `Всего партнеров: ${partners.length}`;
}

async function loadPartners() {
  status.textContent = 'Загрузка...';

  try {
    const response = await fetch('/api/partners');

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }

    const partners = await response.json();

    renderPartners(partners);
  } catch (error) {
    console.error(error);

    partnersList.replaceChildren();

    status.textContent = 'Не удалось загрузить данные';
  }
}

refreshButton.addEventListener('click', loadPartners);

loadPartners();
