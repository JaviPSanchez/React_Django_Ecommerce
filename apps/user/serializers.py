# Este serializer va a ser distinto porque vamos a user djoser
from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()



class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        # Modelo que serializamos:
        model = User
        # Campos:
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'get_full_name',
            'get_short_name'
        )