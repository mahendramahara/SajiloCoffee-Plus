import jwt from 'jsonwebtoken';

export function generateUserAccessToken(user) {
  return jwt.sign(
    { id: user.id || user._id, role: "user" },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
}

export function generateAdminAccessToken(admin) {
  return jwt.sign(
    { id: admin.id || admin._id, role: "admin" },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' }
  );
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getTokenExpiry(token) {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000);
      const now = new Date();
      const timeLeft = expiryDate - now;
      
      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return { days, hours, expiryDate };
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}
