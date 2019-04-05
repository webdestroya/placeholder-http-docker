import {createServer, IncomingMessage, ServerResponse} from "http"

const PORT = process.env.PORT || 8080
const FILTERED_ENV_VARS = typeof(process.env.ENV_VARS_TO_SHOW) === "string" ? process.env.ENV_VARS_TO_SHOW.split(",") : []

const SHOW_ALL = process.env.SHOW_ALL === "true"

const ENV_VAR_LIST = Object.keys(process.env)

const ENV_VARS_TO_SHOW = SHOW_ALL ? ENV_VAR_LIST : FILTERED_ENV_VARS

const HEALTHCHECK_PATH = process.env.HEALTHCHECK_PATH || "/health"

type ResponseType = {
  success : boolean
  showAll : boolean
  headers: any,
  environment : {
    name : string
    value? : string
  }[]
}

const ERROR_PAGE_REGEX = /^\/([0-9]{3})/

function logRequest(url : string | undefined, statusCode : number) {
  console.log(`${new Date().toISOString()} url=${url} status=${statusCode}`)
}


function requestHandler(req: IncomingMessage, res: ServerResponse) {
  
  if(req.url === HEALTHCHECK_PATH) {
    res.statusCode = 200
    res.end("OK")
    return
  }

  if(req.url === "/favicon.ico") {
    res.statusCode = 404
    res.end("None")
    return
  }

  if(req.url === "/robots.txt") {
    res.statusCode = 200
    res.setHeader("Content-Type", "text/plain")
    res.end("User-Agent: *\nDisallow: /\n")
    return
  }

  const errorMatch = ERROR_PAGE_REGEX.exec(req.url || "")

  if(errorMatch) {
    const errorCode = parseInt(errorMatch[1], 10)

    res.statusCode = errorCode
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({error: true, errorCode}))
    logRequest(req.url, errorCode)
    return
  }

  const result : ResponseType = {
    success: true,
    showAll: SHOW_ALL,
    headers: req.headers,
    environment: []
  }

  for(const envVar of ENV_VARS_TO_SHOW) {
    result.environment.push({
      name: envVar,
      value: process.env[envVar],
    })
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(result))
  logRequest(req.url, 200)
}

const SERVER = createServer(requestHandler)


function listeningListener(error? : Error) {
  if (error) {
    return console.log('something bad happened', error)
  }

  console.log(`server is listening on ${PORT}`)
}

SERVER.listen(PORT, 1024, listeningListener)
