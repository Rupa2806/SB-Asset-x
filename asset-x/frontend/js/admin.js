// frontend/js/admin.js
document.addEventListener('DOMContentLoaded', () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      document.getElementById('adminLoginForm').style.display = 'block';
      document.getElementById('adminDashboard').style.display = 'none';
    } else {
      loadAdminDashboard();
    }
  });
  
  document.querySelector('#adminLoginForm form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'admin-token'); // dummy token
      Swal.fire({ title: 'Success', text: 'Admin login successful', icon: 'success' });
      loadAdminDashboard();
    } else {
      Swal.fire({ title: 'Error', text: 'Invalid admin credentials', icon: 'error' });
    }
  });
  
  function loadAdminDashboard() {
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    fetchAdminData();
  }
  
  function fetchAdminData() {
    fetch('http://localhost:5000/api/admin/dashboard', {
      headers: {
        'Authorization': localStorage.getItem('adminToken')
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Admin dashboard data:', data);
        populateTables(data);
      })
      .catch(err => {
        console.error('Error fetching admin data:', err);
        Swal.fire({ title: 'Error', text: 'Failed to load admin data', icon: 'error' });
      });
  }
  
  function populateTables(data) {
    // Use empty arrays as defaults in case any property is undefined
    const users = data.users || [];
    const accounts = data.accounts || [];
    const transactions = data.transactions || [];
  
    // Users Table
    let usersHtml = `<table class="table table-bordered">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Age</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>`;
    users.forEach(user => {
      usersHtml += `<tr>
        <td>${user.userId}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.age}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      </tr>`;
    });
    usersHtml += `</tbody></table>`;
    document.getElementById('usersTable').innerHTML = usersHtml;
  
    // Accounts Table
    let accountsHtml = `<table class="table table-bordered">
      <thead>
        <tr>
          <th>Account Number</th>
          <th>User Name</th>
          <th>Balance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>`;
    accounts.forEach(account => {
      accountsHtml += `<tr>
        <td>${account.accountNumber}</td>
        <td>${account.user ? account.user.name : 'N/A'}</td>
        <td>${account.balance}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="updateBalance('${account._id}', 'add')">Add</button>
          <button class="btn btn-warning btn-sm" onclick="updateBalance('${account._id}', 'subtract')">Subtract</button>
        </td>
      </tr>`;
    });
    accountsHtml += `</tbody></table>`;
    document.getElementById('accountsTable').innerHTML = accountsHtml;
  
    // Transactions Table
    let transactionsHtml = `<table class="table table-bordered">
      <thead>
        <tr>
          <th>Type</th>
          <th>Amount</th>
          <th>Recipient</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>`;
    transactions.forEach(tx => {
      transactionsHtml += `<tr>
        <td>${tx.type}</td>
        <td>${tx.amount}</td>
        <td>${tx.recipientAccount || ''}</td>
        <td>${new Date(tx.createdAt).toLocaleString()}</td>
      </tr>`;
    });
    transactionsHtml += `</tbody></table>`;
    document.getElementById('transactionsTable').innerHTML = transactionsHtml;
  }
  
  function updateBalance(accountId, action) {
    Swal.fire({
      title: 'Enter Amount',
      input: 'number',
      inputAttributes: { min: 1 },
      showCancelButton: true
    }).then(result => {
      if (result.value) {
        const amount = result.value;
        const url = action === 'add'
          ? `http://localhost:5000/api/admin/account/add/${accountId}`
          : `http://localhost:5000/api/admin/account/subtract/${accountId}`;
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('adminToken')
          },
          body: JSON.stringify({ amount })
        })
          .then(res => res.json())
          .then(data => {
            Swal.fire({ title: 'Success', text: data.message, icon: 'success' });
            fetchAdminData();
          })
          .catch(err => {
            console.error('Error updating balance:', err);
            Swal.fire({ title: 'Error', text: 'Failed to update balance', icon: 'error' });
          });
      }
    });
  }
  
  function deleteUser(userId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This user will be deleted permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/api/admin/user/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': localStorage.getItem('adminToken') }
        })
          .then(res => res.json())
          .then(data => {
            Swal.fire({ title: 'Deleted', text: data.message, icon: 'success' });
            fetchAdminData();
          })
          .catch(err => {
            console.error('Error deleting user:', err);
            Swal.fire({ title: 'Error', text: 'Failed to delete user', icon: 'error' });
          });
      }
    });
  }
  
  function logoutAdmin() {
    localStorage.removeItem('adminToken');
    window.location.reload();
  }
  