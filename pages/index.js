import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import LoginForm from '../components/login-form'

export default function Home() {
  return (
    <div className="hero">
      <Head>
        <title>JAM Notes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="hero-body has-text-centered">
        <h1 className="title">
          Welcome to JAM Notes!
        </h1>

        <div className="columns is-centered">
          <LoginForm />
        </div>

      </main>
    </div >
  )
}

export async function getServerSideProps(ctx) {
  console.log(ctx.req.method, ctx.req.url);
  const faunadb = require('faunadb')
  const q = faunadb.query
  const { faunaOptions } = require('../lib/fauna')

  let ret = {
    props: {}
  }

  const sessionToken = ctx.req.cookies.session
  if (!sessionToken) return ret

  const client = new faunadb.Client(faunaOptions())
  let r = await client.query(q.Exists(q.Match(q.Index('session_by_token'), sessionToken)))
  console.log('match session result:', r);
  if (!r) return ret

  ret.redirect = {
    destination: '/notes',
    permanent: false
  }
  return ret
}

