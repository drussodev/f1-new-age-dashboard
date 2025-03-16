
// Main JavaScript file for F1 New Age Tournament

// Global state
const state = {
  drivers: [],
  teams: [],
  news: [],
  races: [],
  config: {
    streamers: []
  },
  auth: {
    isAuthenticated: false,
    isAdmin: false,
    isRoot: false,
    user: null
  }
};

// API functions
const api = {
  // Load data from JSON files (simulating API calls)
  async fetchDrivers() {
    try {
      const response = await fetch('data/drivers.json');
      if (!response.ok) throw new Error('Failed to load drivers');
      const data = await response.json();
      state.drivers = data;
      return data;
    } catch (error) {
      console.error('Error loading drivers:', error);
      return [];
    }
  },
  
  async fetchTeams() {
    try {
      const response = await fetch('data/teams.json');
      if (!response.ok) throw new Error('Failed to load teams');
      const data = await response.json();
      state.teams = data;
      return data;
    } catch (error) {
      console.error('Error loading teams:', error);
      return [];
    }
  },
  
  async fetchNews() {
    try {
      const response = await fetch('data/news.json');
      if (!response.ok) throw new Error('Failed to load news');
      const data = await response.json();
      state.news = data;
      return data;
    } catch (error) {
      console.error('Error loading news:', error);
      return [];
    }
  },
  
  async fetchRaces() {
    try {
      const response = await fetch('data/races.json');
      if (!response.ok) throw new Error('Failed to load races');
      const data = await response.json();
      state.races = data;
      return data;
    } catch (error) {
      console.error('Error loading races:', error);
      return [];
    }
  },
  
  async fetchConfig() {
    try {
      const response = await fetch('data/config.json');
      if (!response.ok) throw new Error('Failed to load config');
      const data = await response.json();
      state.config = data;
      return data;
    } catch (error) {
      console.error('Error loading config:', error);
      return { streamers: [] };
    }
  },
  
  // Auth functions
  login(username, password) {
    // In a real app, this would be an API call
    // For demo, we'll accept any login with admin/admin for admin access
    if (username === 'admin' && password === 'admin') {
      state.auth = {
        isAuthenticated: true,
        isAdmin: true,
        isRoot: false,
        user: { username, role: 'admin' }
      };
      localStorage.setItem('auth', JSON.stringify(state.auth));
      return true;
    } else if (username === 'root' && password === 'root') {
      state.auth = {
        isAuthenticated: true,
        isAdmin: true,
        isRoot: true,
        user: { username, role: 'root' }
      };
      localStorage.setItem('auth', JSON.stringify(state.auth));
      return true;
    } else if (username && password) {
      state.auth = {
        isAuthenticated: true,
        isAdmin: false,
        isRoot: false,
        user: { username, role: 'user' }
      };
      localStorage.setItem('auth', JSON.stringify(state.auth));
      return true;
    }
    return false;
  },
  
  logout() {
    state.auth = {
      isAuthenticated: false,
      isAdmin: false,
      isRoot: false,
      user: null
    };
    localStorage.removeItem('auth');
  }
};

// Helper functions
const helpers = {
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  },
  
  sortDriversByPoints(drivers) {
    return [...drivers].sort((a, b) => b.points - a.points);
  },
  
  sortTeamsByPoints(teams) {
    return [...teams].sort((a, b) => b.points - a.points);
  },
  
  showToast(message, type = 'default') {
    const toast = document.createElement('div');
    toast.className = `p-4 mb-3 rounded-md ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-gray-700'} text-white`;
    toast.textContent = message;
    
    const toaster = document.getElementById('toaster');
    toaster.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => {
        toaster.removeChild(toast);
      }, 300);
    }, 3000);
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check for stored auth
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    state.auth = JSON.parse(storedAuth);
    
    // Update login button
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.textContent = 'Logout';
      loginButton.href = '#';
      loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        api.logout();
        window.location.href = 'index.php';
      });
    }
  }
  
  // Initialize page-specific functionality
  const currentPage = window.location.pathname.split('/').pop() || 'index.php';
  switch(currentPage) {
    case 'index.php':
      initDashboard();
      break;
    case 'drivers.php':
      initDriversPage();
      break;
    case 'teams.php':
      initTeamsPage();
      break;
    case 'news.php':
      initNewsPage();
      break;
    case 'calendar.php':
      initCalendarPage();
      break;
    case 'streaming.php':
      initStreamingPage();
      break;
    case 'login.php':
      initLoginPage();
      break;
  }
});

