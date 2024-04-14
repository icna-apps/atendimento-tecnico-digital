from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.modulo_produtor.urls')),
    path('', include('apps.modulo_admin.urls')),
    path('', include('apps.modulo_tecnico.urls')),
    
]
