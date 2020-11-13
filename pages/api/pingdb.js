import faunadb from 'faunadb'
const q = faunadb.query

import { faunaOptions } from '../../lib/fauna'

export default async (req, res) => {
  const client = new faunadb.Client(faunaOptions())
  let pong = await client.ping()
  let collections = await client.query(q.Paginate(q.Collections()))
  res.statusCode = 200
  res.json({ pong, collections, h: 125 })
}

