/**
 * Common JavaScript functionality for the Lost & Found website
 * This file replaces the main.js file and provides shared functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Toggle mobile menu
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navbarNav = document.querySelector('.navbar-nav');
  
  if (mobileMenuToggle && navbarNav) {
    mobileMenuToggle.addEventListener('click', function() {
      navbarNav.classList.toggle('show');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.navbar') && navbarNav && navbarNav.classList.contains('show')) {
      navbarNav.classList.remove('show');
    }
  });
  
  // Profile dropdown functionality
  const profileDropdown = document.getElementById('profile-dropdown');
  const profileMenu = document.querySelector('.profile-menu');
  
  if (profileDropdown && profileMenu) {
    profileDropdown.addEventListener('click', function(event) {
      event.stopPropagation();
      profileMenu.classList.toggle('show');
    });
    
    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.profile-dropdown') && profileMenu && profileMenu.classList.contains('show')) {
        profileMenu.classList.remove('show');
      }
    });
  }
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const authLinks = document.querySelectorAll('.auth-link');
  const userLinks = document.querySelectorAll('.user-link');
  
  if (token) {
    // User is logged in
    if (authLinks.length > 0) {
      authLinks.forEach(link => link.style.display = 'none');
    }
    if (userLinks.length > 0) {
      userLinks.forEach(link => link.style.display = 'block');
    }
    
    // Load user info if profile elements exist
    const profileEmail = document.getElementById('profile-email');
    const profileCollege = document.getElementById('profile-college');
    
    if (profileEmail || profileCollege) {
      fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
      })
      .then(data => {
        if (profileEmail && data.email) {
          profileEmail.textContent = data.email;
        }
        if (profileCollege && data.college) {
          profileCollege.textContent = data.college;
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }
  } else {
    // User is not logged in
    if (authLinks.length > 0) {
      authLinks.forEach(link => link.style.display = 'block');
    }
    if (userLinks.length > 0) {
      userLinks.forEach(link => link.style.display = 'none');
    }
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(event) {
      event.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('college');
      window.location.href = 'login.html';
    });
  }
  
  // Show alerts
  window.showAlert = function(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
      <span>${message}</span>
      <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.remove()">×</button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 5000);
  };
  
  // Form validation helpers
  window.validateEmail = function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  window.validatePassword = function(password) {
    return password.length >= 6;
  };
});