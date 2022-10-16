from django.db import models

class Category(models.Model):
    # Esta class tiene dos tipos de nomenclaturas:
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
    # La categoria va a tener subcategorias, luego cada categoria puede ser asignada a otras categorias:
    # on_delete=models.CASCADE --> This is the behaviour to adopt when the referenced object is deleted, in this case itself.
                # CASCADE: When the referenced object is deleted, also delete the objects that have references to it (when you remove a blog post for instance, you might want to delete comments as well). SQL equivalent: CASCADE.
    # blank=True --> Se puede dar el caso de que no tengamos parent 
    # null=True --> permitimos valores nulos
    parent = models.ForeignKey('self', related_name='children', on_delete=models.CASCADE, blank=True, null=True)
    name = models.CharField(max_length=255, unique=True)
    # Para que se vea bien en el terminal, el string que le pasamos será el name
    def __str__(self):
        return self.name
    
# No hace falta serializar este model.
