from django.contrib import admin
from .models import OTPRecord


@admin.register(OTPRecord)
class OTPRecordAdmin(admin.ModelAdmin):
    list_display = ('identifier', 'identifier_type', 'attempts', 'is_used', 'expires_at', 'created_at')
    list_filter = ('identifier_type', 'is_used')
    search_fields = ('identifier',)
    readonly_fields = ('otp_hash', 'salt', 'created_at', 'last_sent_at')
