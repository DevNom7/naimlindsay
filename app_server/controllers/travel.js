const tripsEndpoint = 'http://localhost:3000/api/trips';

const travel = async (req, res) => {
  try {
    const response = await fetch(tripsEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const trips = await response.json();

    // some safety checks to meet reubirc  requirements
    if (!Array.isArray(trips)) {
      return res.status(500).render('error', { message: 'Invalid trips data' });
    }
    if (trips.length === 0) {
      return res.status(404).render('error', { message: 'No trips found' });
    }

    res.render('travel', {
      title: 'Travlr Getaways',
      trips
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  travel
};
