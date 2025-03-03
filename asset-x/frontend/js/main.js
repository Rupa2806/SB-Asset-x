// frontend/js/main.js
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
      document.getElementById('loginLink')?.style.setProperty('display', 'none');
      document.getElementById('registerLink')?.style.setProperty('display', 'none');
      document.getElementById('dashboardLink')?.style.setProperty('display', 'block');
      document.getElementById('logoutLink')?.style.setProperty('display', 'block');
    }
  });
  // In frontend/js/main.js or dashboard.js
document.getElementById('logoutLink')?.addEventListener('click', function() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
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
  