from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication

from apps.users.models import AccessToken


class BearerAuthentication(TokenAuthentication):
    keyword = 'Bearer'
    model = AccessToken

    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.select_related('user').get(key=key)
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                detail=_('Invalid token.'), code='INVALID_ACCESS_TOKEN')

        utc_now = timezone.now()
        if utc_now > token.expired_time:
            raise exceptions.AuthenticationFailed(
                detail=_('Token has expired'), code='ACCESS_TOKEN_EXPIRED')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(
                detail=_('User inactive or deleted.'), code='INACTIVE_USER')

        return (token.user, token)
