from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from ..config import settings
from ..models import EmailLog
from sqlalchemy.orm import Session
from datetime import datetime


class EmailService:
    def __init__(self):
        if settings.sendgrid_api_key:
            self.client = SendGridAPIClient(settings.sendgrid_api_key)
        else:
            self.client = None

    def send_license_email(
        self, db: Session, recipient: str, name: str, license_key: str
    ) -> bool:
        """Send license key email"""

        subject = "Your GiggliAgents License Key 🎉"

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(to right, #9333ea, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; }}
                .license-box {{ background: white; border: 2px solid #9333ea; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }}
                .license-key {{ font-family: monospace; font-size: 24px; color: #9333ea; font-weight: bold; letter-spacing: 2px; }}
                .button {{ display: inline-block; background: linear-gradient(to right, #9333ea, #3b82f6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to GiggliAgents!</h1>
                </div>
                <div class="content">
                    <h2>Hi {name}!</h2>
                    <p>Thank you for purchasing GiggliAgents Email Assistant Pro! You're now part of an exclusive group of users who are saving hours every day on email.</p>
                    
                    <div class="license-box">
                        <p style="margin: 0 0 10px 0; color: #666;">Your License Key:</p>
                        <div class="license-key">{license_key}</div>
                    </div>
                    
                    <p><strong>⚠️ Keep this key safe!</strong> You'll need it to activate the desktop app.</p>
                    
                    <h3>Quick Start Guide:</h3>
                    <ol>
                        <li><strong>Download the app</strong> for your platform (Windows, Mac, or Linux)</li>
                        <li><strong>Install and launch</strong> the application</li>
                        <li><strong>Enter your license key</strong> when prompted</li>
                        <li><strong>Connect your email</strong> (Gmail, Outlook, or IMAP)</li>
                        <li><strong>Start saving time!</strong> Let AI handle your email replies</li>
                    </ol>
                    
                    <div style="text-align: center;">
                        <a href="{settings.frontend_url}/download/{license_key}" class="button">
                            Download GiggliAgents →
                        </a>
                    </div>
                    
                    <h3>Need Help?</h3>
                    <p>
                        📚 <a href="https://docs.giggliagents.com">Documentation</a><br>
                        💬 <a href="https://discord.gg/giggliagents">Join Discord Community</a><br>
                        ✉️ <a href="mailto:support@giggliagents.com">Email Support</a>
                    </p>
                </div>
                <div class="footer">
                    <p>© 2025 GiggliAgents. All rights reserved.</p>
                    <p>You received this email because you purchased a GiggliAgents license.</p>
                </div>
            </div>
        </body>
        </html>
        """

        return self._send_email(db, recipient, subject, html_content, "license_key")

    def _send_email(
        self,
        db: Session,
        recipient: str,
        subject: str,
        html_content: str,
        template: str,
    ) -> bool:
        """Internal method to send email"""

        # Log email attempt
        email_log = EmailLog(
            recipient=recipient, subject=subject, template=template, status="pending"
        )
        db.add(email_log)
        db.commit()

        # If no SendGrid configured, just log and return
        if not self.client:
            print(f"📧 [DEV MODE] Would send email to: {recipient}")
            print(f"   Subject: {subject}")
            email_log.status = "sent"
            email_log.error_message = "Dev mode - email not actually sent"
            db.commit()
            return True

        try:
            message = Mail(
                from_email=Email(
                    settings.sendgrid_from_email, settings.sendgrid_from_name
                ),
                to_emails=To(recipient),
                subject=subject,
                html_content=Content("text/html", html_content),
            )

            response = self.client.send(message)

            email_log.status = "sent"
            db.commit()

            print(f"✅ Email sent to {recipient}: {subject}")
            return True

        except Exception as e:
            email_log.status = "failed"
            email_log.error_message = str(e)
            db.commit()

            print(f"❌ Failed to send email to {recipient}: {e}")
            return False


email_service = EmailService()
