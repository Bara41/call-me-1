// model.js

// Отримати всіх користувачів
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || {};
}

// Зберегти всіх користувачів
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Отримати поточного користувача
function getCurrentUserEmail() {
  return localStorage.getItem('currentUser');
}

// Отримати дані поточного користувача
function getCurrentUser() {
  const users = getUsers();
  const email = getCurrentUserEmail();
  return users[email] || null;
}

// Зберегти поточного користувача (email у localStorage)
function setCurrentUser(email) {
  localStorage.setItem('currentUser', email);
}

// Очистити поточного користувача
function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// Зареєструвати нового користувача
function registerUser(email, password) {
  const users = getUsers();
  if (users[email]) return false; // Користувач уже існує

  users[email] = {
    password,
    contacts: []
  };
  saveUsers(users);
  return true;
}

// Перевірити вхід
function loginUser(email, password) {
  const users = getUsers();
  if (users[email] && users[email].password === password) {
    setCurrentUser(email);
    return true;
  }
  return false;
}

// Отримати контакти поточного користувача
function getContacts() {
  const user = getCurrentUser();
  return user ? user.contacts : [];
}

// Зберегти контакти поточного користувача
function saveContacts(contacts) {
  const users = getUsers();
  const email = getCurrentUserEmail();
  if (!email) return;

  users[email].contacts = contacts;
  saveUsers(users);
}

// Додати контакт
function addContact(contact) {
  const contacts = getContacts();
  contact.id = Date.now();
  contacts.push(contact);
  saveContacts(contacts);
}

// Оновити контакт
function updateContact(updatedContact) {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === updatedContact.id);
  if (index !== -1) {
    contacts[index] = updatedContact;
    saveContacts(contacts);
  }
}

// Видалити контакт
function deleteContact(id) {
  const contacts = getContacts().filter(c => c.id !== id);
  saveContacts(contacts);
}

// Отримати інформацію профілю
function getProfile() {
  const email = getCurrentUserEmail();
  const user = getCurrentUser();
  return user ? { email } : null;
}

// Оновити email у профілі
function updateProfile(newEmail, newPassword) {
  const users = getUsers();
  const oldEmail = getCurrentUserEmail();
  const user = users[oldEmail];

  if (!user) return false;
  if (oldEmail !== newEmail && users[newEmail]) return false; // новий вже існує

  // створити нового користувача з оновленими даними
  users[newEmail] = {
    password: newPassword || user.password,
    contacts: user.contacts
  };
  // видалити старого
  delete users[oldEmail];
  saveUsers(users);
  setCurrentUser(newEmail);
  return true;
}

