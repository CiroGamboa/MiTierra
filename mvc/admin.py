from django.contrib import admin
from django_google_maps import widgets as map_widgets
from django_google_maps import fields as map_fields
from django.forms.widgets import TextInput, Select
from mvc import models


class ActivoAdmin(admin.ModelAdmin):
    formfield_overrides = {
        map_fields.AddressField: {'widget': map_widgets.GoogleMapsAddressWidget},
        map_fields.GeoLocationField: {'widget': TextInput(attrs={'readonly': 'readonly'})},
        #models.Activo.tipoactivo:{'widget':Select(choices=[('arbol','Arbol'),('arbusto','Arbusto')])},
        #models.Activo.tipoactivo:{'widget':ChoiceField(choices=[('arbol','Arbol'),('arbusto','Arbusto')])},
    }


admin.site.register(models.Activo, ActivoAdmin)

# Cambiar aspecto del django admin
admin.site.site_header = "Administración de MiTierra"