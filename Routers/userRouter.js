const express =require('express');
const expressAsyncHandler =require('express-async-handler');
const bcrypt =require('bcryptjs');
const data =require('../data.js');
const User =require('../Models/UserModels.js');
const generateToken=require('../utils.js');
//const isAuth = require('../utils.js');

const userRouter = express.Router();

userRouter.get('/seed',expressAsyncHandler(async (req, res) =>{
    await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({createdUsers});
})
);
userRouter.post('/signin',expressAsyncHandler( async (req,res) =>{
    const user =await User.findOne({email:req.body.email})
    if(user){
        if(bcrypt.compareSync(req.body.password,user.password)){
            res.send({
                    _id:user._id,
                     name:user.name,
                    email:user.email,
                    isAdmin:user.isAdmin,
                    token:generateToken(user),
                });
                return;
        }
    }
        res.status(400).send({message:'Invalid Email or Password'})
})
);
userRouter.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
      const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    })
  );

module.exports=userRouter;
