import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# Cada vez que creemos un user queremos asignarle un carrito
from apps.cart.models import Cart
# from apps.user_profile.models import UserProfile
# from apps.wishlist.models import WishList
# Vamos a permitir al usuario que se registre a traves de React:


# Creamos la class UserAccountManager para 

class UserAccountManager(BaseUserManager):
    # Funcion para crear un usuario:
    # kwargs is just a dictionary that is added to the parameters.
    # ** --> unpacks dictionaries, this : func(a=1, b=2, c=3) is the same as
    # args = {'a': 1, 'b': 2, 'c':3}
    # func(**args)
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        # Grabamos el usuario:
        user.set_password(password)
        user.save()
        # Siempre que creemos un usuario, tendrá un carrito asociado:
        shopping_cart = Cart.objects.create(user=user)
        shopping_cart.save()
        
        # profile = UserProfile.objects.create(user=user)
        # profile.save()
        
        # wishlist = WishList.objects.create(user=user)
        # wishlist.save()

        return user

    
    def create_superuser(self, email, password, **kwargs):
        user = self.create_user(email, password, **kwargs)

        user.is_superuser = True
        user.is_staff = True
        user.save()

        

        return user
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    # Si el usuario a activado o no su cuenta
    is_active = models.BooleanField(default=True)
    # Por defecto no es staff:
    is_staff = models.BooleanField(default=False)
    
    objects = UserAccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    # Vamos a presentar en Django Admin la siguiente info:
    
    # funcion para obtener el nombre completo del user
    def get_full_name(self):
        return self.first_name + ' ' + self.last_name
    # funcion para obtener el nombre corto del user
    def get_short_name(self):
        return self.first_name
    # para obtener el email:
    def __str__(self):
        return self.email