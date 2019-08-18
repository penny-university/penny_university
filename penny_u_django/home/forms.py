from django import forms


class InviteForm(forms.Form):
    email = forms.CharField(label="Email", widget=forms.EmailInput(attrs={"class": "form-control"}))
    how_did_you_find_us = forms.CharField(label="How'd You Find Us?",
                                          widget=forms.TextInput(attrs={"class": "form-control"}))
