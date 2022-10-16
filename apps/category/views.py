# 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# DEFAULT_PERMISSION_CLASSES coming from core/settings
from rest_framework import permissions

from .models import Category

# Solo queremos una vista que se encargue de enlistar las categorias:
class ListCategoriesView(APIView):
    # Nos permite definir los permisos de las classes permitiendonos acceder a la API
    permission_classes = (permissions.AllowAny, )
    
    def get(self, request, format=None):
        """Get all the objects from Category si existen:

        Args:
            request --> 
            format=None --> 

        Returns:
        if True:
            Response en formato dict:
            {
                "categories": [
                    {
                        "id": 1,
                        "name": "Programacion",
                        "sub_categories": [
                            {
                                "id": 2,
                                "name": "Blockchain",
                                "sub_categories": []
                            },
                            {
                                "id": 3,
                                "name": "Desarrollo Web",
                                "sub_categories": []
                            }
                        ]
                    }
                ]
            }           
        else:
            Error
        """
       
        if Category.objects.all().exists():
            
            categories = Category.objects.all()

            result = []

            for category in categories:
                # Si no es una propiedad parent cogemos sus propiedades:
                if not category.parent:
                    # Creamos un dict vacio donde definimos un id, name y sub_categories:
                    item = {}
                    item['id'] = category.id
                    item['name'] = category.name
                    # meteremos tambien una lista de subcategorias:
                    item['sub_categories'] = []
                    for cat in categories:
                        sub_item = {}
                        # Cogemos todos los items que si tienen un parent
                        if cat.parent and cat.parent.id == category.id:
                            sub_item['id'] = cat.id
                            sub_item['name'] = cat.name
                            # Podemos seguir creando subcategorias si lo deseamos...
                            sub_item['sub_categories'] = []
                            # Agregamos sub_categories al item
                            item['sub_categories'].append(sub_item)
                    result.append(item)
            # Queremos devolver toda esta informacion:
            return Response({'categories': result}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No categories found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)