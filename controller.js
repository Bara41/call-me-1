// controller.js

document.addEventListener('DOMContentLoaded', function () {
  if (!Model.getCurrentUser()) {
    window.location.href = 'login.html';
    return;
  }

  const contactTableBody = document.querySelector('#contactTable tbody');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const contactForm = document.getElementById('contactForm');
  const saveContactBtn = document.getElementById('saveContactBtn');
  const addContactBtn = document.getElementById('addContactBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileBtn = document.getElementById('profileBtn');

  let currentEditId = null;

  function renderContacts(contacts) {
    contactTableBody.innerHTML = '';
    contacts.forEach((contact) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${contact.name}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>
          <button class="btn btn-sm btn-warning edit-btn" data-id="${contact.id}">Редагувати</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${contact.id}">Видалити</button>
        </td>
      `;
      contactTableBody.appendChild(row);
    });
  }

  function loadAndRenderContacts() {
    const contacts = Model.getContacts();
    renderContacts(contacts);
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();

    if (!name || !phone || !email) return;

    const contact = { name, phone, email };

    if (currentEditId) {
      contact.id = currentEditId;
      Model.updateContact(contact);
    } else {
      Model.addContact(contact);
    }

    contactForm.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    modal.hide();
    currentEditId = null;
    loadAndRenderContacts();
  });

  addContactBtn.addEventListener('click', function () {
    currentEditId = null;
    contactForm.reset();
    document.getElementById('contactModalLabel').textContent = 'Додати контакт';
  });

  contactTableBody.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-btn')) {
      const id = Number(e.target.dataset.id);
      const contact = Model.getContacts().find((c) => c.id === id);
      if (contact) {
        currentEditId = contact.id;
        document.getElementById('contactName').value = contact.name;
        document.getElementById('contactPhone').value = contact.phone;
        document.getElementById('contactEmail').value = contact.email;
        document.getElementById('contactModalLabel').textContent = 'Редагувати контакт';
        const modal = new bootstrap.Modal(document.getElementById('contactModal'));
        modal.show();
      }
    }

    if (e.target.classList.contains('delete-btn')) {
      const id = Number(e.target.dataset.id);
      if (confirm('Ви впевнені, що хочете видалити цей контакт?')) {
        Model.deleteContact(id);
        loadAndRenderContacts();
      }
    }
  });

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const contacts = Model.getContacts().filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    );
    renderContacts(contacts);
  });

  sortSelect.addEventListener('change', function () {
    const key = this.value;
    const contacts = Model.getContacts().slice().sort((a, b) =>
      a[key].localeCompare(b[key])
    );
    renderContacts(contacts);
  });

  logoutBtn?.addEventListener('click', function () {
    Model.logoutUser();
    window.location.href = 'login.html';
  });

  profileBtn?.addEventListener('click', function () {
    window.location.href = 'profile.html';
  });

  loadAndRenderContacts();
});

