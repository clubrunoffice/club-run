const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const generateTokens = (user) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const token = jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      exp: Math.floor(expiresAt.getTime() / 1000)
    },
    process.env.JWT_SECRET
  );

  return { token, expiresAt };
};

const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

module.exports = {
  hashPassword,
  generateTokens,
  validatePassword
}; 