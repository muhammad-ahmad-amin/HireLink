const User = require('../models/User');

// Middleware to check if user is a client
const isClientOnly = async (req, res, next) => {
  try {
    const { clientEmail } = req.body;

    if (!clientEmail) {
      return res.status(400).json({ error: 'Client email is required' });
    }

    const user = await User.findOne({ email: clientEmail.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userType !== 'client') {
      return res.status(403).json({ 
        error: 'Only clients can post jobs. Freelancers cannot create job postings.' 
      });
    }

    // Attach user to request for use in controller
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { isClientOnly };
