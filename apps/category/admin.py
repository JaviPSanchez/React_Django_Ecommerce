from django.contrib import admin
# Importamos los modelos.
from .models import Category

# Declaramos un Admin:
class CategoryAdmin(admin.ModelAdmin):
    # En el admin de Django cada entrada lo mostrará asi:
    list_display = ('id','name', 'parent')
    list_display_links = ('id','name', 'parent')
    # Queremos una busqueda por categoria:
    search_fields = ('name', 'parent')
    # Cuantas categorias queremos por pagina:
    list_per_page = 25
# registramos, diciendo que el modelo Category corresponde a la CategoryAdmin que hemos creado:
admin.site.register(Category, CategoryAdmin)
