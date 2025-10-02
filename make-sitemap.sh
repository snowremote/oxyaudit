#!/usr/bin/env bash
# make-sitemap.sh — Generate sitemap.xml for GitHub Pages (oxyaudit)
# Usage: bash make-sitemap.sh "https://snowremote.github.io/oxyaudit"

set -euo pipefail
BASE_URL="${1:-https://snowremote.github.io/oxyaudit}"

# find public HTML pages; exclude assets/partials
mapfile -t files < <( \
  find . -type f -name '*.html' \
    ! -path '*/.*/*' \
    ! -path './.*' \
    ! -path './node_modules/*' \
    ! -path './vendor/*' \
    ! -path './dist/*' \
    ! -path './build/*' \
    ! -path './assets/*' \
    ! -path './img/*' \
    ! -path './images/*' \
    ! -path './css/*' \
    ! -path './js/*' \
    ! -name 'footer.html' \
    ! -name 'header.html' \
    ! -name '*partial*.html' \
    | sort
)

# collapse multiple slashes without touching the scheme
collapse_slashes() {
  local s="$1" tmp
  tmp="${s//:\/\//§§}"           # mask "://"
  tmp="$(printf '%s' "$tmp" | sed -E 's#/+#/#g')"   # collapse // → /
  printf '%s' "${tmp//§§/:\/\/}" # unmask
}

# Build URL for each file (index.html => directory URL)
url_for() {
  local f="$1" rel url
  rel="${f#./}"
  if [[ "$rel" == "index.html" ]]; then
    url="$BASE_URL/"
  elif [[ "$rel" == */index.html ]]; then
    url="$BASE_URL/${rel%index.html}"
  else
    url="$BASE_URL/$rel"
  fi
  collapse_slashes "$url"
}

# ISO8601 lastmod from git; fallback to now (UTC)
lastmod_for() {
  local f="$1" ts
  ts="$(git log -1 --format=%cI -- "$f" 2>/dev/null || true)"
  [[ -z "$ts" ]] && ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '%s' "$ts"
}

# Write sitemap.xml
{
  printf '<?xml version="1.0" encoding="UTF-8"?>\n'
  printf '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  # site root
  printf '  <url>\n'
  printf '    <loc>%s/</loc>\n' "$(collapse_slashes "$BASE_URL/")"
  printf '    <changefreq>weekly</changefreq>\n'
  printf '    <priority>0.7</priority>\n'
  printf '  </url>\n'
  # pages
  for f in "${files[@]}"; do
    [[ "$f" == "./index.html" ]] && continue
    url="$(url_for "$f")"
    last="$(lastmod_for "$f")"
    printf '  <url>\n'
    printf '    <loc>%s</loc>\n' "$url"
    printf '    <lastmod>%s</lastmod>\n' "$last"
    printf '    <changefreq>weekly</changefreq>\n'
    printf '    <priority>0.7</priority>\n'
    printf '  </url>\n'
  done
  printf '</urlset>\n'
} > sitemap.xml

echo "Generated sitemap.xml for $BASE_URL with ${#files[@]} page(s)."
