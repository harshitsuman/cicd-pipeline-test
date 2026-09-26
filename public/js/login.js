// Already signed in? Go straight to the customers screen
if (sessionStorage.getItem('user')) {
  location.replace('/customers.html');
}

const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorBox = document.getElementById('login-error');
const loginBtn = document.getElementById('login-btn');
const toggleBtn = document.getElementById('toggle-password');

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

toggleBtn.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
  toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.hidden = true;

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    showError('Please enter your username and password.');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in…';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showError(data.message || 'Sign in failed.');
      passwordInput.value = '';
      passwordInput.focus();
      return;
    }

    sessionStorage.setItem('user', data.username);
    location.replace('/customers.html');
  } catch {
    showError('Could not reach the server. Please try again.');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign in';
  }
});
