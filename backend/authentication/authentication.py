from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class DeveloperConfiguredJWTAuthentication(JWTAuthentication):
    """
    Resilient JWT Authentication that authenticates valid JWT tokens,
    while gracefully handling expired or malformed tokens on open endpoints
    (preventing public product listings or guest cart sessions from breaking with 401).
    """

    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, AuthenticationFailed):
            # Stale or invalid token provided: treat as anonymous rather than throwing 401.
            # Views with IsAuthenticated will still reject access appropriately.
            return None