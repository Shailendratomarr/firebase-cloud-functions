const admin = require('../firebaseInit');
const auth = admin.auth();

exports.postSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRecord = await auth.createUser({
      email: email,
      password: password
    });

    // User registration successful
    return res.status(200).send({ status: 'Success', uid: userRecord.uid });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ status: 'Failed to register user',error: error });
  }
};

exports.resetPassword = async (req,res) => {
  try {
    const { newPassword } = req.body;
    
    // Get the currently authenticated user from req.user
    const user = req.user;
    console.log(user);
    // Update the user's password
    await auth.updateUser(user.uid, {
      password:newPassword
    });
    
    // Password successfully updated
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'An error occurred while changing password.' });
  }
};