from django.db import models
from django.utils import timezone


class OTPRecord(models.Model):
    """
    Model representing generated OTP records for verification.
    Stores a secure hash with salt instead of plain text OTPs.
    """
    IDENTIFIER_CHOICES = (
        ('email', 'Email'),
        ('phone', 'Phone'),
    )

    identifier = models.CharField(max_length=255, db_index=True)
    identifier_type = models.CharField(max_length=10, choices=IDENTIFIER_CHOICES)
    otp_hash = models.CharField(max_length=128)
    salt = models.CharField(max_length=64)
    attempts = models.PositiveIntegerField(default=0)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    last_sent_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'OTP Record'
        verbose_name_plural = 'OTP Records'
        indexes = [
            models.Index(fields=['identifier', 'is_used', 'expires_at']),
        ]
        ordering = ['-created_at']

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.identifier} ({self.identifier_type}) - Used: {self.is_used}"
