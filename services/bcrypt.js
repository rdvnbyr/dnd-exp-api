const bcrypt = require('bcryptjs');

class BcryptService {
  constructor() {
    this.salt = 10;
  }

  async generateSalt() {
    return bcrypt.genSalt(this.salt);
  }

  async hash(password) {
    const salt = await this.generateSalt(this.salt);
    return bcrypt.hash(password, salt);
  }

  async compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = new BcryptService();
