from django.urls import path

from .views import ProductDetailView, ListProductsView, ListSearchView, ListRelatedView, ListBySearchView

app_name="product"
urlpatterns = [
    # Este <product_id> hace referencia al product_id de ProductDetailView
    # .as_view lo usamos para las classes:
    path('product/<productId>', ProductDetailView.as_view()),
    path('get-products', ListProductsView.as_view()),
    path('search', ListSearchView.as_view()),
    path('related/<productId>', ListRelatedView.as_view()),
    path('by/search', ListBySearchView.as_view()),
]