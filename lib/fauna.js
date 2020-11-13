
export function faunaOptions() {
  let options = {
    secret: process.env.FAUNADB_SECRET,
    // observer: faunadb.clientLogger.logger(console.log)
  }
  if (process.env.FAUNADB_URL) {
    const url = new URL(process.env.FAUNADB_URL)
    options.scheme = url.protocol.replace(':', '')
    options.domain = url.hostname
    options.port = url.port
  }
  return options
}

export function isNotUniqueError(e) {
  if (e.requestResult) {
    for (const err of e.requestResult.responseContent.errors) {
      if (err.code == 'instance not unique')
        return true
    }
  }
  return false
}