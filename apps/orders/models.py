from django.db import models
from apps.product.models import Product
# Archivo countries para ayudarnos
from .countries import Countries
from datetime import datetime
from django.contrib.auth import get_user_model
User = get_user_model()


class Order(models.Model):
    # Definimos los status de la orden.
    class OrderStatus(models.TextChoices):
        not_processed = 'not_processed'
        processed = 'processed'
        shipping = 'shipped'
        delivered = 'delivered'
        cancelled = 'cancelled'
    # vinculamos los status a nuestro modelo Order
    status = models.CharField(
        max_length=50, choices=OrderStatus.choices, default=OrderStatus.not_processed)
    # vinculamos al usuario
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # Para conocer la transacion que es, necesitamos un id:
    transaction_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    full_name = models.CharField(max_length=255)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255)
    state_province_region = models.CharField(max_length=255)
    postal_zip_code = models.CharField(max_length=20)
    country_region = models.CharField(
        max_length=255, choices=Countries.choices, default=Countries.Spain)
    telephone_number = models.CharField(max_length=255)
    # UPS o DHL
    shipping_name = models.CharField(max_length=255)
    # dias de shipping
    shipping_time = models.CharField(max_length=255)
    shipping_price = models.DecimalField(max_digits=5, decimal_places=2)
    date_issued = models.DateTimeField(default=datetime.now)
    # Para poder tener un nombre legible
    def __str__(self):
        return self.transaction_id


class OrderItem(models.Model):
    # No queremos afectar al productor al borrar
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    count = models.IntegerField()
    date_added = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.name