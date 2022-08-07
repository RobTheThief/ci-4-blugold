from django.db import models

class Station(models.Model):
    station = models.CharField("Name", max_length=240)
    petrol = models.CharField("Petrol", max_length=240)
    diesel = models.CharField("Diesel", max_length=240)
    updated = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

