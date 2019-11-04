# MyGPS Api

This api accepts data either in JSON or multipart/form-data. Responses are either empty with response code 200, or they return JSON formatted response. If error happened, then the response content is the error with corresponding response code.

## POST auth/login

Login information:

```
{
  "email": String,
  "password": String
}
```

Correct login. Response code 200.

```
{
  "api_key": String,      // User api key.
  "display_name": String, // User display name.
  "email": String,        // User email.
  "id": Integer,          // User ID.
  "token": String         // Auth-token.
}
```

Invalid login. Response code 400.

```
Wrong email or password!
```

## GET paths/list

Returns list of path metas. Response code 200.

```json
[
  {
    "duration_seconds": 9240,
    "first_point_time": "Mon, 05 Nov 2018 15:46:13 GMT",
    "id": 47,
    "last_point_time": "Mon, 05 Nov 2018 18:20:13 GMT",
    "name": null,
    "owner_id": 1,
    "point_count": 1054
  },
  ...{
    "duration_seconds": 2177,
    "first_point_time": "Fri, 28 Jun 2019 16:43:25 GMT",
    "id": 50,
    "last_point_time": "Fri, 28 Jun 2019 17:19:42 GMT",
    "name": null,
    "owner_id": 1,
    "point_count": 226
  }
]
```

## GET paths/live

Returns list of paths that are considered as live. Response code 200.

```json
[
  {
    "duration_seconds": 0,
    "first_point_time": "Mon, 04 Nov 2019 17:16:56 GMT",
    "id": 51,
    "last_point_time": "Mon, 04 Nov 2019 17:16:56 GMT",
    "name": null,
    "owner_id": 1,
    "point_count": 1
  }
]
```

## GET paths/@id

Returns full information of the path with given id.

```json
{
  "meta": {
    "duration_seconds": 8762,
    "first_point_time": "Mon, 29 May 2017 07:42:23 GMT",
    "id": 2,
    "last_point_time": "Mon, 29 May 2017 10:08:25 GMT",
    "name": null,
    "owner": {
      "display_name": "Majura",
      "id": 1
    },
    "owner_id": 1,
    "point_count": 425
  },
  "path": [
    {
      "accuracy": 0.0,
      "altitude": 0.0,
      "guid": 3,
      "latitude": 61.4986,
      "longitude": 23.8184,
      "pathmeta_id": 2,
      "speed": 0.0,
      "time_gmt": "Mon, 29 May 2017 07:42:23 GMT"
    },
    ...{
      "accuracy": 0.0,
      "altitude": 0.0,
      "guid": 427,
      "latitude": 60.3424,
      "longitude": 24.3295,
      "pathmeta_id": 2,
      "speed": 0.0,
      "time_gmt": "Mon, 29 May 2017 10:08:25 GMT"
    }
  ]
}
```

## GET paths/meta/@id

Returns meta information for the path with given id.

```json
{
  "duration_seconds": 2177,
  "first_point_time": "Fri, 28 Jun 2019 16:43:25 GMT",
  "id": 50,
  "last_point_time": "Fri, 28 Jun 2019 17:19:42 GMT",
  "name": null,
  "owner_id": 1,
  "owner_name": "Majura",
  "point_count": 226
}
```

## DELETE paths/@id

Removes the path with given id.

## DEL users/api_key

Removes the api key from the current user. The api key is replaced with NULL value.

```
{
  "api_key": NULL,
  "display_name": String,
  "email": String,
  "id": Integer
}
```

## PTCH users/api_key

Generates a new api key for the current user.

```
{
  "api_key": String,
  "display_name": String,
  "email": String,
  "id": Integer
}
```

## PTCH users/@id

Updates user information.

All fields are optional. Fields `current_password` and `new_password` are both required when updating password.

```
{
  "current_password": String,
  "new_password": String,
  "new_display_name": String,
  "new_email": String
}
```

Response code 200 and updated user info.

```
{
  "api_key": String,
  "display_name": String,
  "email": String,
  "id": Integer
}
```

## POST users/check_name

Checks if user name is available. Response code 200.

```
{
  "available": Boolean
}
```

## GET users/profile

Returns current user information with response code 200, or 404 if not found.

```
{
  "api_key": String,
  "display_name": String,
  "email": String,
  "id": Integer
}
```

## POST users/register

Attempts to register a new user.

```
{
  "display_name": String,
  "password": String,
  "email": String
}
```

On success - response 200:

```
{
  "display_name": String,
  "email": String
}
```
