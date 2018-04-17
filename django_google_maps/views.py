from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from mvc import models


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

