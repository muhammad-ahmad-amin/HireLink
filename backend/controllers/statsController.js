const Job = require('../models/Job');
const User = require('../models/User');

const getPlatformStats = async (req, res) => {
  try {
    // AGGREGATION PIPELINE: Platform-wide insights using $facet for parallel processing
    const stats = await Job.aggregate([
      {
        $facet: {
          categoryDistribution: [
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          financialSummary: [
            {
              $group: {
                _id: null,
                totalBudget: { $sum: "$budget" },
                averageBudget: { $avg: "$budget" },
                maxBudget: { $max: "$budget" },
                minBudget: { $min: "$budget" }
              }
            }
          ],
          statusDistribution: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          recentJobVolume: [
            {
              $match: {
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    // AGGREGATION PIPELINE: User distribution and top performers
    const userStats = await User.aggregate([
      {
        $facet: {
          userTypeCount: [
            { $group: { _id: "$userType", count: { $sum: 1 } } }
          ],
          topFreelancers: [
            { $match: { userType: 'freelancer', "profile.reviewCount": { $gt: 0 } } },
            { $sort: { "profile.averageRating": -1, "profile.reviewCount": -1 } },
            { $limit: 3 },
            {
              $project: {
                fullName: 1,
                email: 1,
                rating: "$profile.averageRating",
                reviewCount: "$profile.reviewCount",
                skills: "$profile.skills"
              }
            }
          ]
        }
      }
    ]);

    res.json({
      jobs: stats[0],
      users: userStats[0],
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPlatformStats
};
