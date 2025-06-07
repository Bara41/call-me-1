// view.js

const View = (function () {
  function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
  }

  function hideModal(modalId) {
    const modalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }

  function clearForm(formId) {
    document.getElementById(formId).reset();
  }

  function setModalTitle(modalId, title) {
    const label = document.querySelector(`#${modalId} .modal-title`);
    if (label) label.textContent = title;
  }

  return {
    showModal,
    hideModal,
    clearForm,
    setModalTitle
  };
})();
