export const emailVerificationTemplate = (userName, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #8B4513, #D2691E); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { color: #f0f0f0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: 600; color: #8B4513; margin-bottom: 20px; }
        .message { font-size: 16px; margin-bottom: 30px; line-height: 1.8; }
        .otp-container { background: linear-gradient(135deg, #8B4513, #D2691E); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: white; letter-spacing: 8px; margin: 10px 0; font-family: 'Courier New', monospace; }
        .otp-label { color: #f0f0f0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .copy-btn { background-color: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px; margin-top: 15px; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px; }
        .footer { background-color: #8B4513; color: white; padding: 25px; text-align: center; font-size: 14px; }
        .social-links { margin-top: 20px; }
        .social-links a { color: white; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">☕ Sajilo Coffee Plus</div>
            <div class="header-subtitle">Premium Coffee Experience</div>
        </div>
        <div class="content">
            <div class="greeting">Welcome aboard, ${userName}! ☕</div>
            <div class="message">
                Thank you for joining Sajilo Coffee Plus! We're excited to have you as part of our coffee-loving community. 
                To complete your registration and start enjoying our premium services, please verify your email address using the OTP below:
            </div>
            <div class="otp-container">
                <div class="otp-label">Verification Code</div>
                <div class="otp-code" id="otpCode">${otp}</div>
                <button class="copy-btn" onclick="copyOTP()">📋 Copy Code</button>
            </div>
            <div class="warning">
                ⚠️ This verification code will expire in 24 hours. For your security, please don't share this code with anyone.
            </div>
            <div class="message">
                Once verified, you'll be able to:
                <ul style="margin-top: 10px; padding-left: 20px;">
                    <li>Order your favorite coffee blends</li>
                    <li>Access exclusive member discounts</li>
                    <li>Track your order history</li>
                    <li>Receive personalized recommendations</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <div>© 2024 Sajilo Coffee Plus. All rights reserved.</div>
            <div style="margin-top: 10px;">Need help? Contact us at support@sajilocoffee.shop</div>
            <div class="social-links">
                <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
            </div>
        </div>
    </div>
    <script>
        function copyOTP() {
            const otpText = document.getElementById('otpCode').innerText;
            navigator.clipboard.writeText(otpText);
        }
    </script>
</body>
</html>`;
};

export const welcomeEmailTemplate = (userName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Sajilo Coffee Plus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #8B4513, #D2691E); padding: 40px 30px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { color: #f0f0f0; font-size: 18px; }
        .content { padding: 40px 30px; }
        .celebration { text-align: center; font-size: 48px; margin-bottom: 20px; }
        .greeting { font-size: 24px; font-weight: 600; color: #8B4513; text-align: center; margin-bottom: 30px; }
        .message { font-size: 16px; margin-bottom: 25px; line-height: 1.8; text-align: center; }
        .features { background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin: 30px 0; }
        .feature-item { display: flex; align-items: center; margin-bottom: 15px; }
        .feature-icon { font-size: 24px; margin-right: 15px; }
        .cta-button { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 20px 0; font-weight: bold; font-size: 16px; }
        .footer { background-color: #8B4513; color: white; padding: 25px; text-align: center; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">☕ Sajilo Coffee Plus</div>
            <div class="header-subtitle">Where Every Sip Tells a Story</div>
        </div>
        <div class="content">
            <div class="celebration">🎉 ☕ 🎉</div>
            <div class="greeting">Welcome to the Family, ${userName}!</div>
            <div class="message">
                Your email has been successfully verified! We're thrilled to welcome you to Sajilo Coffee Plus, 
                where premium coffee meets exceptional service. Get ready to embark on an incredible coffee journey with us.
            </div>
            <div class="features">
                <div class="feature-item">
                    <div class="feature-icon">☕</div>
                    <div>Premium coffee blends from around the world</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🚚</div>
                    <div>Fast and reliable delivery service</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💎</div>
                    <div>Exclusive member-only discounts and offers</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📱</div>
                    <div>Easy ordering through our mobile app</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⭐</div>
                    <div>Loyalty rewards program</div>
                </div>
            </div>
            <div style="text-align: center;">
                <a href="#" class="cta-button">Start Ordering Now ☕</a>
            </div>
        </div>
        <div class="footer">
            <div>© 2024 Sajilo Coffee Plus. All rights reserved.</div>
            <div style="margin-top: 10px;">Questions? We're here to help at support@sajilocoffee.shop</div>
        </div>
    </div>
</body>
</html>`;
};

export const passwordResetTemplate = (userName, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #dc3545, #c82333); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { color: #f0f0f0; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: 600; color: #dc3545; margin-bottom: 20px; }
        .message { font-size: 16px; margin-bottom: 30px; line-height: 1.8; }
        .otp-container { background: linear-gradient(135deg, #dc3545, #c82333); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: white; letter-spacing: 8px; margin: 10px 0; font-family: 'Courier New', monospace; }
        .otp-label { color: #f0f0f0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .copy-btn { background-color: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px; margin-top: 15px; }
        .security-notice { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { background-color: #dc3545; color: white; padding: 25px; text-align: center; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐 Sajilo Coffee Plus</div>
            <div class="header-subtitle">Password Reset Request</div>
        </div>
        <div class="content">
            <div class="greeting">Hi ${userName},</div>
            <div class="message">
                We received a request to reset your password for your Sajilo Coffee Plus account. 
                Use the verification code below to create a new password:
            </div>
            <div class="otp-container">
                <div class="otp-label">Reset Code</div>
                <div class="otp-code" id="otpCode">${otp}</div>
                <button class="copy-btn" onclick="copyOTP()">📋 Copy Code</button>
            </div>
            <div class="security-notice">
                <strong>Security Notice:</strong>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    <li>This code expires in 24 hours</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share this code with anyone</li>
                    <li>Contact support if you need assistance</li>
                </ul>
            </div>
            <div class="message">
                For your account security, please choose a strong password that includes uppercase and lowercase letters, 
                numbers, and special characters.
            </div>
        </div>
        <div class="footer">
            <div>© 2024 Sajilo Coffee Plus Security Team</div>
            <div style="margin-top: 10px;">Need help? Contact us at security@sajilocoffee.shop</div>
        </div>
    </div>
    <script>
        function copyOTP() {
            const otpText = document.getElementById('otpCode').innerText;
            navigator.clipboard.writeText(otpText);
        }
    </script>
</body>
</html>`;
};

export const passwordChangeConfirmationTemplate = (userName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed Successfully</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #28a745, #20c997); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-subtitle { color: #f0f0f0; font-size: 16px; }
        .content { padding: 40px 30px; text-align: center; }
        .success-icon { font-size: 64px; color: #28a745; margin-bottom: 20px; }
        .greeting { font-size: 24px; font-weight: 600; color: #28a745; margin-bottom: 20px; }
        .message { font-size: 16px; margin-bottom: 30px; line-height: 1.8; }
        .security-tips { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left; }
        .footer { background-color: #28a745; color: white; padding: 25px; text-align: center; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">✅ Sajilo Coffee Plus</div>
            <div class="header-subtitle">Password Update Confirmation</div>
        </div>
        <div class="content">
            <div class="success-icon">🔒✅</div>
            <div class="greeting">Password Updated Successfully!</div>
            <div class="message">
                Hi ${userName}, your password has been successfully changed. Your account is now secured with your new password.
            </div>
            <div class="security-tips">
                <strong>Security Tips:</strong>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    <li>Keep your password confidential</li>
                    <li>Use a unique password for each account</li>
                    <li>Consider using a password manager</li>
                    <li>Enable two-factor authentication when available</li>
                </ul>
            </div>
            <div class="message">
                If you didn't make this change, please contact our security team immediately at security@sajilocoffee.shop
            </div>
        </div>
        <div class="footer">
            <div>© 2024 Sajilo Coffee Plus Security Team</div>
            <div style="margin-top: 10px;">Your account security is our priority</div>
        </div>
    </div>
</body>
</html>`;
};

export const loginNotificationTemplate = (userName, loginDetails) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Login to Your Account</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #007bff, #0056b3); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: 600; color: #007bff; margin-bottom: 20px; }
        .login-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 5px 0; border-bottom: 1px solid #e9ecef; }
        .footer { background-color: #007bff; color: white; padding: 25px; text-align: center; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐 Sajilo Coffee Plus</div>
        </div>
        <div class="content">
            <div class="greeting">Hi ${userName},</div>
            <div style="margin-bottom: 20px;">
                We detected a new login to your Sajilo Coffee Plus account. Here are the details:
            </div>
            <div class="login-details">
                <div class="detail-row">
                    <strong>Time:</strong>
                    <span>${loginDetails.time}</span>
                </div>
                <div class="detail-row">
                    <strong>Location:</strong>
                    <span>${loginDetails.location}</span>
                </div>
                <div class="detail-row">
                    <strong>Device:</strong>
                    <span>${loginDetails.device}</span>
                </div>
            </div>
            <div style="margin-top: 20px;">
                If this wasn't you, please contact our security team immediately at security@sajilocoffee.shop
            </div>
        </div>
        <div class="footer">
            <div>© 2024 Sajilo Coffee Plus Security</div>
        </div>
    </div>
</body>
</html>`;
};

export const orderConfirmationTemplate = (userName, order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productId?.name || 'Product'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.size}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">NPR ${item.unitPrice}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">NPR ${(item.unitPrice * item.qty).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #8B4513, #D2691E); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 30px; }
        .order-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .order-table th { background-color: #8B4513; color: white; padding: 12px; text-align: left; }
        .total-section { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .footer { background-color: #8B4513; color: white; padding: 25px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">☕ Sajilo Coffee Plus</div>
            <div style="color: #f0f0f0;">Order Confirmation</div>
        </div>
        <div class="content">
            <h2 style="color: #8B4513; margin-bottom: 20px;">Thank you for your order, ${userName}!</h2>
            
            <div class="order-info">
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Table Number:</strong> ${order.table}</p>
                <p><strong>Order Date:</strong> ${new Date(order.placedAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            </div>

            <table class="order-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="total-section">
                <p style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Subtotal:</span>
                    <span>NPR ${order.subtotal.toFixed(2)}</span>
                </p>
                ${order.discount > 0 ? `<p style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #28a745;">
                    <span>Discount:</span>
                    <span>-NPR ${order.discount.toFixed(2)}</span>
                </p>` : ''}
                <hr style="margin: 10px 0;">
                <p style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
                    <span>Total:</span>
                    <span>NPR ${order.total.toFixed(2)}</span>
                </p>
            </div>

            <p style="margin-top: 20px; color: #666;">
                Your order is being prepared and will be served at Table ${order.table}. 
                You'll receive updates as your order progresses through our kitchen.
            </p>
        </div>
        <div class="footer">
            <div>© 2024 Sajilo Coffee Plus</div>
            <div style="margin-top: 10px;">Thank you for choosing us!</div>
        </div>
    </div>
</body>
</html>`;
};

export const orderStatusUpdateTemplate = (userName, order, status) => {
  const statusMessages = {
    preparing: 'Your order is now being prepared by our skilled baristas!',
    served: 'Your order has been served! Enjoy your coffee experience.',
    cancelled: 'Your order has been cancelled as requested.'
  };

  const statusColors = {
    preparing: '#ffc107',
    served: '#28a745',
    cancelled: '#dc3545'
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Update</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, ${statusColors[status]}, ${statusColors[status]}dd); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 30px; text-align: center; }
        .status-badge { display: inline-block; background: ${statusColors[status]}; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; margin: 20px 0; }
        .order-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; }
        .footer { background-color: ${statusColors[status]}; color: white; padding: 25px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">☕ Sajilo Coffee Plus</div>
            <div style="color: #f0f0f0;">Order Update</div>
        </div>
        <div class="content">
            <h2 style="color: ${statusColors[status]}; margin-bottom: 20px;">Hi ${userName}!</h2>
            
            <div class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
            
            <p style="font-size: 18px; margin: 20px 0;">${statusMessages[status]}</p>
            
            <div class="order-info">
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Table Number:</strong> ${order.table}</p>
                <p><strong>Total Amount:</strong> NPR ${order.total.toFixed(2)}</p>
                <p><strong>Updated At:</strong> ${new Date().toLocaleString()}</p>
            </div>
        </div>
        <div class="footer">
            <div>© 2024 Sajilo Coffee Plus</div>
            <div style="margin-top: 10px;">Thank you for your patience!</div>
        </div>
    </div>
</body>
</html>`;
};
