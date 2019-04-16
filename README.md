# Docker Placeholder HTTP App

This provides a placeholder web app that can be used to test deployment system and anything else that assumes a web service is available at a specific endpoint.

## Usage

```
$ docker run --rm -p 8080:8080 webdestroya/http-placeholder:latest
```

## Endpoints
* `/health`: returns a 200 OK and the text "OK"
* `/favicon.ico`: returns a 404
* `/robots.txt`: returns a Robots file to disable indexing
* `/###`: returns a page with the corresponding error code provided
* `/headers`: returns request headers
* `/environment`: returns a JSON hash of the environment variables for the container (if enabled)
* *All Others*: returns a welcome page


## Configuration

| Environment Variable | Default | Description |
| --------------------- | ------------ | ------------ |
| `PLACEHOLDER_SHOW_ENV` | `true` | Whether to show the `/environment` page.<br>Possible values are:<br>`true`: show all vars (default)<br>`false`: show nothing<br>`list`: show env vars in `PLACEHOLDER_ENV_LIST`  |
| `PLACEHOLDER_HEALTHCHECK` | `/health` | The path to use for the healthcheck |
| `PLACEHOLDER_APP_NAME` | `Placeholder` | The name of the app. Shown on index page |
| `PLACEHOLDER_ROBOTS` | `true` | Whether to respond to the robots.txt request |
| `PLACEHOLDER_ENV_LIST` | | A comma separated list of env vars to show.<br>(When `PLACEHOLDER_SHOW_ENV` is set to `list`) |
| `PORT` | `8080` | Default port to serve app on |


### Notes for testing
Here are some notes for this README so I can bump the commit SHA.