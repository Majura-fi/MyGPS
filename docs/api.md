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

```
[
  {
    "id": Integer,
    "duration_seconds": Integer,

    // Format: %a, %d %b %Y %H:%M:%S GMT
    // Example: Fri, 28 Jun 2019 16:43:25 GMT
    "first_point_time": String,
    "last_point_time": String,

    "name": NULL or String,
    "owner_id": Integer,
    "point_count": Integer
  },
  ...
  {
    "id": Integer,
    "duration_seconds": Integer,

    // Format: %a, %d %b %Y %H:%M:%S GMT
    // Example: Fri, 28 Jun 2019 16:43:25 GMT
    "first_point_time": String,
    "last_point_time": String,

    "name": NULL or String,
    "owner_id": Integer,
    "point_count": Integer
  }
]
```

## GET paths/live

Returns list of paths that are considered as live. Response code 200.

```
[
  {
    "id": Integer,
    "duration_seconds": Integer,

    // Format: %a, %d %b %Y %H:%M:%S GMT
    // Example: Fri, 28 Jun 2019 16:43:25 GMT
    "first_point_time": String,
    "last_point_time": String,

    "name": NULL or String,
    "owner_id": Integer,
    "point_count": Integer
  }
]
```

## GET paths/@id

Returns full information of the path with given id.

```
{
  "meta": {
    "id": Integer,
    "duration_seconds": Integer,

    // Format: %a, %d %b %Y %H:%M:%S GMT
    // Example: Fri, 28 Jun 2019 16:43:25 GMT
    "first_point_time": String,
    "last_point_time": String,

    "name": NULL or String,
    "owner": {
      "display_name": String,
      "id": Integer
    },
    "owner_id": Integer,
    "point_count": Integer
  },
  "path": [
    {
      "accuracy": Float,
      "altitude": Float,
      "guid": Integer,
      "latitude": Float,
      "longitude": Float,
      "pathmeta_id": 2,
      "speed": Float,

      // Format: %a, %d %b %Y %H:%M:%S GMT
      // Example: Fri, 28 Jun 2019 16:43:25 GMT
      "time_gmt": "Mon, 29 May 2017 07:42:23 GMT"
    },
    ...{
      "accuracy": Float,
      "altitude": Float,
      "guid": Integer,
      "latitude": Float,
      "longitude": Float,
      "pathmeta_id": Integer,
      "speed": Float,

      // Format: %a, %d %b %Y %H:%M:%S GMT
      // Example: Fri, 28 Jun 2019 16:43:25 GMT
      "time_gmt": "Mon, 29 May 2017 10:08:25 GMT"
    }
  ]
}
```

## GET paths/meta/@id

Returns meta information for the path with given id.

```
{
  "id": Integer,
  "duration_seconds": Integer,

  // Format: %a, %d %b %Y %H:%M:%S GMT
  // Example: Fri, 28 Jun 2019 16:43:25 GMT
  "first_point_time": String,
  "last_point_time": String,

  "name": NULL or String,
  "owner_id": Integer,
  "owner_name": "Majura",
  "point_count": Integer
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
  "api_key": NULL or String,
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
  "api_key": NULL or String,
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
