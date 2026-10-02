const addPartnerButton = document.querySelector('#add-partner-button');
const historyButton = document.querySelector('#history-button');
const partnersList = document.querySelector('#partners-list');

let selectedPartnerId = null;

function saveMainWindowState() {
  const state = {
    scrollPosition: window.scrollY
  };

  sessionStorage.setItem(
    'mainWindowState',
    JSON.stringify(state)
  );
}

function restoreMainWindowState() {
  const savedState = sessionStorage.getItem('mainWindowState');

  if (!savedState) {
    return;
  }

  const state = JSON.parse(savedState);

  window.scrollTo({
    top: state.scrollPosition,
    behavior: 'instant'
  });
}

function createPartnerCard(partner) {
  return `
    <article
      class="partner-card"
      data-partner-id="${partner.partner_id}"
    >
      <div class="partner-card__header">
        <h2 class="partner-card__name">
          ${partner.partner_type ?? ''}
          |
          ${partner.company_name}
        </h2>

        <p class="partner-card__discount">
          ${partner.discount}%
        </p>
      </div>

      <div class="partner-card__info">
        <p>${partner.director ?? ''}</p>
        <p>${partner.phone ?? ''}</p>
        <p>${partner.contact_email ?? ''}</p>
        <p>Рейтинг: ${partner.rating ?? 0}</p>
      </div>
    </article>
  `;
}

async function loadPartners() {
  const response = await fetch('/api/partners');

  const partners = await response.json();

  partnersList.innerHTML = partners
    .map(createPartnerCard)
    .join('');

  restoreMainWindowState();
}

addPartnerButton.addEventListener('click', () => {
  saveMainWindowState();

  window.location.href =
    './partner-edit.html?mode=create';
});

// ID выбранного партнера передается через URL в окно редактирования.
partnersList.addEventListener('dblclick', (event) => {
  const card = event.target.closest('.partner-card');

  if (!card) {
    return;
  }

  saveMainWindowState();

  const partnerId = card.dataset.partnerId;

  window.location.href =
    `./partner-edit.html?mode=edit&id=${partnerId}`;
});

partnersList.addEventListener('click', (event) => {
  const card = event.target.closest('.partner-card');

  if (!card) {
    return;
  }

  document
    .querySelectorAll('.partner-card')
    .forEach((partnerCard) => {
      partnerCard.classList.remove('partner-card--selected');
    });

  card.classList.add('partner-card--selected');

  selectedPartnerId = card.dataset.partnerId;

  historyButton.disabled = false;
});


historyButton.addEventListener('click', () => {
  if (!selectedPartnerId) {
    return;
  }

  window.location.href =
    `./partner-history.html?id=${selectedPartnerId}`;
});

loadPartners();
