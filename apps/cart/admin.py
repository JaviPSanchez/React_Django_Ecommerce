from django.contrib import admin

# Register your models here.
from .models import Cart
# Esto es necesario para registrar el carriot cuando creemos un usuario.
admin.site.register(Cart)
