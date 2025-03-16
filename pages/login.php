
<div class="flex items-center justify-center min-h-[calc(100vh-200px)]">
  <div class="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-4 text-center space-y-1 border-b">
      <div class="flex justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-f1-red">
          <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z"></path>
          <path d="M6 11V7"></path>
          <path d="M18 11V7"></path>
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <circle cx="12" cy="10" r="3"></circle>
          <path d="M12 13v8"></path>
          <path d="m9 17 3 4 3-4"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold">F1 New Age Login</h2>
      <p class="text-gray-500">
        Enter your credentials to access the tournament dashboard
      </p>
    </div>
    
    <div class="p-6">
      <div id="login-error" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-0.5 flex-shrink-0">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span id="error-message">Login failed. Please check your credentials.</span>
      </div>
      
      <form id="login-form" class="space-y-4">
        <div class="space-y-2">
          <label for="username" class="text-sm font-medium">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            required
            class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent"
          >
        </div>
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            class="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent"
          >
        </div>
        <button 
          type="submit" 
          class="w-full bg-f1-red text-white rounded-md py-2 px-4 font-medium hover:bg-f1-dark transition-colors"
          id="login-button"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
</div>

<script>
  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');
  const loginError = document.getElementById('login-error');
  const errorMessage = document.getElementById('error-message');
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Set button to loading state
    loginButton.innerHTML = `
      <span class="flex items-center">
        <span class="animate-spin mr-2 h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
        Signing In...
      </span>
    `;
    loginButton.disabled = true;
    
    // Hide any previous errors
    loginError.classList.add('hidden');
    
    // Simulate login request (this would be an API call in a real app)
    setTimeout(function() {
      const success = api.login(username, password);
      
      if (success) {
        helpers.showToast('Login successful!', 'success');
        
        // Redirect to home page after a brief delay
        setTimeout(function() {
          window.location.href = 'index.php';
        }, 1000);
      } else {
        // Show error message
        errorMessage.textContent = 'Login failed. Please check your credentials.';
        loginError.classList.remove('hidden');
        
        // Reset button
        loginButton.innerHTML = 'Sign In';
        loginButton.disabled = false;
      }
    }, 1000);
  });
</script>
