
<?php
// Prevent caching to ensure we always get the latest version
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

// Simple routing system
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path = trim($path, '/');
$path = empty($path) ? 'home' : $path;

// Whitelist of valid pages
$valid_pages = ['home', 'drivers', 'teams', 'news', 'calendar', 'streaming', 'login', 'config', 'accounts'];
$page = in_array($path, $valid_pages) ? $path : 'notfound';

// Define title based on page
$titles = [
    'home' => 'F1 New Age Tournament - Dashboard',
    'drivers' => 'F1 New Age Tournament - Drivers',
    'teams' => 'F1 New Age Tournament - Teams',
    'news' => 'F1 New Age Tournament - News',
    'calendar' => 'F1 New Age Tournament - Race Calendar',
    'streaming' => 'F1 New Age Tournament - Live Streams',
    'login' => 'F1 New Age Tournament - Login',
    'config' => 'F1 New Age Tournament - Configuration',
    'accounts' => 'F1 New Age Tournament - Account Management',
    'notfound' => 'F1 New Age Tournament - Page Not Found'
];

$title = $titles[$page] ?? 'F1 New Age Tournament';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="https://cdn-icons-png.flaticon.com/512/2592/2592795.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo $title; ?></title>
    <meta name="description" content="F1 New Age Tournament dashboard for standings, drivers, teams, and race information" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'f1-red': '#ea384c',
              'f1-dark': '#d11c31',
              'f1-light': '#ff5e6d'
            },
            keyframes: {
              'speed-lines': {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(-100%)' }
              }
            },
            animation: {
              'speed-lines': 'speed-lines 3s linear infinite'
            }
          }
        }
      }
    </script>
    
    <!-- Main CSS -->
    <link rel="stylesheet" href="assets/css/main.css">
    
    <!-- Sonner Toast library -->
    <script src="https://cdn.jsdelivr.net/npm/sonner/dist/index.umd.js"></script>
    
    <!-- Date-fns for date formatting -->
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.30.0/index.min.js"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
  </head>
  <body class="min-h-screen bg-gray-50 flex flex-col">
    <div class="absolute top-0 left-0 w-full h-1 bg-f1-red"></div>
    <div class="absolute top-0 right-0 w-1 h-full bg-f1-red"></div>

    <!-- Speed lines -->
    <div class="fixed w-full pointer-events-none overflow-hidden">
      <div class="speed-line top-[20%] w-[70%]"></div>
      <div class="speed-line top-[40%] w-[85%]"></div>
      <div class="speed-line top-[60%] w-[60%]"></div>
      <div class="speed-line top-[80%] w-[75%]"></div>
    </div>

    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="index.php" class="flex items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/2592/2592795.png" alt="F1 Logo" class="h-8 w-8 mr-2">
              <span class="font-bold text-lg">F1 New Age Tournament</span>
            </a>
          </div>
          
          <div class="hidden md:flex space-x-4">
            <a href="index.php" class="px-3 py-2 rounded-md text-sm font-medium <?php echo $path === 'home' ? 'text-f1-red font-bold' : 'text-gray-700 hover:text-f1-red'; ?>">
              Dashboard
            </a>
            <a href="drivers.php" class="px-3 py-2 rounded-md text-sm font-medium <?php echo $path === 'drivers' ? 'text-f1-red font-bold' : 'text-gray-700 hover:text-f1-red'; ?>">
              Drivers
            </a>
            <a href="teams.php" class="px-3 py-2 rounded-md text-sm font-medium <?php echo $path === 'teams' ? 'text-f1-red font-bold' : 'text-gray-700 hover:text-f1-red'; ?>">
              Teams
            </a>
            <a href="news.php" class="px-3 py-2 rounded-md text-sm font-medium <?php echo $path === 'news' ? 'text-f1-red font-bold' : 'text-gray-700 hover:text-f1-red'; ?>">
              News
            </a>
            <a href="calendar.php" class="px-3 py-2 rounded-md text-sm font-medium <?php echo $path === 'calendar' ? 'text-f1-red font-bold' : 'text-gray-700 hover:text-f1-red'; ?>">
              Calendar
            </a>
            <a href="streaming.php" class="px-3 py-2 rounded-md text-sm font-medium <?php echo $path === 'streaming' ? 'text-f1-red font-bold' : 'text-gray-700 hover:text-f1-red'; ?>">
              Streaming
            </a>
          </div>
          
          <div class="hidden md:flex items-center space-x-2">
            <a href="login.php" class="px-4 py-2 rounded text-sm font-medium bg-f1-red text-white hover:bg-f1-dark transition-colors" id="loginButton">
              Login
            </a>
          </div>
          
          <div class="md:hidden flex items-center">
            <button id="mobileMenuButton" class="text-gray-700 hover:text-f1-red focus:outline-none">
              <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu, hidden by default -->
      <div id="mobileMenu" class="hidden md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="index.php" class="block px-3 py-2 rounded-md text-base font-medium <?php echo $path === 'home' ? 'bg-gray-100 text-f1-red' : 'text-gray-700 hover:bg-gray-50 hover:text-f1-red'; ?>">
            Dashboard
          </a>
          <a href="drivers.php" class="block px-3 py-2 rounded-md text-base font-medium <?php echo $path === 'drivers' ? 'bg-gray-100 text-f1-red' : 'text-gray-700 hover:bg-gray-50 hover:text-f1-red'; ?>">
            Drivers
          </a>
          <a href="teams.php" class="block px-3 py-2 rounded-md text-base font-medium <?php echo $path === 'teams' ? 'bg-gray-100 text-f1-red' : 'text-gray-700 hover:bg-gray-50 hover:text-f1-red'; ?>">
            Teams
          </a>
          <a href="news.php" class="block px-3 py-2 rounded-md text-base font-medium <?php echo $path === 'news' ? 'bg-gray-100 text-f1-red' : 'text-gray-700 hover:bg-gray-50 hover:text-f1-red'; ?>">
            News
          </a>
          <a href="calendar.php" class="block px-3 py-2 rounded-md text-base font-medium <?php echo $path === 'calendar' ? 'bg-gray-100 text-f1-red' : 'text-gray-700 hover:bg-gray-50 hover:text-f1-red'; ?>">
            Calendar
          </a>
          <a href="streaming.php" class="block px-3 py-2 rounded-md text-base font-medium <?php echo $path === 'streaming' ? 'bg-gray-100 text-f1-red' : 'text-gray-700 hover:bg-gray-50 hover:text-f1-red'; ?>">
            Streaming
          </a>
          <a href="login.php" class="block px-3 py-2 rounded-md text-base font-medium bg-f1-red text-white">
            Login
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <div id="content">
        <?php
        // Include the relevant page content based on the route
        $page_file = "pages/{$page}.php";
        if (file_exists($page_file)) {
          include $page_file;
        } else {
          include "pages/notfound.php";
        }
        ?>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-800 text-white p-4 text-center">
      <div class="container mx-auto">
        <p class="text-sm">&copy; <?php echo date('Y'); ?> F1 New Age Tournament. All rights reserved.</p>
      </div>
    </footer>

    <!-- Toast container -->
    <div id="toaster" class="fixed top-4 right-4 z-50"></div>

    <!-- Main JavaScript -->
    <script src="assets/js/main.js"></script>
    <script>
      // Initialize icons
      lucide.createIcons();
      
      // Handle mobile menu toggle
      document.getElementById('mobileMenuButton').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.toggle('hidden');
      });
    </script>
  </body>
</html>
