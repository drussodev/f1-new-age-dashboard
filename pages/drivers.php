
<div class="bg-white py-8">
  <div class="container mx-auto px-4">
    <div class="flex flex-col mb-8">
      <div class="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-f1-red mr-3">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <h1 class="text-3xl font-bold">Driver Profiles</h1>
        
        <div id="admin-notice" class="ml-auto flex items-center text-gray-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M20 22a9 9 0 0 0-10-8.83A10 10 0 1 1 22 12c0 3.14-1.3 5.94-3.38 7.97L12 12l3.01-3.01C11.6 5.95 8.57 4.58 5 6.46a7 7 0 0 0-3 5.77A4 4 0 0 0 6 16a4.99 4.99 0 0 0 4-2 4 4 0 0 1 6 5"></path>
          </svg>
          <span>Administrator access required to edit drivers</span>
        </div>
      </div>
      
      <div class="relative w-full max-w-md mb-6">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        <input
          type="text"
          id="search-drivers"
          placeholder="Search drivers by name, team or country..."
          class="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent"
        />
        <button 
          id="clear-search"
          class="absolute inset-y-0 right-0 px-3 hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div id="no-results" class="hidden text-center py-8">
      <p class="text-gray-500">No drivers found matching "<span id="search-term"></span>"</p>
      <button 
        id="clear-search-btn"
        class="mt-2 px-4 py-2 border border-gray-300 rounded-md"
      >
        Clear Search
      </button>
    </div>
    
    <div id="drivers-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- JavaScript will populate this -->
    </div>
  </div>
</div>

<script>
  const searchInput = document.getElementById('search-drivers');
  const clearSearchBtn = document.getElementById('clear-search');
  const clearSearchBtnAlternate = document.getElementById('clear-search-btn');
  const noResults = document.getElementById('no-results');
  const searchTerm = document.getElementById('search-term');
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    if (query) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    
    filterDrivers(query);
  });
  
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    filterDrivers('');
  });
  
  clearSearchBtnAlternate.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    filterDrivers('');
  });
  
  function filterDrivers(query) {
    const driverCards = document.querySelectorAll('#drivers-container > div');
    let foundResults = false;
    
    driverCards.forEach(card => {
      const name = card.querySelector('h2').textContent.toLowerCase();
      const team = card.querySelector('.flex.justify-between:nth-child(1) .font-medium').textContent.toLowerCase();
      const country = card.querySelector('#driver-details-' + card.getAttribute('data-id'))?.querySelector('.font-medium').textContent.toLowerCase() || '';
      
      if (name.includes(query) || team.includes(query) || country.includes(query)) {
        card.classList.remove('hidden');
        foundResults = true;
      } else {
        card.classList.add('hidden');
      }
    });
    
    if (!foundResults && query) {
      noResults.classList.remove('hidden');
      searchTerm.textContent = query;
    } else {
      noResults.classList.add('hidden');
    }
  }
  
  // When drivers are loaded, add data attributes for filtering
  document.addEventListener('DOMContentLoaded', function() {
    // This will be handled by the initDriversPage function in main.js
  });
</script>
