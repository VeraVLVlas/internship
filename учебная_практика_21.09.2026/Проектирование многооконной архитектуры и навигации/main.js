const addPartnerButton = document.querySelector('#add-partner-button');

function saveMainWindowState() {
  const state = {
    scrollPosition: window.scrollY
  };

  sessionStorage.setItem('mainWindowState', JSON.stringify(state));
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

addPartnerButton.addEventListener('click', () => {
  saveMainWindowState();

  window.location.href = './partner-edit.html?mode=create';
});

restoreMainWindowState();
