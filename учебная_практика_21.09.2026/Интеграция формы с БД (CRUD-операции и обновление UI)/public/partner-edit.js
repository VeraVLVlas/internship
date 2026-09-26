const partnerForm = document.querySelector('#partner-form');
const backButton = document.querySelector('#back-button');
const partnerTypeSelect = document.querySelector('#partner-type');
const formSubtitle = document.querySelector('#partner-form-subtitle');

const companyNameInput = document.querySelector('#company-name');
const innInput = document.querySelector('#inn');
const ratingInput = document.querySelector('#rating');
const addressInput = document.querySelector('#address');
const directorInput = document.querySelector('#director');
const phoneInput = document.querySelector('#phone');
const emailInput = document.querySelector('#email');

const partnerTypes = [
  'ООО',
  'ЗАО',
  'ОАО',
  'ИП'
];

// Типы партнеров задаются программно, чтобы список менялся в одном месте.
partnerTypes.forEach((partnerType) => {
  const option = document.createElement('option');

  option.value = partnerType;
  option.textContent = partnerType;

  partnerTypeSelect.append(option);
});

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');
const partnerId = params.get('id');


// ID передается из главной формы через URL только в режиме редактирования.
if (mode === 'edit' && partnerId) {
  document.title =
    'CRM: Карточка партнера [Редактирование]';

  formSubtitle.textContent =
    'Редактирование данных партнера';

  loadPartner(partnerId);
} else {
  document.title =
    'CRM: Карточка партнера [Добавление]';

  formSubtitle.textContent =
    'Добавление нового партнера';
}


async function loadPartner(id) {
  const response = await fetch(`/api/partners/${id}`);

  if (!response.ok) {
    console.error('Не удалось загрузить партнера');
    return;
  }

  const partner = await response.json();

  companyNameInput.value = partner.company_name ?? '';
  innInput.value = partner.inn ?? '';
  partnerTypeSelect.value = partner.partner_type ?? 'ООО';
  ratingInput.value = partner.rating ?? 0;
  addressInput.value = partner.address ?? '';
  directorInput.value = partner.director ?? '';
  phoneInput.value = partner.phone ?? '';
  emailInput.value = partner.contact_email ?? '';
}


partnerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const partnerData = {
    companyName: companyNameInput.value.trim(),
    inn: innInput.value.trim(),
    partnerType: partnerTypeSelect.value,
    rating: Number(ratingInput.value),
    address: addressInput.value.trim(),
    director: directorInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim()
  };

  const isEditMode =
    mode === 'edit' && partnerId;

  const url = isEditMode
    ? `/api/partners/${partnerId}`
    : '/api/partners';

  const method = isEditMode
    ? 'PUT'
    : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(partnerData)
  });

  if (!response.ok) {
    console.error('Ошибка сохранения');
    return;
  }

  window.location.href = './index.html';
});


backButton.addEventListener('click', () => {
  window.location.href = './index.html';
});
