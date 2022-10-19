from django.db import models
from datetime import datetime
# Al producto vamos a designarle una categoria
from apps.category.models import Category
# Para cargar las fotos
from django.conf import settings
domain = settings.DOMAIN
# Empezamos nuestra definicion de clase product
class Product(models.Model):
    """Esta clase crea un producto que estara encasillado dentro de una categoria

    Args:
        models.Model() --> inherites from Django model apps

    Table fields:
        photo: pasaremos el año y el mes
        category: Inherits from Category model
    """
    name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='photos/%Y/%m/')
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    compare_price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    sold = models.IntegerField(default=0)
    date_created = models.DateTimeField(default=datetime.now)
    
    # METHODS
    def get_thumbnail(self):
        """Para poder ver la foto entera:
        
        http://localhost:3000/media/photos/2022/10/guantes_oN7Cpqo.png

        Returns:
            _type_: _description_
        """
        if self.photo:
            # return self.photo.url (no funciona)
            # Creamos una variable de dominio en settings
            # return domain + self.photo.url
            return self.photo.url
        return ''

    def __str__(self):
        """Mostramos el Producto por su nombre

        Returns:
            
        """
        return self.name
