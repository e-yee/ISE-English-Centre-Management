from .decorators import role_required

# This makes role_required available when importing from app.auth
__all__ = ['role_required']