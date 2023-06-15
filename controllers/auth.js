const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar");
const path = require("path")
const fs = require("fs/promises")
const Jimp = require("jimp");

const { SECRET_KEY } = process.env;
const {User} = require("../models/user")
const { HttpError, ctrlWrapper } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
    const {email, password} = req.body;
    const isPresen  = await User.findOne({email});

    if (isPresen) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email)

    const user = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({user: {email: user.email, subscription: user.subscription}})
}

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    
    if(!user) {
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn:"23h"});
    await User.findByIdAndUpdate(user._id, {token})
    res.json({token , user: {email: user.email, subscription: user.subscription}})
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({ email, subscription, });
}

const logout = async (req, res, next) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""})
    
    res.status(204).json({message: "logout succes"})
}
const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  console.log(req.body);
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.status(200).json({email: result.email, subscription: result.subscription});
}

const updateAvatar = async (req, res) => {
    const {_id} = req.user
    const { path: tempUpload, originalname } = req.file;
    
    
    const filename = `${_id}_${originalname}`
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    Jimp.read(resultUpload, (err, filename) => {
      if (err) throw err;
      filename.resize(256, 256).write(resultUpload);
    });
    
    
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL})
    res.json({
        avatarURL
    })
}; 

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};