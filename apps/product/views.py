# Todo lo que necesitamos del REST framework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
# Con lo que vamos a trabajar:
from apps.product.models import Product
from apps.product.serializers import ProductSerializer
from apps.category.models import Category
# vamos a realizar una busqueda de productos, usaremos Q
# A Q() object represents an SQL condition that can be used in database-related operations.
# It’s similar to how an F() object represents the value of a model field or annotation.
# They make it possible to define and reuse conditions, and combine them using operators such as | (OR), & (AND), and ^ (XOR).
from django.db.models import Q

# Creamos una clase para visualizar un solo producto:
class ProductDetailView(APIView):
    # Primero damos cualquier permiso, puesto que es un detail cualquiera puede verlo
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, productId, format=None):
        """ Vista para ver un producto singular

        Args:
            request (): 
            productId (int): 
            format (): 

        Returns:
            
        """
        try:
            # Esta es la informacion que vamos a coger como numero entero:
            product_id = int(productId)
        except:
            return Response(
                {'error': 'Product ID must be an integer'},
                status=status.HTTP_404_NOT_FOUND)
        # Creamos la logica, si existe el producto, buscamos el id del producto
        if Product.objects.filter(id=product_id).exists():
            # Llamamos al objeto del producto, la funcion get sirve para coger un objeto al cual hay que pasarle un filtro, en este caso decimos el id:
            product = Product.objects.get(id=product_id)
            # Queremos serializar el objeto
            product = ProductSerializer(product)
            # Con la informacion serializada, devolvemos la info en formato dict
            return Response({'product': product.data}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Product with this ID does not exist'},
                status=status.HTTP_404_NOT_FOUND)
            

class ListProductsView(APIView):
    # Todo el mundo puede ver los productos:
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        """Aqui vamos a ver una lista de productos, luego no necesitamos un productId

        Args:
            request (_type_): _description_
            format (_type_, optional): _description_. Defaults to None.

        Returns:
            _type_: _description_
        """
        # Django QuerySet API --> Methods that do not return QuerySets
        # Entry.objects.get(headline__contains='Lennon')
        # SELECT ... WHERE headline LIKE '%Lennon%';
        sortBy = request.query_params.get('sortBy')
        # Si nuestro producto no tiene:
        if not (sortBy == 'date_created' or sortBy == 'price' or sortBy == 'sold' or sortBy == 'name'):
            # Ordenar por fecha de creacion:
            sortBy = 'date_created'
        # 
        order = request.query_params.get('order')
        limit = request.query_params.get('limit')
        # Si no existe limitamos a 6
        if not limit:
            limit = 6
        # ???
        try:
            limit = int(limit)
        # No encuentra un limite
        except:
            return Response(
                {'error': 'Limit must be an integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        if limit <= 0:
            limit = 6
        # Finalmente realizamos el orden:
        if order == 'desc':
            # sortBy va a ser negativo, lo manipulamos
            sortBy = '-' + sortBy
            # order_by(*fields)
            products = Product.objects.order_by(sortBy).all()[:int(limit)]
        elif order == 'asc':
            # No modificamos sortBy
            products = Product.objects.order_by(sortBy).all()[:int(limit)]
        else:
            # Mostramos todo
            products = Product.objects.order_by(sortBy).all()

        # Mostramos la serializacion del orden realizado arriba
        # Cuando tenemos una lista de productos decimos many=True
        products = ProductSerializer(products, many=True)

        if products:
            return Response({'products': products.data}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'No products to list'},
                status=status.HTTP_404_NOT_FOUND)
            
# Logica para el buscador de productos:
class ListSearchView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        """Enviamos info y recibimos una informacion, la guardamos en la variable data

        Args:
            request (_type_): _description_
            format (_type_, optional): _description_. Defaults to None.

        Returns:
            _type_: _description_
        """
        data = self.request.data
        # Cogemos la categoria de la info recibida
        try:
            category_id = int(data['category_id'])
        except:
            return Response(
                {'error': 'Category ID must be an integer'},
                status=status.HTTP_404_NOT_FOUND)

        search = data['search']

        # Chequear si algo input ocurrio en la busqueda
        if len(search) == 0:
            # mostrar todos los productos si no hay input en la busqueda
            search_results = Product.objects.order_by('-date_created').all()
        else:
            # Si hay criterio de busqueda, filtramos con dicho criterio usando Q
            search_results = Product.objects.filter(
                Q(description__icontains=search) | Q(name__icontains=search)
            )

        if category_id == 0:
            search_results = ProductSerializer(search_results, many=True)
            return Response(
                {'search_products': search_results.data},
                status=status.HTTP_200_OK)
        

        # revisar si existe categoria
        if not Category.objects.filter(id=category_id).exists():
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND)

        category = Category.objects.get(id=category_id)

        # si la categoria tiene apdre, fitlrar solo por la categoria y no el padre tambien
        if category.parent:
            search_results = search_results.order_by(
                '-date_created'
            ).filter(category=category)
        
        else:
            # si esta categoria padre no tiene hijjos, filtrar solo la categoria
            if not Category.objects.filter(parent=category).exists():
                search_results = search_results.order_by(
                    '-date_created'
                ).filter(category=category)
        
            else:
                categories = Category.objects.filter(parent=category)
                filtered_categories = [category]

                for cat in categories:
                    filtered_categories.append(cat)
                
                filtered_categories = tuple(filtered_categories)

                search_results = search_results.order_by(
                    '-date_created'
                ).filter(category__in=filtered_categories)
        
        search_results = ProductSerializer(search_results, many=True)
        return Response({'search_products': search_results.data}, status=status.HTTP_200_OK)