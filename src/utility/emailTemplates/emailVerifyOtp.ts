export default function emailVerifyOtp(otp: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Voostro – Email Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#fdf2f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px; background:#ffffff; border-radius:12px; border:1px solid #f9a8d4; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:24px; text-align:center;">
              <h1 style="margin:0; font-size:28px; color:#f472b6;">Voostro</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:0 32px 24px; text-align:center;">
              <h2 style="margin:0 0 12px; color:#1f2937;">Email Verification Code</h2>
              <p style="margin:0 0 24px; color:#6b7280; font-size:14px;">
                Use the following One Time Password (OTP) to verify your email address.
              </p>

              <!-- OTP -->
              <div
                style="font-size:36px; font-weight:bold; letter-spacing:6px; color:#1f2937; margin-bottom:24px;">
                ${otp}
              </div>

              <!-- Warning -->
              <div
                style="background:#f472b6; color:#ffffff; padding:16px; border-radius:8px; font-size:13px;">
                Please do not share this code with anyone.  
                This code will expire in <strong>10 minutes</strong>.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px; text-align:center; border-top:1px solid #fce7f3;">
              <p style="margin:0; font-size:12px; color:#6b7280;">
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Bottom -->
          <tr>
            <td style="background:#f472b6; padding:12px; text-align:center;">
              <p style="margin:0; font-size:11px; color:#ffffff;">
                This is an automated message from Voostro. Please do not reply.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
}
