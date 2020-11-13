import crypto from 'crypto'
import faunadb from 'faunadb'
import { get } from 'http'
const q = faunadb.query
import { faunaOptions } from '../../../../lib/fauna'

const sessionSeconds = 6 * 30 * 24 * 60 * 60

export default async function (req, res) {
  console.log('env:', process.env);
  console.log(req.method, req.url)
  console.log('query:', req.query)
  const token = req.query.token

  const client = new faunadb.Client(faunaOptions())
  let r = await client.query(q.Map(
    q.Paginate(q.Match(q.Index('login_requests_by_token'), token)),
    x => q.Get(x)))
  console.log('match login token result:', r)
  if (r.data.length == 0) {
    res.status(404).send('Login token not found')
    return
  }

  const sessionId = crypto.randomBytes(32).toString('hex')
  let sessionCookie = `session=${sessionId}; Path=/; Max-Age=${sessionSeconds}; SameSite=Strict; HttpOnly`
  if (!/^localhost\b/.test(req.headers.host))
    sessionCookie += '; Secure'
  res.setHeader('Set-Cookie', sessionCookie)
  res.redirect('/')
}