// Page initialization functions
async function initDashboard() {
  try {
    await Promise.all([api.fetchDrivers(), api.fetchTeams()]);
    
    // Render driver standings
    const sortedDrivers = helpers.sortDriversByPoints(state.drivers);
    const driversList = document.getElementById('drivers-list');
    if (driversList) {
      driversList.innerHTML = sortedDrivers.map((driver, index) => `
        <tr>
          <td class="px-4 py-2 font-medium">${index + 1}</td>
          <td class="px-4 py-2">
            <div class="flex items-center">
              <div class="w-1 h-8 rounded-full mr-3" style="background-color: ${driver.color}"></div>
              <div>
                <div class="font-medium">${driver.name}</div>
                <div class="text-xs text-gray-500">${driver.country}</div>
              </div>
            </div>
          </td>
          <td class="px-4 py-2">${driver.team}</td>
          <td class="px-4 py-2 text-right font-bold">${driver.points}</td>
        </tr>
      `).join('');
    }
    
    // Render team standings
    const sortedTeams = helpers.sortTeamsByPoints(state.teams);
    const teamsList = document.getElementById('teams-list');
    if (teamsList) {
      teamsList.innerHTML = sortedTeams.map((team, index) => `
        <tr>
          <td class="px-4 py-2 font-medium">${index + 1}</td>
          <td class="px-4 py-2">
            <div class="flex items-center">
              <div class="w-1 h-8 rounded-full mr-3" style="background-color: ${team.color}"></div>
              <div class="font-medium">${team.name}</div>
            </div>
          </td>
          <td class="px-4 py-2 text-right font-bold">${team.points}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    helpers.showToast('Failed to load dashboard data', 'error');
  }
}

async function initDriversPage() {
  try {
    await Promise.all([api.fetchDrivers(), api.fetchTeams()]);
    
    // Render drivers
    const driversContainer = document.getElementById('drivers-container');
    if (driversContainer) {
      driversContainer.innerHTML = state.drivers.map(driver => `
        <div class="card bg-white overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div class="h-4" style="background-color: ${driver.color}"></div>
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="flex-1">
                <h2 class="font-bold text-xl">${driver.name}</h2>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Team</span>
                </div>
                <span class="font-medium">${driver.team}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Points</span>
                </div>
                <span class="font-bold text-lg">${driver.points}</span>
              </div>
              
              <button 
                class="w-full flex items-center justify-between mt-2 border px-4 py-2 rounded"
                onclick="toggleDriverDetails('${driver.id}')"
              >
                <span>More Details</span>
                <span class="driver-chevron-${driver.id}">▼</span>
              </button>
              
              <div id="driver-details-${driver.id}" class="hidden mt-4 pt-4 border-t">
                <div class="mb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-gray-600">Country:</span>
                    <span class="font-medium">${driver.country}</span>
                  </div>
                </div>
                
                <div class="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src="${driver.image_url || '/placeholder.svg'}" 
                    alt="${driver.name} profile"
                    class="w-full h-full object-cover"
                    onerror="this.src='/placeholder.svg'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error initializing drivers page:', error);
    helpers.showToast('Failed to load drivers data', 'error');
  }
}

function toggleDriverDetails(driverId) {
  const detailsElement = document.getElementById(`driver-details-${driverId}`);
  const chevronElement = document.querySelector(`.driver-chevron-${driverId}`);
  
  if (detailsElement.classList.contains('hidden')) {
    detailsElement.classList.remove('hidden');
    chevronElement.textContent = '▲';
  } else {
    detailsElement.classList.add('hidden');
    chevronElement.textContent = '▼';
  }
}

async function initTeamsPage() {
  try {
    await api.fetchTeams();
    
    // Render teams
    const teamsContainer = document.getElementById('teams-container');
    if (teamsContainer) {
      teamsContainer.innerHTML = state.teams.map(team => `
        <div class="card bg-white overflow-hidden">
          <div class="h-4" style="background-color: ${team.color}"></div>
          <div class="p-6">
            <h2 class="font-bold text-xl mb-4">${team.name}</h2>
            
            <div class="border-t pt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-gray-600">Points</span>
                <span class="font-bold text-lg">${team.points}</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error initializing teams page:', error);
    helpers.showToast('Failed to load teams data', 'error');
  }
}

async function initNewsPage() {
  try {
    await api.fetchNews();
    
    // Render news
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
      // Sort news by date (newest first) and put featured news at the top
      const sortedNews = [...state.news].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      newsContainer.innerHTML = sortedNews.map(newsItem => `
        <div class="card bg-white overflow-hidden h-full flex flex-col">
          ${newsItem.image_url && !newsItem.video_url ? `
            <div class="relative h-48 overflow-hidden cursor-pointer" onclick="openImagePopup('${newsItem.image_url}', '${newsItem.title}')">
              <div class="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              <img src="${newsItem.image_url}" alt="${newsItem.title}" class="w-full h-full object-cover">
              ${newsItem.featured ? `
                <div class="absolute top-2 right-2 bg-f1-red text-white p-1 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span class="text-xs font-medium">Featured</span>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          ${newsItem.video_url ? `
            <div class="relative h-48 overflow-hidden cursor-pointer" onclick="openVideoPopup('${newsItem.video_url}', '${newsItem.title}')">
              <div class="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-md z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
              </div>
              <div class="w-full h-full">
                <iframe 
                  src="${getEmbedUrl(newsItem.video_url)}" 
                  title="${newsItem.title}"
                  class="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              ${newsItem.featured ? `
                <div class="absolute top-2 right-2 bg-f1-red text-white p-1 rounded-md flex items-center z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span class="text-xs font-medium">Featured</span>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          <div class="p-4 ${newsItem.image_url || newsItem.video_url ? '' : 'pb-2'}">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-semibold">${newsItem.title}</h3>
              ${!newsItem.image_url && !newsItem.video_url && newsItem.featured ? `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-f1-red"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ` : ''}
            </div>
            <p class="text-sm text-gray-500">${helpers.formatDate(newsItem.date)}</p>
          </div>
          
          <div class="px-4 pb-4 flex-grow">
            <p>${newsItem.content}</p>
          </div>
          
          <div class="px-4 pb-4 text-sm text-gray-500">
            <p>#${newsItem.id}</p>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error initializing news page:', error);
    helpers.showToast('Failed to load news data', 'error');
  }
}

function getEmbedUrl(url) {
  if (!url) return '';
  
  // Extract video ID from different YouTube URL formats
  let videoId = '';
  
  // Match youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];
  
  // Match youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) videoId = shortMatch[1];
  
  // Match youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) videoId = embedMatch[1];
  
  if (!videoId) return url; // Return original if no match
  
  // Return proper embed URL with necessary parameters
  return `https://www.youtube.com/embed/${videoId}?origin=${window.location.origin}`;
}

function openImagePopup(url, title) {
  const popup = document.createElement('div');
  popup.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50';
  popup.innerHTML = `
    <div class="max-w-5xl w-full bg-white rounded-lg overflow-hidden relative">
      <div class="p-4 flex justify-between items-center border-b">
        <h3 class="font-semibold text-lg">${title}</h3>
        <button class="p-1 hover:bg-gray-100 rounded" onclick="closePopup()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div class="p-4">
        <img src="${url}" alt="${title}" class="w-full h-auto max-h-[70vh] object-contain">
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden';
}

function openVideoPopup(url, title) {
  const popup = document.createElement('div');
  popup.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50';
  popup.innerHTML = `
    <div class="max-w-5xl w-full bg-white rounded-lg overflow-hidden relative">
      <div class="p-4 flex justify-between items-center border-b">
        <h3 class="font-semibold text-lg">${title}</h3>
        <button class="p-1 hover:bg-gray-100 rounded" onclick="closePopup()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div class="aspect-video">
        <iframe 
          src="${getEmbedUrl(url)}" 
          title="${title}"
          class="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          referrerpolicy="origin"
        ></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const popup = document.querySelector('.fixed.inset-0.bg-black');
  if (popup) {
    document.body.removeChild(popup);
    document.body.style.overflow = '';
  }
}

async function initCalendarPage() {
  try {
    await api.fetchRaces();
    
    // Render calendar
    const calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer) {
      calendarContainer.innerHTML = state.races.map(race => `
        <div class="card bg-white overflow-hidden mb-4">
          <div class="p-6">
            <h2 class="font-bold text-xl mb-2">${race.name}</h2>
            <p class="text-gray-600 mb-4">${helpers.formatDate(race.date)}</p>
            
            <div class="flex flex-wrap gap-4">
              <div class="bg-gray-100 p-3 rounded-md flex-1 min-w-[200px]">
                <p class="font-medium">Circuit</p>
                <p>${race.circuit}</p>
              </div>
              
              <div class="bg-gray-100 p-3 rounded-md flex-1 min-w-[200px]">
                <p class="font-medium">Location</p>
                <p>${race.location}</p>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error initializing calendar page:', error);
    helpers.showToast('Failed to load calendar data', 'error');
  }
}

async function initStreamingPage() {
  try {
    await api.fetchConfig();
    
    // Render streamers
    const streamersContainer = document.getElementById('streamers-container');
    if (streamersContainer) {
      const streamers = state.config.streamers || [];
      
      if (streamers.length === 0) {
        streamersContainer.innerHTML = `
          <div class="text-center p-8 border border-dashed rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitch mx-auto mb-4 text-gray-400"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>
            <p class="text-gray-500">No streamers have been added yet. Admins can add streamers in the Config page.</p>
          </div>
        `;
      } else {
        streamersContainer.innerHTML = streamers.map(streamer => {
          const isOnline = Math.random() > 0.5; // Random online status for demonstration
          
          return `
            <div class="card bg-white overflow-hidden hover:shadow-md transition-shadow">
              <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
                <div class="flex items-center justify-between text-lg">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitch mr-2"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>
                    ${streamer.username}
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}"></div>
                    <span class="text-xs font-medium">
                      ${isOnline ? 'LIVE' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div class="p-0">
                ${isOnline ? `
                  <div class="w-full aspect-video">
                    <iframe
                      src="https://player.twitch.tv/?channel=${streamer.username}&parent=${window.location.hostname}&autoplay=false"
                      height="100%"
                      width="100%"
                      title="${streamer.username}'s stream"
                      allowFullScreen
                    ></iframe>
                  </div>
                ` : `
                  <div class="h-48 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-off mb-2 text-gray-400"><path d="m2 2 20 20"/><path d="M8.35 2.69A10 10 0 0 1 21.3 15.65"/><path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/></svg>
                    <p>Stream is currently offline</p>
                    <p class="text-sm text-gray-400">Check back later</p>
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (error) {
    console.error('Error initializing streaming page:', error);
    helpers.showToast('Failed to load streaming data', 'error');
  }
}

function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const success = api.login(username, password);
      
      if (success) {
        helpers.showToast('Login successful!', 'success');
        setTimeout(() => {
          window.location.href = 'index.php';
        }, 1000);
      } else {
        helpers.showToast('Login failed. Check your credentials.', 'error');
      }
    });
  }
}
