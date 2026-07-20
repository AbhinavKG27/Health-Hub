const user = require('../model/user');
const jsonwebtoken = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const doctor = require('../model/doctor');
const { jwtExpiresIn, cookieOptions } = require('../config');

const sanitizeAuthUser = (auth_user) => {
  const userObject = auth_user.toObject ? auth_user.toObject() : { ...auth_user };
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const createToken = (auth_user) => {
  const tokenUser = sanitizeAuthUser(auth_user);
  return jsonwebtoken.sign({ auth_user: tokenUser }, process.env.SECRET_KEY, { expiresIn: jwtExpiresIn() });
};

const signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
           return  res.status(400).json({ message: "incomplete content" });
        } else {
            const auth_user = await user.findOne({ username }).select("+password");
            if (!auth_user) {
                  return  res
                    .status(401)
                    .json({ message: `user with ${username} no found` });
            } else {
                const verify = await bcryptjs.compare(password, auth_user.password);
                if(!verify){
                    return res
            .status(401)
            .json({ message: "username or password incorrect" });
                }else{
                    const token = createToken(auth_user);
                    const safeUser = sanitizeAuthUser(auth_user);
                    res.cookie("authorization", `Bearer ${token}`, cookieOptions());
                    return res.status(200).json({ token:`Bearer ${token}`, user:safeUser,message:"login successfully"});
                }

            }
        }


    } catch (error) {
        res.status(500).json({ message: error.message });


    }


}

const doctorsignin = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
         return  res.status(400).json({ message: "incomplete content" });
      } else {
          const auth_user = await doctor.findOne({ email }).select("+password");
          if (!auth_user) {
                return  res
                  .status(401)
                  .json({ message: `user with ${email} no found` });
          } else {
              const verify = await bcryptjs.compare(password, auth_user.password);
              if(!verify){
                  return res
          .status(401)
          .json({ message: "email or password incorrect" });
              }else{
                  const token = createToken(auth_user);
                  const safeUser = sanitizeAuthUser(auth_user);
                  res.cookie("authorization", `Bearer ${token}`, cookieOptions());
                  return res.status(200).json({ token:`Bearer ${token}`, user:safeUser});
              }

          }
      }


  } catch (error) {
      res.status(500).json({ message: error.message });


  }


}


const signup = async (req, res) => {
    try {
      const { username, password, email, gender, age, location, phone } =
        req.body;
      if (!username || !password || !email) {
        return res.status(400).json({ message: "incomplete content" });
      } else {
        const new_user = await user.findOne({ $or: [{ username }, { email }] });
        if (!new_user) {
          const hashed_password = await bcryptjs.hash(password, 8);
          await user.create({
            username,
            password: hashed_password,
            email,
            gender,
            age,
            location,
            phone,
          });
          return res.status(201).json({ message: "user created" });
        } else {
          return res.status(409).json({ message: "user already exist" });
        }
      }
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
  
module.exports = {
    signin, signup,doctorsignin
}