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
        # Almacenamos toda la info
        data = self.request.data
        try:
            # Cogemos la categoria de la info recibida y la convertimos en int
            # Nos va a permitir hcaer una busqueda por electrodomesticos por ejemplo...
            category_id = int(data['category_id'])
        except:
            # Si no existe este id, sacamos un error
            return Response(
                {'error': 'Category ID must be an integer'},
                status=status.HTTP_404_NOT_FOUND)
        # Pasaremos una busqueda???
        search = data['search']

        # Si no obtenemos ningun critero
        if len(search) == 0:
            # mostrar todos los productos
            search_results = Product.objects.order_by('-date_created').all()
        else:
            # Si hay criterio de busqueda, filtramos con dicho criterio usando Q
            search_results = Product.objects.filter(
                Q(description__icontains=search) | Q(name__icontains=search)
            )
        if category_id == 0:
        #  Si el category_id es 0, diremos que nuestro resultados seran muchos
            search_results = ProductSerializer(search_results, many=True)
            return Response(
                # Mostramos la informacion
                {'search_products': search_results.data},
                status=status.HTTP_200_OK)
        
        # Comprobamos que Category existe y si no existe :
        if not Category.objects.filter(id=category_id).exists():
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND)
        # obtenemos las category_id
        category = Category.objects.get(id=category_id)

        # si la categoria tiene un parent, filtrar solo por la categoria
        if category.parent:
            search_results = search_results.order_by(
                '-date_created'
            ).filter(category=category)
        
        else:
            # si esta categoria padre no tiene hijos, filtrar solo la categoria
            if not Category.objects.filter(parent=category).exists():
                search_results = search_results.order_by(
                    '-date_created'
                ).filter(category=category)
        
            else:
                categories = Category.objects.filter(parent=category)
                # Decimos que las categorias filtradas son category
                filtered_categories = [category]
                # Cogemos todas las categorias que tenemos:
                for cat in categories:
                    filtered_categories.append(cat)
                #  Creamos una tuple
                filtered_categories = tuple(filtered_categories)
                # Mostramos lo que hemos filtrado
                search_results = search_results.order_by(
                    '-date_created'
                ).filter(category__in=filtered_categories)
        
        search_results = ProductSerializer(search_results, many=True)
        return Response({'search_products': search_results.data}, status=status.HTTP_200_OK)
    
# Creamos la vista para mostrar los products relacionados:
class ListRelatedView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, productId, format=None):
        """Buscamos los productos relacionados, 

        Args:
            request (_type_): _description_
            productId (_type_): _description_
            format (_type_, optional): 

        Returns:
            _type_: _description_
        """
        # Empezamos viendo si existe product_id o no:
        try:
            product_id = int(productId)
        except:
            return Response(
                {'error': 'Product ID must be an integer'},
                status=status.HTTP_404_NOT_FOUND)
        
        # ?????
        if not Product.objects.filter(id=product_id).exists():
            return Response(
                {'error': 'Product with this product ID does not exist'},
                status=status.HTTP_404_NOT_FOUND)
        # cogemos las categorias del producto:
        category = Product.objects.get(id=product_id).category
        # Ahora podemos filtrar el producto por categoría:
        if Product.objects.filter(category=category).exists():
            # Si la categoria tiene padre, filtrar solo por la categoria
            if category.parent:
                related_products = Product.objects.order_by(
                    '-sold'
                ).filter(category=category)
            else:
                if not Category.objects.filter(parent=category).exists():
                    related_products = Product.objects.order_by(
                        '-sold'
                    ).filter(category=category)
                
                else:
                    categories = Category.objects.filter(parent=category)
                    filtered_categories = [category]

                    for cat in categories:
                        filtered_categories.append(cat)

                    filtered_categories = tuple(filtered_categories)
                    related_products = Product.objects.order_by(
                        '-sold'
                    ).filter(category__in=filtered_categories)
                
            #Excluir producto que estamos viendo
            related_products = related_products.exclude(id=product_id)
            related_products = ProductSerializer(related_products, many=True)

            if len(related_products.data) > 3:
                return Response(
                    {'related_products': related_products.data[:3]},
                    status=status.HTTP_200_OK)
            elif len(related_products.data) > 0:
                return Response(
                    {'related_products': related_products.data},
                    status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'No related products found'},
                    status=status.HTTP_200_OK)
            
        else:
            return Response(
                {'error': 'No related products found'},
                status=status.HTTP_200_OK)
            
# Lista donde enlistar los productos que buscamos:
class ListBySearchView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        """A

        Args:
            request (_type_): _description_
            format (_type_, optional): _description_. Defaults to None.

        Returns:
            _type_: _description_
        """
        data = self.request.data

        try:
            category_id = int(data['category_id'])
        except:
            return Response(
                {'error': 'Category ID must be an integer'},
                status=status.HTTP_404_NOT_FOUND)
        # Lo primero que queremos ver es el price range.
        price_range = data['price_range']
        sort_by = data['sort_by']

        if not (sort_by == 'date_created' or sort_by == 'price' or sort_by == 'sold' or sort_by == 'name'):
            # Si no hemos definido el sort by lo dejamos por date_created:
            sort_by = 'date_created'

        order = data['order']

        # Si categoryID es = 0, filtrar todas las categorias
        if category_id == 0:
            
            product_results = Product.objects.all()
            
        elif not Category.objects.filter(id=category_id).exists():
            
            return Response(
                {'error': 'This category does not exist'},
                status=status.HTTP_404_NOT_FOUND)
        else:
            
            category = Category.objects.get(id=category_id)
            
            if category.parent:
                # Si la categoria tiene padre filtrar solo por la categoria y no el padre tambien
                product_results = Product.objects.filter(category=category)
            else:
                if not Category.objects.filter(parent=category).exists():
                    product_results = Product.objects.filter(category=category)
                else:
                    categories = Category.objects.filter(parent=category)
                    filtered_categories = [category]

                    for cat in categories:
                        filtered_categories.append(cat)

                    filtered_categories = tuple(filtered_categories)
                    product_results = Product.objects.filter(
                        category__in=filtered_categories)

        # Filtrar por precio
        if price_range == '1 - 19':
            product_results = product_results.filter(price__gte=1)
            product_results = product_results.filter(price__lt=20)
        elif price_range == '20 - 39':
            product_results = product_results.filter(price__gte=20)
            product_results = product_results.filter(price__lt=40)
        elif price_range == '40 - 59':
            product_results = product_results.filter(price__gte=40)
            product_results = product_results.filter(price__lt=60)
        elif price_range == '60 - 79':
            product_results = product_results.filter(price__gte=60)
            product_results = product_results.filter(price__lt=80)
        elif price_range == 'More than 80':
            product_results = product_results.filter(price__gte=80)
        
        #Filtrar producto por sort_by
        if order == 'desc':
            sort_by = '-' + sort_by
            product_results = product_results.order_by(sort_by)
        elif order == 'asc':
            product_results = product_results.order_by(sort_by)
        else:
            product_results = product_results.order_by(sort_by)
        
        product_results = ProductSerializer(product_results, many=True)

        if len(product_results.data) > 0:
            return Response(
                {'filtered_products': product_results.data},
                status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'No products found'},
                status=status.HTTP_200_OK)