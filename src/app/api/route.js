const getUserProfile = async (req, res) => {
    const userId = req.user.id; // Assuming user ID is retrieved from JWT
  
    try {
      const userProfile = await db.query(`
        SELECT Users.email, UserProfile.first_name, UserProfile.last_name, UserProfile.phone_number, 
               UserProfile.date_of_birth, UserProfile.start_date, UserProfile.rate, UserProfile.total_income
        FROM Users
        INNER JOIN UserProfile ON Users.id = UserProfile.user_id
        WHERE Users.id = ?
      `, [userId]);
  
      if (userProfile.length > 0) {
        res.json(userProfile[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user profile' });
    }
  };
  