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
