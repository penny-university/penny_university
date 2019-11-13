from django import forms


class FollowUpForm(forms.Form):
    follow_up = forms.CharField(
        widget=forms.Textarea(attrs={"class": "form-control"}),
        help_text="Add your feedback to the Penny Chat."
    )
