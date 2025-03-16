
<?php
// This PHP file serves as an entry point when hosting in a PHP environment
// It simply loads the static HTML and lets the JavaScript take over

// Set necessary headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="https://cdn-icons-png.flaticon.com/512/2592/2592795.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>F1 New Age Tournament</title>
    <meta name="description" content="F1 New Age Tournament dashboard for standings, drivers, teams, and race information" />
    <?php
    // Dynamically include the built assets
    $cssFiles = glob('./assets/*.css');
    foreach ($cssFiles as $css) {
      echo '<link rel="stylesheet" href="' . $css . '">';
    }
    ?>
  </head>
  <body>
    <div id="root"></div>
    <?php
    // Dynamically include the built JavaScript files
    $jsFiles = glob('./assets/*.js');
    foreach ($jsFiles as $js) {
      echo '<script type="module" src="' . $js . '"></script>';
    }
    ?>
  </body>
</html>
<?php
// End of file
?>
