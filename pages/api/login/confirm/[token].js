import crypto from 'crypto'
import faunadb from 'faunadb'
import { get } from 'http'
const q = faunadb.query
import { faunaOptions } from '../../../../lib/fauna'

const sessionSeconds = 6 * 30 * 24 * 60 * 60

export default async function (req, res) {
  console.log(req.method, req.url)
  console.log('query:', req.query)
  const loginToken = req.query.token

  const client = new faunadb.Client(faunaOptions())
  let r = await client.query(q.Map(
    q.Paginate(q.Match(q.Index('login_request_by_token'), loginToken)),
    x => q.Get(x)))
  console.log('match login token result:', r)
  if (r.data.length == 0) {
    res.status(404).send('Login token not found')
    return
  }
  const loginRequest = r.data[0]

  const sessionToken = crypto.randomBytes(32).toString('hex')
  r = await client.query(q.Create(q.Collection('sessions'), {
    data: {
      token: sessionToken,
      user_id: loginRequest.user_id
    },
    ttl: q.TimeAdd(q.Now(), 180, 'days')
  }))
  console.log('create session result:', r)

  r = await client.query(q.Delete(loginRequest.ref))
  console.log('delete login request result:', r)

  let sessionCookie = `session=${sessionToken}; Path=/; Max-Age=${sessionSeconds}; SameSite=Strict; HttpOnly`
  if (!/^localhost\b/.test(req.headers.host))
    sessionCookie += '; Secure'
  res.setHeader('Set-Cookie', sessionCookie)
  res.redirect('/')
}
