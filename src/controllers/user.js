import User from '../models/User.js';

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾지 못했습니다.',
        },
      });
    }

    user.nickname = req.body.nickname;
    user.description = req.body.description;
    user.profile_color = req.body.profile_color;
    user.is_profile = req.body.is_profile;
    user.save();

    return res.status(200).json({
      success: true,
      data: {
        nickname: user.nickname,
        description: user.description,
        profile_color: user.profile_color,
        is_profile: user.is_profile,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
