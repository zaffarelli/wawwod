import os
import tomllib
import colorlog

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = "y-he7pukz&#$z_9c_*r7st6p6cm+tu$i9&h*gbw+z!%p4paw3!"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "compressor",
    "fixture_magic",
    "colorfield",
    "collector.apps.CollectorConfig",
    "storytelling.apps.StorytellingConfig",

]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

COMPRESS_PRECOMPILERS = (("text/x-scss", "django_libsass.SassCompiler"),)

STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    "compressor.finders.CompressorFinder",
)

ROOT_URLCONF = "wawwod.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "collector/templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "collector.context_processors.commons",
            ],
        },
    },
]

AUTHENTICATION_BACKENDS = ["django.contrib.auth.backends.ModelBackend"]

LOGPATH = os.path.join(BASE_DIR, "logs/")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s | %(log_color)s%(name)s %(white)s| %(message)s",
            "datefmt": "%d %H:%M:%S",
            "()": 'colorlog.ColoredFormatter'
        },
    },
    "handlers": {
        "logfile": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGPATH + "django.log",
            "maxBytes": 10000000,
            "backupCount": 5,
            "formatter": "standard",
            "level": "DEBUG"
        },
        "wodlog": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGPATH + "wawwod.log",
            "maxBytes": 10000000,
            "backupCount": 5,
            "formatter": "standard",
            "level": "DEBUG"
        },

        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "level": "DEBUG"
        },
    },
    "loggers": {
        "django": {
            "handlers": ["logfile"],
            "propagate": True,
        },
        "wawwod": {
            "handlers": ["wodlog"],
            "propagate": True,
        }
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    }
}
WSGI_APPLICATION = "wawwod.wsgi.application"

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'wawwod',
#         # 'NAME': 'redfoxinc',
#         'USER': 'root',
#         'PASSWORD': 'root',
#         'HOST': '',
#         'PORT': '',
#     }
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'wawwod',
#         'USER': 'wawwod',
#         'PASSWORD': 'wawwod',
#         'HOST': 'localhost',
#         'PORT': '5442'
#     },
# }

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "wawwod.sqlite3",  # This is where you put the name of the db file.
        # If one doesn't exist, it will be created at migration time.
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Paris"
DATETIME_FORMAT = "D Y/m/d H:i"
USE_I18N = True
USE_L10N = False
USE_TZ = False

STATIC_URL = "/static/"
MEDIA_URL = "/media/"
STATIC_ROOT = "wawwod_static/"
MEDIA_ROOT = "wawwod_media/"

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

if DEBUG:
    import mimetypes

    mimetypes.add_type("application/javascript;charset=utf-8", ".es6", True)
    mimetypes.add_type("application/javascript;charset=utf-8", ".js", True)

VERSION = "unknown"
with open("pyproject.toml", "rb") as f:
    data = tomllib.load(f)
    VERSION = data["project"]["version"]
