from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
# Create your models here.

# Create your models here.


class User(AbstractUser):
    password = models.CharField(help_text='密码', max_length=100)
    email = models.CharField(help_text='邮箱', max_length=100)
    nick_name = models.CharField(help_text='昵称', max_length=20)

    def __str__(self):
        return f"<User: {self.id} - {self.email}"

class UserEmailVerCode(models.Model):
    user_id = models.IntegerField(db_index=True, help_text='user表的id')
    ver_code = models.CharField(max_length=6, help_text='验证码')
    expire_datetime = models.DateTimeField()

    class Meta:
        db_table = 'user_email_ver_code'