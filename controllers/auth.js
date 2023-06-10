const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { SECRET_KEY } = process.env;
const {User} = require("../models/user")
const { HttpError, ctrlWrapper } = require("../helpers");

const register = async (req, res) => {
    const {email, password} = req.body;
    const isPresen  = await User.findOne({email});

    if (isPresen) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({...req.body, password: hashPassword});

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
    const {email, name} = req.user;
    res.json({email, name,})
}

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  console.log(req.body);
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.status(200).json(result);
};

const logout = async (req, res, next) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""})

    res.status(204).json({message: "logout succes"})
}
module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  logout: ctrlWrapper(logout),
};