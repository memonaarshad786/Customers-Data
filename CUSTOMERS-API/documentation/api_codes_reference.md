# API Error/Status Codes Reference

| Code | HTTP | Meaning / When It Happens |
|------|------|----------------------------|
| 0 | 200 / 201 |  Success — operation completed (e.g. created, updated, fetched) |
| 100 | 400 |  Invalid input or ID — bad data type or wrong ID format |
| 101 | 400 |  Invalid email — email format check failed |
| 102 | 400 |  Missing required fields — required data not provided |
| 200 | 409 |  Duplicate email — another record already has this email |
| 201 | 409 |  Duplicate phone — phone number already exists (reserved for future) |
| 300 | 404 |  Not found — customer with given ID doesn’t exist |
| 400 | 401 |  Unauthorized — missing or invalid authentication (future use) |
| 401 | 403 |  Forbidden — user doesn’t have rights for the action (future use) |
| 500 | 500 |  Server error — database failure, SQL exception, or code crash |
| 600 | 422 |  Unprocessable entity — valid JSON but logic failed |
| 700 | 408 | Request timeout — DB or server took too long |

## Summary
- **Success:** `0`
- **Input / validation errors:** `100–199`
- **Conflict (duplicate data):** `200–299`
- **Not found / auth issues:** `300–499`
- **Server / DB errors:** `500+`
