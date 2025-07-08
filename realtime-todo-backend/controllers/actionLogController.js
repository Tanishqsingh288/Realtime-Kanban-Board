exports.getRecentActions = async (req, res) => {
  console.log('📌 [getRecentActions] Request received');

  try {
    const actions = await ActionLog.find()
      .populate('user', 'username email')
      .populate('task', 'title')
      .sort({ timestamp: -1 })
      .limit(20);

    console.log(`✅ [getRecentActions] Retrieved ${actions.length} actions`);
    res.status(200).json({ actions });
  } catch (err) {
    console.error('❌ [getRecentActions] Error:', err.message);
    res.status(500).json({ message: 'Server error fetching actions' });
  }
};
