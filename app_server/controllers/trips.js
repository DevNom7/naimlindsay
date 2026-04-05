const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

const sendJSON = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({});
    sendJSON(res, 200, trips);
  } catch (e) {
    sendJSON(res, 500, { message: e.message });
  }
};

module.exports.tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.code });
    if (!trip) return sendJSON(res, 404, { message: 'Trip not found' });
    sendJSON(res, 200, trip);
  } catch (e) {
    sendJSON(res, 500, { message: e.message });
  }
};

module.exports.tripsAddTrip = async (req, res) => {
  try {
    const created = await Trip.create(req.body);
    sendJSON(res, 201, created);
  } catch (e) {
    sendJSON(res, 400, { message: e.message });
  }
};

module.exports.tripsUpdateTrip = async (req, res) => {
  try {
    const updated = await Trip.findOneAndUpdate(
      { code: req.params.code },
      req.body,
      { new: true }
    );
    if (!updated) return sendJSON(res, 404, { message: 'Trip not found' });
    sendJSON(res, 200, updated);
  } catch (e) {
    sendJSON(res, 400, { message: e.message });
  }
};

module.exports.tripsDeleteTrip = async (req, res) => {
  try {
    const deleted = await Trip.findOneAndDelete({ code: req.params.code });
    if (!deleted) return sendJSON(res, 404, { message: 'Trip not found' });
    sendJSON(res, 200, { message: 'Deleted' });
  } catch (e) {
    sendJSON(res, 500, { message: e.message });
  }
};
