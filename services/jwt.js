const jwt = require('jsonwebtoken');

class JwtService {
  constructor() {
    this.defaultOptions = {};
  }

  async sign(payload, options) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      ...this.defaultOptions,
      ...(options || {}),
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  async verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  async decode(token) {
    return jwt.decode(token);
  }
}

module.exports = new JwtService();
