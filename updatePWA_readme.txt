===============================================================================
 Oxyaudit — Versioning & Updates (Quick Guide)
===============================================================================

This app is a PWA. iOS (Safari) caches aggressively, so we use a tiny
version.json file as the single source of truth for updates. The app polls
this file and shows an "Update available" banner; tapping it clears caches /
service worker and reloads fresh.

-------------------------------------------------------------------------------
 WHAT TO CHANGE ON EACH RELEASE
-------------------------------------------------------------------------------
• Bump ONLY version.json. You do not need to touch other files unless you want
  extra-aggressive cache busting.

Example (server path shown; adjust to your setup):
  sudo tee /var/www/html/oxyaudit/version.json >/dev/null <<'JSON'
  { "version": "2025-10-03-01", "ts": "2025-10-03T09:00:00Z" }
  JSON

Commit/publish this alongside your code changes on GitHub Pages.

-------------------------------------------------------------------------------
 HOW THE UPDATE WORKS (FOR USERS)
-------------------------------------------------------------------------------
• The app checks version.json on load, when returning to the foreground, and
  every 15 minutes.
• If the remote version differs from the last seen version, an "Update available"
  banner appears.
• Tapping the banner unregisters any service worker, clears caches, and reloads
  with a cache-busting query so the latest files are fetched.

-------------------------------------------------------------------------------
 OPTIONAL: EXTRA CACHE-BUSTING (?v= TOKENS)
-------------------------------------------------------------------------------
If you also want browsers to re-fetch assets without using the banner, append a
version query to asset URLs once per release (optional).

index.html (examples):
  <link rel="stylesheet" href="./css/style.css?v=2025-10-03-01">
  <link rel="manifest" href="./manifest.webmanifest?v=2025-10-03-01">
  <iframe src="./calc15.html?v=2025-10-03-01"></iframe>

calc15.html (examples):
  <link rel="stylesheet" href="./css/style.css?v=2025-10-03-01">
  <script src="./js/calc15.js?v=2025-10-03-01" defer></script>
  <link rel="manifest" href="./manifest.webmanifest?v=2025-10-03-01">

You can keep these static and rely solely on version.json if you prefer.

-------------------------------------------------------------------------------
 APP RESET TOGGLE (IN SETTINGS)
-------------------------------------------------------------------------------
• "Reload app when closing settings": when ON, closing Settings:
  – Unregisters the service worker
  – Clears caches
  – Reloads with a cache-buster
  – Automatically turns the toggle OFF for next time

Use this for manual refresh during testing or on stubborn iOS PWAs.

-------------------------------------------------------------------------------
 SIMPLE RELEASE CHECKLIST
-------------------------------------------------------------------------------
1) Deploy changed files to GitHub Pages.
2) Bump version.json with a new version string.
3) Users will see "Update available"; tapping it refreshes everything.

-------------------------------------------------------------------------------
 TROUBLESHOOTING
-------------------------------------------------------------------------------
• No banner?
  – Ensure version.json is published and reachable; bump the version value.

• Changes not appearing on iPhone?
  – Use Settings -> "Reload app when closing settings" once to force a hard refresh.

• Permission errors when writing files on server?
  – Use sudo + tee instead of shell redirection:
      sudo tee /var/www/html/oxyaudit/version.json >/dev/null <<'JSON'
      { "version": "2025-10-03-01", "ts": "2025-10-03T09:00:00Z" }
      JSON

===============================================================================
 End of guide
===============================================================================
