import Head from 'next/head'

export default function Notes(props) {
  return (
    <div>
      <Head>
        <title>My Notes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome {props.email}!
        </h1>

      </main>

      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div >
  )
}

export async function getServerSideProps(ctx) {
  console.log(ctx.req.method, ctx.req.url);
  const faunadb = require('faunadb')
  const q = faunadb.query
  const { faunaOptions } = require('../lib/fauna')

  let redirect = {
    redirect: {
      destination: '/',
      permanent: false
    }
  }

  const sessionToken = ctx.req.cookies.session
  if (!sessionToken) return redirect

  const client = new faunadb.Client(faunaOptions())
  let r = await client.query(q.Map(
    q.Paginate(q.Match(q.Index('session_by_token'), sessionToken)),
    x => q.Get(x)))
  console.log('match session result:', r);
  if (r.data.length == 0) return redirect
  const session = r.data[0]
  console.log('session:', session);

  r = await client.query(q.Get(q.Ref(q.Collection('users'), session.data.user_id)))
  console.log('get user result:', r);

  return {
    props: {
      email: r.data.email
    }
  }
}

