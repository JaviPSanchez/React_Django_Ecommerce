from django.urls import path
# Para poder trabajar con las urls, necesitamos crear las views que deseemos
from .views import ListCategoriesView

urlpatterns = [
    path('categories', ListCategoriesView.as_view()),
]