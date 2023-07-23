import Plan from '../models/Plan.js';
import PlanDateRange from '../models/PlanDateRange.js';
import PlanMember from '../models/PlanMember.js';
import User from '../models/User.js';

export const createPlan = async (req, res, next) => {
  const {
    plan_title,
    plan_description,
    connection_type,
    start_time,
    end_time,
    location,
    date_range,
  } = req.body;
  try {
    const plan = await Plan.create({
      user_id: req.user.id,
      plan_title,
      plan_description,
      connection_type,
      start_time,
      end_time,
    });
    if (connection_type === 'online') {
      plan.online_link = location;
    } else {
      plan.offline_location = location;
    }
    plan.save();

    await PlanMember.create({ user_id: req.user.id, plan_id: plan.plan_id });

    await Promise.all(
      date_range.map((date) => PlanDateRange.create({ date, plan_id: plan.plan_id }))
    );

    const fullPlan = await Plan.findOne({
      where: { plan_id: plan.plan_id },
      include: [
        {
          model: PlanMember,
          include: [
            { model: User, attributes: ['id', 'nickname', 'profile_color', 'description'] },
          ],
        },
        {
          model: PlanDateRange,
          attributes: ['plan_date_id', 'date'],
        },
      ],
    });

    res.status(201).json({ success: true, data: fullPlan, error: null });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
