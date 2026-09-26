const backButton = document.querySelector('#back-button');
const partnerTypeSelect = document.querySelector('#partner-type');
const formTitle = document.querySelector('#partner-form-title');
const formSubtitle = document.querySelector('#partner-form-subtitle');

const partnerTypes = [
  'ООО',
  'ЗАО',
  'ОАО',
  'ИП'
];

// Типы партнеров задаются программно, чтобы список можно было менять в одном месте.
partnerTypes.forEach((partnerType) => {
  const option = document.createElement('option');

  option.value = partnerType;
  option.textContent = partnerType;

  partnerTypeSelect.append(option);
});

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

// Режим передается через URL и определяет назначение карточки партнера.
if (mode === 'edit') {
  document.title = 'CRM: Карточка партнера [Редактирование]';
  formSubtitle.textContent = 'Редактирование данных партнера';
} else {
  document.title = 'CRM: Карточка партнера [Добавление]';
  formSubtitle.textContent = 'Добавление нового партнера';
}

backButton.addEventListener('click', () => {
  window.location.href = './index.html';
});
