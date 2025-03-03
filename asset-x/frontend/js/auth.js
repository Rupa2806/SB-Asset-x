// frontend/js/auth.js
const backendAuthUrl = 'http://localhost:5000/api/auth';

// Register user
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const userId = document.getElementById('userId').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;
  const password = document.getElementById('password').value;

  fetch(`${backendAuthUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, name, phone, email, age, password })
  })
  .then(res => res.json())
  .then(data => {
    if(data.token) {
      Swal.fire({
        title: 'Registration Successful',
        text: 'You can now login!',
        icon: 'success'
      }).then(() => {
        window.location.href = 'login.html';
      });
    } else {
      Swal.fire({
        title: 'Registration Failed',
        text: data.message || 'Please try again.',
        icon: 'error'
      });
    }
  })
  .catch(err => {
    console.error(err);
    Swal.fire({
      title: 'Error',
      text: 'An error occurred during registration',
      icon: 'error'
    });
  });
});

// Login user
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const userId = document.getElementById('userId').value;
  const password = document.getElementById('password').value;

  fetch(`${backendAuthUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('userName', data.user.name);
      Swal.fire({
        title: 'Login Successful',
        icon: 'success'
      }).then(() => {
        window.location.href = 'dashboard.html';
      });
    } else {
      Swal.fire({
        title: 'Login Failed',
        text: data.message || 'Invalid credentials',
        icon: 'error'
      });
    }
  })
  .catch(err => {
    console.error(err);
    Swal.fire({
      title: 'Error',
      text: 'An error occurred during login',
      icon: 'error'
    });
  });
});
