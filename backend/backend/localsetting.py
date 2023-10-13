import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
# 创建容器 docker run -itd --name mysql -p 3456:3306 -e MYSQL_ROOT_PASSWORD=iasjefoaiioggg8uunb mysql
MYSQL_ROOT_PASSWORD = 'iasjefoaiioggg8uunb'
MYSQL_USER = 'drq'
MYSQL_PASSWORD = 'gehajsngdsbiu233nbjvndj'
"""
CREATE USER 'drq'@'%' IDENTIFIED BY 'gehajsngdsbiu233nbjvndj';
GRANT ALL PRIVILEGES ON *.* TO 'drq'@'%';
microdnf install -y vim
"""

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'my_site',
        'USER': MYSQL_USER,
        'PASSWORD': MYSQL_PASSWORD,
        'HOST': '127.0.0.1',
        'PORT': 3456,
    },
}


SECRET_KEY = 'afawjekfop320394892033jngks'