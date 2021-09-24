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
const Emergency = require("../models/emergency-contacts")

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
  // console.log("login", req.body);
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
const  BlockNumber  = req.params.bid;
    // const contacId = req.params.pid;
console.log("block num : ", BlockNumber)

 flatDetails = await Flat.find({ BlockNumber: BlockNumber });

 if (!flatDetails) {
   const error = new HttpError("block datab doest exist");
   return next(error);
 }

 if (flatDetails.length == 0){
     const error = new HttpError(`Add flats data in block no ${BlockNumber}`,400);
    

     return next(error);
 }
   res.json({
     flatDetails: flatDetails,
   });
  

}



//update admin password 
const  updateAdminPassword = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { email, oldpassword , newpassword } = req.body;

    let admin
    try{
         admin = await User.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong,update password in failed",500)
        return next(error)
    }

    if(!admin){
        const error = new HttpError("admin not found could not update password",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
      isValidPassword = passwordHash.verify(oldpassword, admin.password);
   }
   catch(err){
    const error = await new HttpError("invalid password try again",500)
    return next(error)
}


if(!isValidPassword){
    const error = new HttpError("invalid old password could not update newpassword",401)
    return next(error)
}

let hashedPassword;
 

try{
 hashedPassword = await passwordHash.generate(newpassword);
 let foundadmin;
 foundadmin = await User.findOne({ email : email  })
  
 var updatedRecord = {
     password: hashedPassword
 }

 User.findByIdAndUpdate(foundadmin, { $set: updatedRecord },{new:true}, (err, docs) => {
    if (!err) res.json({mesage : "password updated sucessfully"})
    else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
 })
} 
catch(err){
  console.log(err)
    const error = new HttpError("cold not updated hash password of admin",500);
    return next(error)
}


}

/* get blocks */
const geListOfBlocks = async(req, res, next) => {


 let existingBlocks
 try{
    existingBlocks = await Block.find({});
 }
 catch(err){
   const error = new HttpError("something went wrong");
   return next(error)
 } 


 if(!existingBlocks){
   const error = new HttpError("blocks not found");
   return next(error)
 }

 res.json({
   Blocks: existingBlocks.map((block) => block.toObject({ getters: true }))
 });

}


/* get list of flats */
const geListOfFlats = async(req, res, next) => {


 let existingFlats
 try{
    existingFlats = await Flat.find({});
 }
 catch(err){
   const error = new HttpError("something went wrong");
   return next(error)
 } 


 if (!existingFlats) {
   const error = new HttpError("Flats not found");
   return next(error);
 }

 res.json({
   Flats: existingFlats.map((flat) => flat.toObject({ getters: true })),
 });

}

//Add Emergency contact number
const addEmergencyContact = async (req, res, next) => {
  const { name, email, ContactNumber, designation, BlockNumber, FlatNumber } = req.body;

  const existingBlock = await Block.findOne({ BlockNumber: BlockNumber });

    const existingEmail = await Emergency.findOne({ email: email });


  if (!existingBlock) {
    const error = new HttpError("Block Number doesnt Exists ");
    return next(error);
  }


  if (existingEmail) {
    const error = new HttpError("email id already Exists ");
    return next(error);
  }


  const addedContact = new Emergency({
    name,
    email,
    ContactNumber,
    designation,
    BlockNumber,
    FlatNumber,
  });

  try {
    await addedContact.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Adding Emergency contact Failed , please try again.", 500);
    return next(error);
  }
  res.json({ Contact: addedContact });
};

/* get list of emergencyContacts */
const geListOfContacts = async(req, res, next) => {


 let ListOfContacts;
 try{
    ListOfContacts = await Emergency.find({});
 }
 catch(err){
   const error = new HttpError("something went wrong");
   return next(error)
 } 


 if(ListOfContacts.length == 0){
 const error = new HttpError("there are no contacts ,please add contacts");
 return next(error);
 }

 res.json({
   Contacts: ListOfContacts.map((contact) =>
     contact.toObject({ getters: true })
   ),
 });

}


//delete deleteEmergencyContact by id
const deleteEmergencyContact = async (req, res, next) => {
    const contacId = req.params.pid;
    Emergency.findByIdAndRemove(contacId)
    .then((result) => {
      res.json({
        success: true,
        msg: `Contact has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete with provided id.' });
    });

  };

  //delete Block by id
const deleteBlockById = async (req, res, next) => {
    const blockId = req.params.bid;
    Block.findByIdAndRemove(blockId)
    .then((result) => {
      res.json({
        success: true,
        msg: `Block has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete with provided id.' });
    });

  };

  //delete flat by id
const deleteFlatById = async (req, res, next) => {
    const flatId = req.params.fid;
    Flat.findByIdAndRemove(flatId)
    .then((result) => {
      res.json({
        success: true,
        msg: `Flat has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete with provided id.' });
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
exports.geListOfBlocks = geListOfBlocks;
exports.geListOfFlats = geListOfFlats;
exports.deleteEmergencyContact = deleteEmergencyContact;


exports.addEmergencyContact = addEmergencyContact ;
exports.geListOfContacts = geListOfContacts;

exports.deleteBlockById = deleteBlockById;
exports.deleteFlatById = deleteFlatById;

exports.updateAdminPassword = updateAdminPassword;