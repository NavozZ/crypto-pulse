import User from "../models/User";

export const appendUserActivity = async (
  userId: string,
  action: string,
  meta: Record<string, unknown> = {}
) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        activityHistory: {
          action,
          meta,
          createdAt: new Date(),
        },
      },
    },
    { new: false }
  );
};

