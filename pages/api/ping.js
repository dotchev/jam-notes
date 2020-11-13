import os from 'os'
import faunadb from 'faunadb'
import clockit from 'clockit'
const q = faunadb.query
import { faunaOptions } from '../../lib/fauna'

export default async function (req, res) {
  console.log(req.method, req.url)
  console.log('headers:', req.headers)
  console.log('query:', req.query)
  console.log('cookies:', req.cookies)
  console.log('body:', req.body)
  req.query.env && console.log('env:', process.env)
  console.log('node version:', process.version)
  console.log('OS:', {
    freemem: os.freemem(),
    totalmem: os.totalmem(),
    platform: os.platform(),
    release: os.release(),
    version: os.version(),
    loadavg: os.loadavg(),
  })

  try {
    const client = new faunadb.Client(faunaOptions())
    const timer = clockit.start()
    let pong = await client.ping()
    console.log(`fauna ping: ${pong} (${timer.ms}ms)`);
  } catch (e) {
    console.error('Could not ping fauna db:', e);
  }

  res.status(200).send('pong')
}
