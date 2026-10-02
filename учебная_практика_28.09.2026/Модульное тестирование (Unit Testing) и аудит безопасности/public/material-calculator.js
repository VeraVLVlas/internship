import {
  calculateMaterialRequirement
} from './calculateMaterialRequirement.js';

const materialForm = document.querySelector('#material-form');
const productTypeInput = document.querySelector('#product-type-id');
const materialTypeInput = document.querySelector('#material-type-id');
const quantityInput = document.querySelector('#quantity');
const param1Input = document.querySelector('#param-1');
const param2Input = document.querySelector('#param-2');
const resultElement = document.querySelector('#calculation-result');
const backButton = document.querySelector('#back-button');

function showResult(message, type) {
  resultElement.textContent = message;
  resultElement.className = `calculation-result calculation-result--${type}`;
  resultElement.hidden = false;
}

materialForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const productTypeId = Number(productTypeInput.value);
  const materialTypeId = Number(materialTypeInput.value);
  const quantity = Number(quantityInput.value);
  const param1 = Number(param1Input.value);
  const param2 = Number(param2Input.value);

  const result = calculateMaterialRequirement(
    productTypeId,
    materialTypeId,
    quantity,
    param1,
    param2
  );

  if (result === -1) {
    showResult(
      'Ошибка расчета. Проверьте ID типов, количество продукции и параметры изделия. Количество должно быть больше 0, а параметры — положительными числами.',
      'error'
    );

    return;
  }

  showResult(
    `Необходимое количество материала: ${result}`,
    'success'
  );
});

backButton.addEventListener('click', () => {
  window.location.href = './index.html';
});
