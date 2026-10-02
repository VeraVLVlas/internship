const partnerName = document.querySelector('#partner-name');
const historyBody = document.querySelector('#history-body');
const emptyHistory = document.querySelector('#empty-history');
const backButton = document.querySelector('#back-button');

const params = new URLSearchParams(window.location.search);
const partnerId = params.get('id');

async function loadPartnerHistory() {
  if (!partnerId) {
    partnerName.textContent = 'Партнер не выбран';
    return;
  }

  try {
    const response = await fetch(
      `/api/partners/${partnerId}/history`
    );

    if (!response.ok) {
      throw new Error(
        'Не удалось загрузить историю продаж.'
      );
    }

    const data = await response.json();

    const companyName = data.partner.company_name;

    partnerName.textContent = companyName;

    document.title =
      `CRM: История реализации продукции — ${companyName}`;

    if (data.history.length === 0) {
      emptyHistory.hidden = false;
      return;
    }

    historyBody.innerHTML = data.history
      .map((sale) => {
        return `
          <tr>
            <td>${sale.product_name}</td>
            <td>${sale.quantity}</td>
            <td>${sale.sale_date}</td>
          </tr>
        `;
      })
      .join('');
  } catch (error) {
    console.error(error);

    partnerName.textContent =
      'Не удалось загрузить данные';
  }
}

backButton.addEventListener('click', () => {
  window.location.href = './index.html';
});

loadPartnerHistory();
