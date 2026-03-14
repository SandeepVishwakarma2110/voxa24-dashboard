const Log = require("../models/log");

exports.getAllLogs = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const logs = await Log.find()
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Log.countDocuments();

    res.json({
      success: true,
      page,
      total,
      data: logs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

exports.getLogById = async (req, res) => {
  try {

    const log = await Log.findById(req.params.id);

    res.json({
      success: true,
      data: log
    });

  } catch (error) {

    res.status(500).json({ success: false });

  }
};
exports.getStats = async (req, res) => {

  const totalLogs = await Log.countDocuments();

  const users = await Log.distinct("whatsappNumber");

  res.json({
    totalLogs,
    totalUsers: users.length
  });

};

exports.getRecentLogs = async (req, res) => {

  const logs = await Log.find()
    .sort({ startTime: -1 })
    .limit(5);

  res.json(logs);

};

exports.getLogsByRange = async (req, res) => {
  try {

    const days = parseInt(req.query.days) || 7;

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - days);

    const logs = await Log.find({
      startTime: { $gte: startDate }
    }).sort({ startTime: -1 });

    res.json({
      success: true,
      days,
      count: logs.length,
      data: logs
    });

  } catch (error) {

    console.error("Range API Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

exports.getAllLogsByUser = async (req, res) => {
  try {

    const logs = await Log.find({ whatsappNumber: req.params.whatsappNumber });

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};  

exports.getLogs = async (req, res) => {
  try {
    const { days, startDate, endDate } = req.query;
    let filter = {};

    if (days) {
      const fromDate = new Date();
      fromDate.setHours(0, 0, 0, 0);
      fromDate.setDate(fromDate.getDate() - parseInt(days));
      filter.startTime = { $gte: fromDate };
    } else if (startDate && endDate) {
      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T23:59:59");
      filter.startTime = {
        $gte: start,
        $lte: end
      };
    }

    const logs = await Log.find(filter).sort({ startTime: 1 });
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};