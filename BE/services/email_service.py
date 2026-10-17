import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USER).strip()
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "HerbaPedia Support").strip()


def send_password_reset_otp(
    to_email: str,
    otp_code: str,
    display_name: str | None = None,
) -> tuple[bool, str]:
    """
    Gửi email chứa mã OTP khôi phục mật khẩu qua SMTP (ví dụ Gmail SMTP).
    Trả về: (success: bool, message: str)
    Nếu chưa cấu hình SMTP trong file .env, hàm sẽ log lại mã và trả về False
    để hệ thống hỗ trợ hiển thị mã trực tiếp cho môi trường kiểm thử/dev.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.info(
            "[DEV MODE] SMTP chưa được cấu hình. Mã OTP khôi phục mật khẩu cho %s là: %s",
            to_email,
            otp_code,
        )
        return False, "SMTP chưa được cấu hình trên máy chủ."

    greeting = display_name.strip() if display_name and display_name.strip() else to_email.split("@")[0]
    subject = f"[HerbaPedia] Mã xác thực khôi phục mật khẩu: {otp_code}"
    from_header = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL or SMTP_USER}>"

    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khôi phục mật khẩu - HerbaPedia</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f4f6f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748;">
    <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="background-color: #1b3b22; padding: 28px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                Herba<span style="color: #eab308;">Pedia</span>
            </h1>
            <p style="margin: 6px 0 0; color: #a7f3d0; font-size: 13px;">Hệ thống nhận diện & tra cứu dược liệu Việt Nam</p>
        </div>
        <div style="padding: 32px 28px; line-height: 1.6; font-size: 15px;">
            <p style="margin-top: 0;">Xin chào <strong>{greeting}</strong>,</p>
            <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản HerbaPedia liên kết với email <strong>{to_email}</strong>.</p>
            <p>Vui lòng nhập mã xác thực (OTP) dưới đây trên trang đổi mật khẩu:</p>
            
            <div style="background-color: #f7faf4; border: 2px dashed #2e7d32; border-radius: 12px; text-align: center; padding: 22px 16px; margin: 24px 0;">
                <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1b3b22; font-family: monospace;">
                    {otp_code}
                </div>
                <div style="font-size: 13px; color: #6b7280; margin-top: 8px;">
                    Mã xác thực có hiệu lực trong <strong>15 phút</strong>
                </div>
            </div>

            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #991b1b; margin-top: 20px;">
                ⚠️ <strong>Bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.
            </div>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0;">&copy; 2026 HerbaPedia. Phát triển vì sức khỏe cộng đồng.</p>
        </div>
    </div>
</body>
</html>
"""

    text_content = (
        f"Xin chào {greeting},\n\n"
        f"Mã OTP xác thực khôi phục mật khẩu HerbaPedia của bạn là: {otp_code}\n"
        f"Mã có hiệu lực trong vòng 15 phút.\n\n"
        f"Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email."
    )

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = from_header
        msg["To"] = to_email
        msg.attach(MIMEText(text_content, "plain", "utf-8"))
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        logger.info("Đã gửi email OTP thành công tới %s", to_email)
        return True, "Mã xác thực đã được gửi đến email của bạn!"
    except Exception as exc:
        logger.error("Lỗi khi gửi email qua SMTP tới %s: %s", to_email, exc, exc_info=True)
        return False, f"Không thể gửi email: {str(exc)}"

