from django.db import models
from django_google_maps.fields import AddressField, GeoLocationField
from django.utils import timezone


class Activo(models.Model):
	address = AddressField(max_length=100,verbose_name="Dirección")
	geolocation = GeoLocationField(blank=True, verbose_name="Coordenadas")
	tipoactivo = models.ForeignKey('Tipoactivo',models.DO_NOTHING,verbose_name="Tipo de activo")
	createddate = models.DateTimeField(default=timezone.now,verbose_name="Fecha de creación")

	class Meta:
		managed = True

	def __str__(self):
		return self.address


class Tipoactivo(models.Model):
	nombre = models.CharField(max_length=50)

	class Meta:
		managed = True

	def __str__(self):
		return self.nombre
