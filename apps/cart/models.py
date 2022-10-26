from django.db import models
from apps.product.models import Product
# Importamos de settings y poder migrar correctamente toda la info.
from django.conf import settings
# Esta es otra forma de llamamr al usuario cuando sale el error en django
User = settings.AUTH_USER_MODEL

# Objeto de los usuarios
class Cart(models.Model):
    # Vamos a usar un usuario y cada usuario tendrá su carrito, de ahí que usemos OneToOneField, cuando borramos el user se borra el carrito
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_items = models.IntegerField(default=0)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    count = models.IntegerField()