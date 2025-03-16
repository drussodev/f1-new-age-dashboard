
<div class="bg-gray-100 py-16 relative">
  <div class="container mx-auto text-center px-4 relative z-10">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">F1 New Age Tournament</h1>
    <p class="text-xl text-gray-800 max-w-3xl mx-auto font-medium">
      Follow the latest standings, driver profiles, and race calendar for the F1 New Age Tournament
    </p>
    <div class="flex items-center justify-center mt-4 space-x-2">
      <button 
        id="refresh-data" 
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
      >
        <svg id="refresh-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M3 21v-5h5"></path>
        </svg>
        <span id="refresh-text">Refresh Data</span>
      </button>
      <span id="last-updated" class="text-xs text-gray-500">
        Last updated: <?php echo date('H:i:s'); ?>
      </span>
    </div>
  </div>
</div>

<div class="container mx-auto px-4 py-12">
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <!-- Tabs -->
      <div class="flex border-b">
        <button id="drivers-tab" class="px-4 py-2 border-b-2 border-f1-red text-f1-red font-medium">Driver Standings</button>
        <button id="teams-tab" class="px-4 py-2 border-b-2 border-transparent hover:text-gray-700">Constructor Standings</button>
      </div>
      
      <!-- Drivers Tab Content -->
      <div id="drivers-content" class="mt-6">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="flex items-center text-xl font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Driver Championship Standings
            </h2>
          </div>
          <div id="drivers-loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
          <div id="drivers-empty" class="hidden flex flex-col items-center justify-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No driver data available</p>
            <button 
              id="refresh-drivers"
              class="mt-2 px-3 py-1 text-sm border border-gray-300 rounded"
            >
              Refresh
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody id="drivers-list" class="bg-white divide-y divide-gray-200">
                <!-- JavaScript will populate this -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Teams Tab Content -->
      <div id="teams-content" class="mt-6 hidden">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="flex items-center text-xl font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Constructor Championship Standings
            </h2>
          </div>
          <div id="teams-loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
          <div id="teams-empty" class="hidden flex flex-col items-center justify-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No team data available</p>
            <button 
              id="refresh-teams"
              class="mt-2 px-3 py-1 text-sm border border-gray-300 rounded"
            >
              Refresh
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody id="teams-list" class="bg-white divide-y divide-gray-200">
                <!-- JavaScript will populate this -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  // Tab switching
  document.getElementById('drivers-tab').addEventListener('click', function() {
    document.getElementById('drivers-tab').classList.add('border-f1-red', 'text-f1-red');
    document.getElementById('drivers-tab').classList.remove('border-transparent');
    document.getElementById('teams-tab').classList.remove('border-f1-red', 'text-f1-red');
    document.getElementById('teams-tab').classList.add('border-transparent');
    
    document.getElementById('drivers-content').classList.remove('hidden');
    document.getElementById('teams-content').classList.add('hidden');
  });
  
  document.getElementById('teams-tab').addEventListener('click', function() {
    document.getElementById('teams-tab').classList.add('border-f1-red', 'text-f1-red');
    document.getElementById('teams-tab').classList.remove('border-transparent');
    document.getElementById('drivers-tab').classList.remove('border-f1-red', 'text-f1-red');
    document.getElementById('drivers-tab').classList.add('border-transparent');
    
    document.getElementById('teams-content').classList.remove('hidden');
    document.getElementById('drivers-content').classList.add('hidden');
  });
  
  // Refresh functionality
  document.getElementById('refresh-data').addEventListener('click', function() {
    const refreshIcon = document.getElementById('refresh-icon');
    const refreshText = document.getElementById('refresh-text');
    
    refreshIcon.classList.add('animate-spin');
    refreshText.textContent = 'Refreshing...';
    
    // Simulate refresh with timeout
    setTimeout(function() {
      refreshIcon.classList.remove('animate-spin');
      refreshText.textContent = 'Refresh Data';
      
      document.getElementById('last-updated').textContent = 'Last updated: ' + new Date().toLocaleTimeString();
      helpers.showToast('Data refreshed successfully', 'success');
      
      // Re-initialize dashboard
      initDashboard();
    }, 1000);
  });
  
  document.getElementById('refresh-drivers').addEventListener('click', function() {
    initDashboard();
  });
  
  document.getElementById('refresh-teams').addEventListener('click', function() {
    initDashboard();
  });
</script>
