import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random

class EmailHandler:
    SENDER_EMAIL = "mahsahajirahimi2003@gmail.com"  
    APP_PASSWORD = "ouai tpaw tvdf frms"   
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 465

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    async def send_verification_email(email: str, otp: str):
        message = MIMEMultipart()
        message["From"] = EmailHandler.SENDER_EMAIL
        message["To"] = email
        message["Subject"] = "Lost & Found - Your Verification Code"

        body = f"""
        <html>
            <body dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height: 1.6; color: #333; text-align: right;">
                <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #2c3e50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">به شریف‌جو خوش آمدید</h2>
                    <p> کاربر گرامی شریف‌جو،</p>
                    <p>جهت تکمیل فرآیند ثبت‌نام، لطفا از کد تأیید زیر استفاده کنید:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background-color: #fff; padding: 10px 30px; border: 1px dashed #4CAF50; color: #4CAF50;">
                            {otp}
                        </span>
                    </div>
                    <p style="color: #e74c3c;">این کد به مدت <b>۵ دقیقه</b> اعتبار دارد.</p>
                    <p>اگر شما این درخواست را نداده‌اید، می‌توانید این ایمیل را نادیده بگیرید.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
                    <p style="font-size: 11px; color: #777; text-align: center;">سیستم مدیریت اشیاء گم‌شده و پیدا شده دانشگاه</p>
                </div>
            </body>
        </html>
        """
        message.attach(MIMEText(body, "html"))

        try:
            with smtplib.SMTP_SSL(EmailHandler.SMTP_SERVER, EmailHandler.SMTP_PORT) as server:
                server.login(EmailHandler.SENDER_EMAIL, EmailHandler.APP_PASSWORD)
                server.sendmail(EmailHandler.SENDER_EMAIL, email, message.as_string())
            print(f"✅ Real Email sent successfully to {email}")
            return True
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return False