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

const messageBox = document.querySelector('#message-box');
const messageBoxIcon = document.querySelector('#message-box-icon');
const messageBoxTitle = document.querySelector('#message-box-title');
const messageBoxText = document.querySelector('#message-box-text');
const messageBoxActions = document.querySelector('#message-box-actions');

const partnerTypes = [
  'ООО',
  'ЗАО',
  'ОАО',
  'ИП'
];

let hasUnsavedChanges = false;


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


function showMessageBox({
  type,
  title,
  message,
  confirmText = 'OK',
  cancelText = null
}) {
  return new Promise((resolve) => {
    const icons = {
      error: '❌',
      warning: '⚠️',
      information: 'ℹ️'
    };

    messageBoxIcon.textContent = icons[type];
    messageBoxTitle.textContent = title;
    messageBoxText.textContent = message;
    messageBoxActions.innerHTML = '';

    if (cancelText) {
      const cancelButton = document.createElement('button');

      cancelButton.type = 'button';
      cancelButton.className = 'button button--secondary';
      cancelButton.textContent = cancelText;

      cancelButton.addEventListener('click', () => {
        messageBox.close();
        resolve(false);
      });

      messageBoxActions.append(cancelButton);
    }

    const confirmButton = document.createElement('button');

    confirmButton.type = 'button';
    confirmButton.className = 'button button--primary';
    confirmButton.textContent = confirmText;

    confirmButton.addEventListener('click', () => {
      messageBox.close();
      resolve(true);
    });

    messageBoxActions.append(confirmButton);

    messageBox.showModal();
  });
}


function validatePartnerData(partnerData) {
  if (!partnerData.companyName) {
    throw new Error(
      'Наименование партнера обязательно. Пожалуйста, заполните поле «Наименование» и повторите попытку.'
    );
  }

  if (!partnerData.inn) {
    throw new Error(
      'ИНН обязателен. Пожалуйста, заполните поле «ИНН» и повторите попытку.'
    );
  }

  if (!/^\d+$/.test(partnerData.inn)) {
    throw new Error(
      'ИНН должен содержать только цифры. Пожалуйста, удалите пробелы, буквы и другие символы и повторите попытку.'
    );
  }

  if (
    partnerData.inn.length !== 10 &&
    partnerData.inn.length !== 12
  ) {
    throw new Error(
      'ИНН должен содержать 10 или 12 цифр. Пожалуйста, проверьте длину ИНН и повторите попытку.'
    );
  }

  if (!partnerData.email) {
    throw new Error(
      'Email компании обязателен. Пожалуйста, укажите адрес электронной почты и повторите попытку.'
    );
  }

  if (
    !Number.isInteger(partnerData.rating) ||
    partnerData.rating < 0
  ) {
    throw new Error(
      'Рейтинг должен быть целым неотрицательным числом. Пожалуйста, удалите буквы, дробные значения или знаки препинания и повторите попытку.'
    );
  }
}


async function loadPartner(id) {
  try {
    const response = await fetch(`/api/partners/${id}`);

    if (!response.ok) {
      throw new Error(
        'Не удалось загрузить данные партнера. Проверьте подключение к базе данных и повторите попытку.'
      );
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

    hasUnsavedChanges = false;

  } catch (error) {
    await showMessageBox({
      type: 'error',
      title: 'Ошибка загрузки',
      message: error.message
    });
  }
}


partnerForm.addEventListener('input', () => {
  hasUnsavedChanges = true;
});

partnerForm.addEventListener('change', () => {
  hasUnsavedChanges = true;
});

partnerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
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

    validatePartnerData(partnerData);

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
      throw new Error(
        'Не удалось сохранить данные. Проверьте подключение к базе данных и повторите попытку.'
      );
    }

    hasUnsavedChanges = false;

    await showMessageBox({
      type: 'information',
      title: 'Сохранение выполнено',
      message: isEditMode
        ? 'Данные партнера успешно обновлены.'
        : 'Новый партнер успешно добавлен в базу данных.'
    });

    window.location.href = './index.html';
  } catch (error) {
    await showMessageBox({
      type: 'error',
      title: 'Ошибка',
      message: error.message
    });
  }
});


backButton.addEventListener('click', async () => {
  if (!hasUnsavedChanges) {
    window.location.href = './index.html';
    return;
  }

  const confirmed = await showMessageBox({
    type: 'warning',
    title: 'Несохраненные изменения',
    message:
      'В форме есть несохраненные изменения. При выходе они будут безвозвратно потеряны.\n\nВы действительно хотите вернуться назад?',
    confirmText: 'Выйти без сохранения',
    cancelText: 'Остаться'
  });

  if (confirmed) {
    window.location.href = './index.html';
  }
});
