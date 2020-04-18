from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _


class UserRegistrationForm(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ("username", "email", "password", "first_name", 'last_name')

    def clean_email(self):
        email = self.cleaned_data.get("email") or ""
        if email:
            email = email.strip().lower()
        accounts = self.Meta.model.objects.filter(email=email)
        if accounts.exists():
            raise forms.ValidationError(_("Email address has already been used."))
        return email

    def save(self, commit=True, *args, **kwargs):
        user = super(UserRegistrationForm, self).save(commit=commit, *args, **kwargs)
        password = self.cleaned_data.get("password")
        user.set_password(password)
        if commit:
            user.save()
        return user
