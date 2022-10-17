from rest_framework import serializers
from .models import Product

# Para poder mostrarlo todo en formato JSON:
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        # Definimos el modelo que queremos serializar
        model = Product
        fields = [
            'id',
            'name',
            'photo',
            'description',
            'price',
            'compare_price',
            'category',
            'quantity',
            'sold',
            'date_created',
            'get_thumbnail'
        ]