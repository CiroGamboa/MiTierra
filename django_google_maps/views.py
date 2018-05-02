from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from mvc import models
#from . import models


class JSONResponse(HttpResponse):

	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)

###############################################################

###############################################################

def get_activos(request):
	if request.method == 'GET':
		query = models.Activo.objects.all() #Traer todos los activos
		activos = []

		for activo in query:
			activos.append({"id":activo.id,
				"lat":activo.geolocation.lat,
				"lon":activo.geolocation.lon,
				"tipo":str(activo.tipoactivo)})

		return JSONResponse(activos)


def get_last_actives(request):

	cantidadActivos = 10
	activos = []

	activosQuery = models.Activo.objects.all().order_by('-id')
	for activo in activosQuery:
		activos.append({
				"tipo": activo.tipoactivo.nombre,
				"ubicacion": activo.address,
				"id": activo.id
			})

	return JSONResponse(activos)

def filter_actives(request, pkTipo):
	activos = []
	tipoActivo = models.Tipoactivo.objects.get(id=pkTipo)
	activosQuery = models.Activo.objects.filter(tipoactivo = tipoActivo)
	for activo in activosQuery:
		activos.append({
				"tipo": activo.tipoactivo.nombre,
				"ubicacion": activo.address,
				"id": activo.id
			})

	return JSONResponse(activos)


