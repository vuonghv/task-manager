from uuid import uuid4
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(_('username'), max_length=150, blank=True)
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'user'

    def __str__(self):
        return '{}-{}'.format(self.id, self.username)


class AccessToken(models.Model):
    """
    The default authorization token model.
    """
    key = models.CharField(_("Key"), max_length=128, primary_key=True, default=uuid4)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='+',
        on_delete=models.CASCADE, verbose_name=_("User")
    )
    created = models.DateTimeField(_("Created"), auto_now_add=True)
    expired_time = models.DateTimeField(_("Expired Time"))

    class Meta:
        db_table = 'access_token'

    def __str__(self):
        return f'{self.user_id}-{self.key}'
