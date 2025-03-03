// frontend/js/dashboard.js

const backendAccountUrl = 'http://localhost:5000/api/account';
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const userName = localStorage.getItem('userName');

document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login if token is missing.
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  // Display logged-in user's name.
  if (userName) {
    document.getElementById('userName').textContent = userName;
  }
  // Fetch account details using the userId.
  fetchAccountDetails();

  // Set up click handler for the "Create Account" nav link.
  const createAccountNav = document.getElementById('createAccountNav');
  if (createAccountNav) {
    createAccountNav.addEventListener('click', handleCreateAccount);
  } else {
    console.error('createAccountNav element not found');
  }
});

// Fetch account details by userId.
function fetchAccountDetails() {
  fetch(`${backendAccountUrl}/user/${userId}`, {
    headers: { 'Authorization': token }
  })
    .then(res => {
      // If no account exists, return null (404).
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Server error');
      return res.json();
    })
    .then(data => {
      if (data && data.accountNumber) {
        // Account exists: store its id and display details.
        localStorage.setItem('accountId', data.accountId);
        displayAccountDetails(data);
        document.getElementById('createAccountNav').style.display = 'none';
        document.getElementById('infoSection').style.display = 'none';
      } else {
        // No account: show the info section and "Create Account" link.
        document.getElementById('createAccountNav').style.display = 'block';
        document.getElementById('infoSection').style.display = 'block';
        document.getElementById('welcomeSection').style.display = 'none';
      }
    })
    .catch(err => {
      console.error('Error fetching account by userId:', err);
      // On error, show info section and "Create Account" nav link.
      document.getElementById('createAccountNav').style.display = 'block';
      document.getElementById('infoSection').style.display = 'block';
      document.getElementById('welcomeSection').style.display = 'none';
    });
}

// Show account details section.
function displayAccountDetails(data) {
  const welcomeSection = document.getElementById('welcomeSection');
  const accountDetails = document.getElementById('accountDetails');
  if (welcomeSection) welcomeSection.style.display = 'block';
  if (accountDetails) {
    accountDetails.style.display = 'block';
    document.getElementById('accountNumber').textContent = data.accountNumber;
    document.getElementById('balance').textContent = data.balance;
  }
}

// Simple confirmation for account creation (no verification).
function handleCreateAccount() {
  Swal.fire({
    title: 'Create Bank Account',
    text: 'Do you want to create your bank account now?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, create it!',
    cancelButtonText: 'No, later'
  }).then(result => {
    if (result.isConfirmed) {
      createAccount();
    }
  });
}

// Create an account via POST request.
function createAccount() {
  const payload = { userId };
  console.log('Creating account with payload:', payload);
  fetch(`${backendAccountUrl}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errData => { throw new Error(errData.message || 'Unknown error'); });
      }
      return res.json();
    })
    .then(data => {
      if (data.account) {
        localStorage.setItem('accountId', data.account._id);
        displayAccountDetails(data.account);
        Swal.fire({
          title: 'Success',
          text: 'Account created successfully',
          icon: 'success'
        });
        document.getElementById('createAccountNav').style.display = 'none';
        document.getElementById('infoSection').style.display = 'none';
      }
    })
    .catch(err => {
      console.error('Error creating account:', err);
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error'
      });
    });
}

// Deposit money.
document.getElementById('depositBtn')?.addEventListener('click', function() {
  const accountId = localStorage.getItem('accountId');
  const amount = document.getElementById('transactionAmount').value;
  if (!amount) {
    Swal.fire({ title: 'Warning', text: 'Please enter an amount', icon: 'warning' });
    return;
  }
  fetch(`${backendAccountUrl}/deposit/${accountId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ amount })
  })
    .then(res => res.json())
    .then(data => {
      Swal.fire({ title: 'Success', text: data.message, icon: 'success' });
      updateBalance(accountId);
    })
    .catch(err => {
      console.error('Deposit error:', err);
      Swal.fire({ title: 'Error', text: 'Deposit failed', icon: 'error' });
    });
});

// Withdraw money.
document.getElementById('withdrawBtn')?.addEventListener('click', function() {
  const accountId = localStorage.getItem('accountId');
  const amount = document.getElementById('transactionAmount').value;
  if (!amount) {
    Swal.fire({ title: 'Warning', text: 'Please enter an amount', icon: 'warning' });
    return;
  }
  fetch(`${backendAccountUrl}/withdraw/${accountId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ amount })
  })
    .then(res => res.json())
    .then(data => {
      Swal.fire({ title: 'Success', text: data.message, icon: 'success' });
      updateBalance(accountId);
    })
    .catch(err => {
      console.error('Withdraw error:', err);
      Swal.fire({ title: 'Error', text: 'Withdrawal failed', icon: 'error' });
    });
});

// Transfer funds.
document.getElementById('transferBtn')?.addEventListener('click', function() {
  const accountId = localStorage.getItem('accountId');
  const toAccountNumber = document.getElementById('transferAccount').value;
  const amount = document.getElementById('transactionAmount').value;
  if (!toAccountNumber || !amount) {
    Swal.fire({ title: 'Warning', text: 'Please enter recipient account and amount', icon: 'warning' });
    return;
  }
  fetch(`${backendAccountUrl}/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ fromAccountId: accountId, toAccountNumber, amount })
  })
    .then(res => res.json())
    .then(data => {
      Swal.fire({ title: 'Success', text: data.message, icon: 'success' });
      updateBalance(accountId);
    })
    .catch(err => {
      console.error('Transfer error:', err);
      Swal.fire({ title: 'Error', text: 'Transfer failed', icon: 'error' });
    });
});

// Update the balance display.
function updateBalance(accountId) {
  fetch(`${backendAccountUrl}/balance/${accountId}`, {
    headers: { 'Authorization': token }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('balance').textContent = data.balance;
    })
    .catch(err => console.error('Error updating balance:', err));
}

// Logout with confirmation.
document.getElementById('logoutLink')?.addEventListener('click', function() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout!',
    cancelButtonText: 'Cancel'
  }).then(result => {
    if (result.isConfirmed) {
      localStorage.clear();
      Swal.fire({
        title: 'Logged Out',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = 'index.html';
      });
    }
  });
});
