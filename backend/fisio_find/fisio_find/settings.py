"""
Django settings for fisio_find project.

Generated by 'django-admin startproject' using Django 5.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from datetime import timedelta
from pathlib import Path
import os
from dotenv import load_dotenv
import os
import dj_database_url  # Para parsear la URL de la base de datos
import environ

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-temporary-key-for-deployment')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'fisiofind-backend.azurewebsites.net', 'fisiofind.netlify.app']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# DJANGO REST FRAMEWORK
INSTALLED_APPS += [
    'rest_framework',               # API REST principal
    'rest_framework.authtoken',     # Autenticación por tokens (opcional)
    'rest_framework_simplejwt',     # Autenticación JWT (recomendada)
]   

# APPS PROPIAS

INSTALLED_APPS += [
    'gestion_usuarios',
    'gestion_citas',
    'gestion_terminos',
    'sesion_invitado'
]



INSTALLED_APPS += [ 'corsheaders', 'django_extensions',
    'django_filters']


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Move this up
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Remove the duplicate corsheaders.middleware.CorsMiddleware from here
    'django.middleware.common.CommonMiddleware',
]

# Add additional CORS settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
         'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
         'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # El token dura 1 día
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),   # No lo vamos a usar, pero se requiere
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ("Bearer",),
}

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://fisiofind-backend.azurewebsites.net",  # Note the comma here
    "https://fisiofind.netlify.app"
]

ROOT_URLCONF = 'fisio_find.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fisio_find.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.getenv('DATABASE_NAME'),
#         'USER': os.getenv('DATABASE_USER'),
#         'PASSWORD': os.getenv('DATABASE_PASSWORD'),
#         'HOST': os.getenv('DATABASE_HOST'),
#         'PORT': os.getenv('DATABASE_PORT'),
#     }
# }

env = environ.Env()
environ.Env.read_env()

IS_PRODUCTION = os.getenv('DJANGO_PRODUCTION', env.bool('DJANGO_PRODUCTION', default=False))

DEBUG = not IS_PRODUCTION

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME', env('DATABASE_NAME', default='postgres')),
        'USER': os.getenv('DATABASE_USER', env('DATABASE_USER', default='postgres')),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', env('DATABASE_PASSWORD', default='')),
        'HOST': os.getenv('DATABASE_HOST', env('DATABASE_HOST', default='localhosts')),
        'PORT': os.getenv('DATABASE_PORT', env('DATABASE_PORT', default='5432')),
        'OPTIONS': {
            'sslmode': 'require' if IS_PRODUCTION else 'prefer',
        },
    }
}

ALLOWED_HOSTS = ['*'] if DEBUG else ['fisiofind-backend.azurewebsites.net']

AUTH_USER_MODEL = 'gestion_usuarios.AppUser'


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
