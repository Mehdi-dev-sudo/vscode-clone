# Pull Shark: Create 32+ small PRs in one day
# Each branch makes ONE tiny change, creates a PR, and merges it.

# We need to run commands one at a time (each PR = separate branch)
# Let's do them in groups

# Make sure we start from clean main
git checkout main
git pull origin main

# ==========================================
# PR 1: Add ARIA label to search input
# ==========================================
git checkout -b pr/aria-search-input
$file = "src/components/sidebar/search-view.js"
(Get-Content $file) -replace 'placeholder: ''Search'', attrs: {', 'placeholder: ''Search'', attrs: { '#'aria-label'': ''Search files'', ' | Set-Content $file
git add -A
git commit -m "fix: add aria-label to search input

Co-authored-by: Karan-Safaie-Qadi"
git push origin pr/aria-search-input
gh pr create --title "fix: add aria-label to search input" --body "Minor accessibility improvement" --base main
gh pr merge --merge --delete-branch
