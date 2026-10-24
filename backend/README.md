# AgriProducts Marketplace - Backend Documentation

This backend is built using **Python + Django + Django REST Framework** for the Agriculture Products E-Commerce marketplace. It handles multi-category agricultural cataloging, passwordless OTP authentication (Email & Mobile), inventory control, server-authoritative cart pricing, checkout, and secure payment processing.

---

# Manual JWT Configuration

As specified by the architecture requirements, **the final JWT verification and cryptographic layer is reserved for manual configuration by the developer**. Antigravity provides the architecture, user models, OTP verification pipelines, authentication contexts, and API hooks, leaving the cryptographic signing and validation untouched for your explicit setup.

This guide answers all 10 critical configuration items:

### 1. Which file contains the JWT configuration placeholder?
There are two primary backend files containing explicit `# TODO: MANUAL JWT IMPLEMENTATION` placeholders:
- [`backend/authentication/jwt_service.py`](file:///d:/Payment%20system/backend/authentication/jwt_service.py): Contains the `generate_tokens_for_user(user)` function where JWT generation logic must be inserted.
- [`backend/authentication/authentication.py`](file:///d:/Payment%20system/backend/authentication/authentication.py): Contains the `DeveloperConfiguredJWTAuthentication` class extending DRF's `BaseAuthentication` where incoming bearer tokens are validated.

### 2. Which Django settings need to be configured?
In [`backend/config/settings.py`](file:///d:/Payment%20system/backend/config/settings.py):
If using `djangorestframework-simplejwt`, configure the token lifetimes and signing algorithm:
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'SIGNING_KEY': os.getenv('JWT_SIGNING_KEY', SECRET_KEY),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
```

### 3. Which authentication class needs to be enabled?
In [`backend/config/settings.py`](file:///d:/Payment%20system/backend/config/settings.py) under `REST_FRAMEWORK`:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # Either enable your custom class:
        'authentication.authentication.DeveloperConfiguredJWTAuthentication',
        # OR if using SimpleJWT directly:
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    ...
}
```

### 4. Where the JWT signing key goes?
Store your signing secret in your backend `.env` file:
```env
JWT_SIGNING_KEY=your-secure-cryptographic-jwt-secret-key-here-do-not-expose-to-frontend
```
This is read into Django via `os.getenv('JWT_SIGNING_KEY')` in `config/settings.py`. **Never expose this secret key to React or the client bundle.**

### 5. How access tokens are verified?
In [`backend/authentication/authentication.py`](file:///d:/Payment%20system/backend/authentication/authentication.py):
When a request arrives, DRF extracts the header:
```http
Authorization: Bearer <ACCESS_TOKEN>
```
Your authentication class verifies:
1. Decode the token using `JWT_SIGNING_KEY` and algorithm (e.g. `HS256`).
2. Verify token has not expired (`exp` claim).
3. Extract `user_id` from payload claims.
4. Fetch active user: `user = CustomUser.objects.get(id=user_id, is_active=True)`.
5. Return tuple `(user, token)`.

### 6. How refresh tokens work?
When an access token expires (e.g., after 15–60 minutes), the client sends the long-lived refresh token (e.g., 7 days) to your token refresh endpoint:
```http
POST /api/auth/token/refresh/
Content-Type: application/json

{
    "refresh": "<JWT_REFRESH_TOKEN>"
}
```
The server validates the refresh token against its blacklist / signing key and issues a fresh `<JWT_ACCESS_TOKEN>` without forcing the customer to re-enter an OTP.

### 7. How React sends the access token?
In [`frontend/src/services/api.js`](file:///d:/Payment%20system/frontend/src/services/api.js), Axios interceptors automatically attach the stored token from `localStorage` or `AuthContext` to every outbound request:
```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agri_access_token');
  if (token && token !== '<JWT_ACCESS_TOKEN>') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 8. How to test a protected endpoint?
1. Request an OTP:
   ```bash
   curl -X POST http://localhost:8000/api/auth/send-otp/ \
     -H "Content-Type: application/json" \
     -d '{"identifier": "farmer@example.com", "identifier_type": "email"}'
   ```
2. Verify OTP:
   ```bash
   curl -X POST http://localhost:8000/api/auth/verify-otp/ \
     -H "Content-Type: application/json" \
     -d '{"identifier": "farmer@example.com", "otp": "<OTP_CODE>"}'
   ```
3. Once you configure JWT, pass the returned access token to test `/api/users/me/`:
   ```bash
   curl -X GET http://localhost:8000/api/users/me/ \
     -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
   ```
   A valid token returns `200 OK` with customer profile data.

### 9. How to test an expired token?
Configure `ACCESS_TOKEN_LIFETIME = timedelta(seconds=5)` in `settings.py`.
1. Authenticate to receive an access token.
2. Wait 6 seconds.
3. Call `GET /api/users/me/` with the expired token.
4. The server responds with `401 Unauthorized` (`token_not_valid` or `Token has expired.`).

### 10. How to test logout/token invalidation?
1. Client clears tokens from local storage and state via `AuthContext.logout()`.
2. For server-side token blacklisting (e.g. `rest_framework_simplejwt.token_blacklist`):
   Send the refresh token to blacklist endpoint:
   ```bash
   curl -X POST http://localhost:8000/api/auth/logout/ \
     -H "Authorization: Bearer <ACCESS_TOKEN>" \
     -d '{"refresh": "<REFRESH_TOKEN>"}'
   ```
3. Subsequent requests using blacklisted tokens or after client logout fail with `401 Unauthorized`.

---

## Running the Backend

### Activate virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

### Run migrations:
```powershell
python backend/manage.py migrate
```

### Seed Agricultural Catalog:
```powershell
python backend/manage.py seed_agriculture_products
```

### Start Development Server:
```powershell
python backend/manage.py runserver 8000
```
