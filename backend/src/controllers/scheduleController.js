const Schedule = require('../models/Schedule');

const scheduleController = {
  createSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.create(req.body);
      res.status(201).json({ success: true, data: schedule });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getStaffSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.find({ staff: req.params.staffId });
      if (!schedule) {
        return res.status(404).json({ success: false, error: 'Schedule not found' });
      }
      res.status(200).json({ success: true, data: schedule });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!schedule) {
        return res.status(404).json({ success: false, error: 'Schedule not found' });
      }
      res.status(200).json({ success: true, data: schedule });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  deleteSchedule: async (req, res) => {
    try {
      const schedule = await Schedule.findByIdAndDelete(req.params.id);
      if (!schedule) {
        return res.status(404).json({ success: false, error: 'Schedule not found' });
      }
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

module.exports = scheduleController;