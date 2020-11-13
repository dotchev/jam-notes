import crypto from 'crypto'
import faunadb from 'faunadb'
const q = faunadb.query
import { faunaOptions } from '../../../lib/fauna'

const emailPattern = /\S{1,64}@\S{4,253}/

export default async function (req, res) {
  console.log(req.method, req.url)
  console.log('cookies:', req.cookies)
  console.log('body:', req.body)

  const email = req.body.email
  if (!emailPattern.test(email)) {
    res.status(400).send(`Invalid email address ${email}`)
    return
  }

  const client = new faunadb.Client(faunaOptions())
  let r = await client.query(q.Paginate(q.Match(
    q.Index('users_by_email'), email)))
  console.log('match user result:', r)
  let userRef
  if (r.data.length > 0) {
    console.log(`User ${email} already exists`);
    userRef = r.data[0]
  } else {
    console.log(`User ${email} does not exist, creating it...`);
    r = await client.query(
      q.Create(q.Collection('users'), {
        data: {
          email: email
        }
      })
    )
    console.log('create user result:', r);
    userRef = r.ref
  }

  const token = crypto.randomBytes(16).toString('hex')
  r = await client.query(q.Create(q.Collection('login_requests'), {
    data: {
      token,
      user_id: userRef.id
    },
    ttl: q.TimeAdd(q.Time('now'), 1, 'hour')
  }))
  console.log('create login request result:', r);

  res.status(204).end()
}
