from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
	path('getActivos/',views.get_activos),
	path('getLastActivos/<caso>/',views.get_last_actives)
	#path('filterActivos/<int:pkTipo>/',views.filter_actives)

]