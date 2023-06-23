import schedule from 'node-schedule';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const job = schedule.scheduleJob('0 0 * * *', async () => {
  const users = await User.findAll({
    raw: true,
    attributes: ['id', 'confirmation_code'],
    where: { is_valid: false },
  });

  users.forEach((element) => {
    jwt.verify(element.confirmation_code, process.env.JWT_SECRET, (error) => {
      if (error) {
        User.destroy({ where: { id: element.id } });
      }
    });
  });
});
