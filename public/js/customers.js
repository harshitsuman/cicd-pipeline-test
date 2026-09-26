const user = sessionStorage.getItem('user') || 'admin';

const rowsEl = document.getElementById('customer-rows');
const countEl = document.getElementById('result-count');
const emptyEl = document.getElementById('empty-state');
const errorEl = document.getElementById('error-state');
const nameInput = document.getElementById('filter-name');
const idInput = document.getElementById('filter-id');

let allCustomers = [];

document.getElementById('user-name').textContent = user;
document.getElementById('user-avatar').textContent = user.charAt(0).toUpperCase();

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('user');
  location.replace('/');
});

function initials(name) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function cell(content, className) {
  const td = document.createElement('td');
  if (className) td.className = className;
  if (content instanceof Node) td.appendChild(content);
  else td.textContent = content;
  return td;
}

function customerCell(customer) {
  const wrap = document.createElement('div');
  wrap.className = 'customer';

  const avatar = document.createElement('span');
  avatar.className = 'avatar';
  avatar.textContent = initials(customer.name);

  const text = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'customer-name';
  name.textContent = customer.name;
  const email = document.createElement('div');
  email.className = 'customer-email';
  email.textContent = customer.email;
  text.append(name, email);

  wrap.append(avatar, text);
  return wrap;
}

function statusBadge(isActive) {
  const badge = document.createElement('span');
  badge.className = isActive ? 'badge badge-active' : 'badge badge-inactive';
  badge.textContent = isActive ? 'Active' : 'Inactive';
  return badge;
}

function renderStats(customers) {
  const active = customers.filter((c) => c.isActive).length;
  document.getElementById('stat-total').textContent = customers.length;
  document.getElementById('stat-active').textContent = active;
  document.getElementById('stat-inactive').textContent = customers.length - active;
  document.getElementById('stat-countries').textContent = new Set(customers.map((c) => c.country)).size;
}

function renderTable(customers) {
  rowsEl.replaceChildren(
    ...customers.map((c) => {
      const tr = document.createElement('tr');
      tr.append(
        cell(`#${c.id}`, 'col-id'),
        cell(customerCell(c)),
        cell(c.phone, 'col-nowrap'),
        cell(`${c.city}, ${c.country}`),
        cell(statusBadge(c.isActive)),
      );
      return tr;
    }),
  );

  emptyEl.hidden = customers.length > 0;
  countEl.textContent =
    customers.length === allCustomers.length
      ? `Showing all ${allCustomers.length} customers`
      : `Showing ${customers.length} of ${allCustomers.length} customers`;
}

function applyFilters() {
  const name = nameInput.value.trim().toLowerCase();
  const id = idInput.value.trim();

  const filtered = allCustomers.filter((c) => {
    const matchesName = !name || c.name.toLowerCase().includes(name);
    const matchesId = !id || c.id === Number(id);
    return matchesName && matchesId;
  });

  renderTable(filtered);
}

// Filter as the user types, and on the Search button
nameInput.addEventListener('input', applyFilters);
idInput.addEventListener('input', applyFilters);

document.getElementById('filter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  applyFilters();
});

document.getElementById('clear-btn').addEventListener('click', () => {
  nameInput.value = '';
  idInput.value = '';
  applyFilters();
  nameInput.focus();
});

async function loadCustomers() {
  try {
    const res = await fetch('/api/customers');
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    allCustomers = await res.json();
    renderStats(allCustomers);
    applyFilters();
  } catch {
    countEl.textContent = '';
    errorEl.textContent = 'Could not load customers. The server may be waking up — please refresh in a few seconds.';
    errorEl.hidden = false;
  }
}

loadCustomers();
