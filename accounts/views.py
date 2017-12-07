from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib.auth import get_user, get_user_model
from .forms import profileForm, CompanyForm, UserForm
from django.views import View
from django.http import Http404
from .models import Invite, Plan
from django.db import transaction
from django.db import IntegrityError
# Create your views here.



def register_user(request, url):
    """
    View used to register a new :model:`accounts.User` within a :model:`accounts.Company` 
    with an :model:`accounts.Invite`
    """
    # if request.method == "GET":
    #     email = request.GET.get('email')

    #     if not (email):
    #         throw Http404("Invite not found!")

    #     try:
    #         invite = Invite.objects.get(hash=url)
    #     except DoesNotExist:
    #         throw Http404("Invite not found!")

        # verify hash and date.
        # render registration form. with email given & company

    # if request.method == "POST":
        # check the email and url info
        # if no errors:
        # register user to company.

    pass

def company_register(request):
    """
    View used to register a new :model:`accounts.Company` with a chosen :model:`accounts.Plan`.
    Registers a new :model:`accounts.User` with management permissions.
    """

    if request.method == "GET":
        plan = request.GET.get('p')

        company_form = CompanyForm(initial = {'plan': plan }, prefix = "company")
        user_form = UserForm(prefix = "user")

    if request.method == "POST":
        company_form = CompanyForm(request.POST, prefix="company")
        user_form = UserForm(request.POST, prefix="user")

        if company_form.is_valid() and user_form.is_valid():

            company = company_form.save()
            sid = transaction.savepoint() # create a savepoint in case saving one model fails for any reason.

            try:
                user = user_form.save(company)
                transaction.savepoint_commit(sid)

            except IntegrityError:
                transaction.savepoint_rollback(sid)
                return Http404("Error creating company. Please try again later.") #TODO: replace this with 500 error.

            auth_login(request, user)
            return redirect("/app") # for now. Redirect to a success page later.

    context = {
        "company_form" : company_form ,
        "user_form" : user_form
    }

    return render(request, 'registration/company_registration.html', context)


def userpage(request, usr_id):
    company = request.user.company
    view_user = get_user_model().objects.get(id=usr_id)

    if view_user.company != company:
        return Http404("User not found")

    return render(request, 'accounts/user.html',{'userdata':view_user, 'usr':get_user(request)})


def profile(request):
        if request.method == "POST":
            form = profileForm(data=request.POST, instance = request.user)
            if form.is_valid():
                    form.save()
                    return redirect("/accounts/profile/")
        else:
            form = profileForm(instance = request.user)

        context = {
            'userdata': request.user, 
            "form":form
        }

        return render(request, 'accounts/profile.html', context)



def userlist(request):
    company = request.user.company
    usrlist = get_user_model().objects.filter(company=company)

    return render(request, 'accounts/users.html', {'user_list':usrlist})

def messaging(request):
        usr = get_user(request)
        return render(request, 'accounts/messages.html', {'usr':usr})
