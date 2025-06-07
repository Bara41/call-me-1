// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  const model = new ContactModel();
  const view = new ContactView();
  const controller = new ContactController(model, view);
});
