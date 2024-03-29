""" Contains the station model that maps to the database station"""

from django.db import models


class Station(models.Model):
    """ Extends from the Django Model class. CharField and DateField
    data types are used for the fields for the stations object in the
    database"""
    station = models.CharField("Station", max_length=240)
    petrol = models.CharField("Petrol", max_length=240)
    diesel = models.CharField("Diesel", max_length=240)
    google_id = models.CharField("google_id", max_length=240)
    updated_by = models.CharField("updated_by", max_length=240)
    updated = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name
