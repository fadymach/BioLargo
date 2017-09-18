from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    organization = models.CharField(max_length=100)
    plan = models.CharField(max_length=100)
    userObject = models.OneToOneField(User)
    
