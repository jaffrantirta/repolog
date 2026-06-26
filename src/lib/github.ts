export async function fetchUserRepos(accessToken: string) {
  const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated&type=all', {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error('Failed to fetch repos')
  return res.json()
}
