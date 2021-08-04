const { sequelize } = require('../db/models');

const { User } = sequelize.models;

const createUser = async (userInfo) => {
  try {
    const user = await User.findOrCreate({
      where: {
        nickname: userInfo.nickname,
      },
    });
    return { user };
  } catch (err) {
    console.error(err);
    return { err: err.message };
  }
};

module.exports = {
  createUser,
};
