const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const HttpError = require("../middleware/http-error");

const { validationResult } = require("express-validator");

const User = require("../models/user-schema");
const Flat = require("../models/flats-schema");
const FamilyMember = require("../models/family-schema");
const Block = require("../models/block-schema");


const { v1: uuid } = require("uuid");



/* add user role */

const addAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(404).json({ error: "email not found" });
  
    if (!password) return res.status(404).json({ error: "password not found" });
    // check existing email

    let check_email = await User.findOne({ email });

    if (check_email)
      return res.status(400).json({ error: "Email is already registered" });

    const hashedPassword = passwordHash.generate(password);

    let new_user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const payload = {
      userId: new_user._id,
      name: `${new_user.email}`,
    };

    let token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });

    const save = await new_user.save();

    return res.status(200).json({
      success: true,
      msg: "Details saved",
      data: { userId: new_user._id, email: email, token },
    });
  } catch (err) {
      console.log("error =>" , err)
    const error = new HttpError(
      "can't add user Please try again after sometime .",
      500
    );
    return next(error);
  }
};





const userLogin = async (req, res, next) => {
  console.log("login", req.body);
  const { email, password } = req.body;
  let token = "";

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) return res.status(200).json({ error: "User not found" });

  const verifyPassword = passwordHash.verify(password, user.password);
  if (!verifyPassword)
    return res.status(200).json({ error: "Incorrect Password" });

  const payload = {
    userId: user._id,
    email: user.email,
  };
  token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 });

  return res
    .status(200)
    .json({
      success: true,
      msg: "Logged in Successfully ",
      data: {
        token,
        userId: user._id,
        email: user.email,
      },
    });
};


/* Add Block */

const addBlock = async (req, res, next) => {
  const { Blocktitle, Blockdescription, BlockNumber, TotalFlats } = req.body;

   const existingBlock = await Block.findOne({ BlockNumber: BlockNumber });
   
   if(existingBlock){
       const error = new HttpError("Block Number Already Exists ");
       return next(error)
   }

  const addedBlock = new Block({
    Blocktitle,
    Blockdescription,
    BlockNumber,
    TotalFlats
  });

  try {
    await addedBlock.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Adding Block Failed , please try again.",
      500
    );
    return next(error);
  }
  res.json({ Block: addedBlock });
};

/* Add Flst */

const addFlat = async (req, res, next) => {

  const {
    flatno,
    BlockNumber,
    title,
    ownerName,
    ownerEmail,
    ownerContactNumber,
    NumberOfFamilyMembers,
    famliyMembersList,
    ownerOccupation,
  } = req.body;

   const existingFlat = await Flat.findOne({ flatno: flatno });
    const existingBlock = await Block.findOne({ BlockNumber: BlockNumber });

   if(existingFlat){
       const error = new HttpError("flat Number already registred ");
       return next(error)
   }

     if (!existingBlock) {
       const error = new HttpError("Block Number doesn't exist ");
       return next(error);
     }

  const addedFlat = new Flat({
    title,
    ownerName,
    ownerEmail,
    ownerContactNumber,
    NumberOfFamilyMembers,
    ownerOccupation,
    flatno,
    famliyMembersList,
    BlockNumber,
  });

  try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await addedFlat.save({ session: sess });
      existingBlock.flats.push(addedFlat);
      await existingBlock.save({ session: sess });
      await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Adding Flat Failed , please try again.",
      500
    );
    return next(error);
  }
  res.json({ Flat: addedFlat });
};


const addFamilyMemberDetails = async (req, res, next) => {
  const {
    flatno,
    BlockNumber,
    title,
    name,
    email,
    contactNumber,
    gender,
    age,
    Occupation,
  } = req.body;

  const existingFlat = await Flat.findOne({ flatno: flatno });
  const existingBlock = await Block.findOne({ BlockNumber: BlockNumber });
  const existingMember = await FamilyMember.findOne({ email: email });

  if (!existingFlat) {
    const error = new HttpError("flat Number already registred ");
    return next(error);
  }

  if (!existingBlock) {
    const error = new HttpError("Block Number doesn't exist ");
    return next(error);
  }


    if (existingMember) {
      const error = new HttpError("email id already registred ");
      return next(error);
    }

  const addedFamilMember = new FamilyMember({
    flatno,
    BlockNumber,
    title,
    name,
    email,
    contactNumber,
    gender,
    age,
    Occupation
  });

  try {
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await addedFamilMember.save({ session: sess });
  existingFlat.famliyMembers.push(addedFamilMember);
  await existingFlat.save({ session: sess });
  await sess.commitTransaction();

  } catch (err) {
    console.log(err);
    const error = new HttpError("Adding Family member Failed , please try again.", 500);
    return next(error);
  }
  res.json({ FamilyMember: addedFamilMember });
};


const getDetailsbyFlatNumber = async(req ,res ,next) => {

    const { flatNumber } = req.body;

    const ExistingFlat = await Flat.findOne({ flatno: flatNumber });

    if (!ExistingFlat) {
      const error = new HttpError("flat number doest exist");
      return next(error);
    }

      res.json({
        FlatDetials: ExistingFlat
      });
}

const getDetailsOfFamilyMembers = async (req, res, next) => {
  const { flatNumber } = req.body;

      memberDetails = await Flat.findOne({ flatno: flatNumber }).populate(
        "famliyMembers");

  if (!memberDetails) {
    const error = new HttpError("data doest exist");
    return next(error);
  }

  res.json({
    Details: memberDetails,
  });
};



const getFlatsbyBlockNumber = async (req, res ,next ) => {
const { BlockNumber } = req.body;

 flatDetails = await Block.findOne({ BlockNumber: BlockNumber }).populate(
   "flats"
 );

 if (!flatDetails) {
   const error = new HttpError("block datab doest exist");
   return next(error);
 }

res.json({
  flats: flatDetails,
});
}


/* get income by month & year */

const getIncomeByMonthAndYear = async (req, res, next) => {
  const errors = validationResult(req);
  const monthId = req.params.monthId;
  const yearId = req.params.yearId;

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  let income;
  try {
    income = await Income.find({ month: `${monthId}`, year: `${yearId}` });
  } catch (err) {
    const error = new HttpError(
      "can not fetch Income of spefied details complete request",
      500
    );
    return next(error);
  }

  res.json({
    IncomeDetails: income.map((income) => income.toObject({ getters: true })),
  });
};



exports.addAdmin = addAdmin;
exports.userLogin = userLogin;
exports.addBlock = addBlock;
exports.addFlat = addFlat;
exports.addFamilyMemberDetails = addFamilyMemberDetails;

exports.getDetailsbyFlatNumber = getDetailsbyFlatNumber;
exports.getDetailsOfFamilyMembers = getDetailsOfFamilyMembers;
exports.getFlatsbyBlockNumber = getFlatsbyBlockNumber;
