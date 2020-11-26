
export function buildUrl(req, path) {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['x-forwarded-host'] || req.headers['host']
  const base = `${protocol}://${host}${req.url}`
  return new URL(path, base).toString()
}