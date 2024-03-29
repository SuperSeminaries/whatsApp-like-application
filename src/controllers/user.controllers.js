import { User } from '../models/user.models.js';
import otpGenerator from 'otp-generator'
import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateNumericOTP = (length) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
};

// Generate OTP 
const otp = generateNumericOTP(6); // Change the length as needed
console.log(otp);

const createUserAndSendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const existingUser = await User.findOne({phoneNumber})
    if (existingUser) {
      // If the user already exists, update the OTP
      existingUser.otp = otp;
      await existingUser.save();
    } else {
      // If the user doesn't exist, create a new user with the OTP
      await User.create({
        phoneNumber,
        otp
      });
    }
    console.log('otp is', otp);
  
    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your WhatsApp verification code is: ${otp}`,
      from: '+17607864046',
      to: phoneNumber
    });

    // Set OTP expiration after 2 minutes
    setTimeout(async () => {
      const user = await User.findOne({ phoneNumber });
      if (user && user.otp === otp) {
        // If the OTP is still the same, clear it
        user.otp = undefined;
        await user.save();
      }
    }, 2 * 60 * 1000); // 2 minutes


    return res.status(201).json({ message: 'OTP sent successfully',  });
  } catch (error) {
    console.error('Error creating user and sending OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const generateAccessTokenAndReferenceToken = async (userId) => {
  const user = await User.findById(userId)
  const accessToken = await user.generateAccessToken()
  const referenceToken = await user.generateReferenceToken()

  user.referenceToken = referenceToken
  await user.save()
  return ({accessToken, referenceToken})
}

const verifyOTP = async (req, res) => {
  try {
    const {phoneNumber, otp} = req.body;

    const existingUser = await User.findOne({phoneNumber})
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {accessToken, referenceToken} = await generateAccessTokenAndReferenceToken(existingUser._id)
    console.log(existingUser._id);

    // Check if the OTP matches
    if (existingUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    existingUser.otp = undefined;
    await existingUser.save();

    const options = {
      httpOnly: true,
      secure: true
    };

    return res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('referenceToken', referenceToken, options)
    .json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const resendOtp = async (req, res) => {
  try {
    const {phoneNumber} = req.body;

    const existingUser = await User.findOne({phoneNumber})
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    existingUser.otp = otp;
    await existingUser.save()

    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your WhatsApp verification code is: ${otp}`,
      from: '+17607864046',
      to: phoneNumber
    });

    return res.status(200).json({ message: 'New OTP send successfully' });
  } catch (error) {
    console.log(error);
  }
}


export  { createUserAndSendOTP, verifyOTP, resendOtp };



