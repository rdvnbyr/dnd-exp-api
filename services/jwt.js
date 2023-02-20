const jwt = require('jsonwebtoken');

class JwtService {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.defaultOptions = {
      expiresIn: '12h',
    };
  }

  async sign(payload, options) {
    return jwt.sign(payload, this.secret, { ...this.defaultOptions, ...options });
  }

  async verify(token) {
    return jwt.verify(token, this.secret);
  }

  async decode(token) {
    return jwt.decode(token);
  }
}

module.exports = new JwtService();
