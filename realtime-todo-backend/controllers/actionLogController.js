const ActionLog = require('../models/ActionLog');

exports.getRecentActions = async (req, res) => {
  try {
    const actions = await ActionLog.find()
      .populate('user', 'username email')
      .populate('task', 'title')
      .sort({ timestamp: -1 })
      .limit(20);

    res.status(200).json({ actions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error fetching actions' });
  }
};
