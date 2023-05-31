import { userModel } from './../../../DB/models/user.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { myEmail } from './../../../services/email.js';
import { nanoid } from 'nanoid'

export const SignUp = async(req, res) => {
    try {
        const { firstName, lastName, email, password, age, phone, gender, address }  = req.body;
        const checkUser = await userModel.findOne({email}).select('email');
        if (checkUser) {
            res.status(409).json({message: "Email Exist"});
        } else {
            const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SaltRound));
            const encryptPhone = jwt.sign({phone: phone}, process.env.emailToken);
            const newUser = new userModel({ firstName, lastName, email, password: hashPassword, age, phone: encryptPhone, gender, address });
            const savedUser = await newUser.save();
            res.status(200).json({message: "Done" });
            const token = jwt.sign({id: savedUser._id}, process.env.emailToken, {expiresIn: '1h'});
            const refreshToken = jwt.sign({id: savedUser._id}, process.env.emailToken);
            const link = `${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/confirmEmail/${token}`;
            const rflink = `${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/refreshToken/${refreshToken}`;
            myEmail(email, 'ConfirmEmail', `<a href='${link}'>Follow me on this link to confirm ur account</a> <br> 
            <a href='${rflink}'>Re-send Confirmation email</a>`);
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error});
    }
}

export const confirmEmail = async(req, res) => {
    try {
        const { token } = req.params;
        if (token) {
            const { id } = jwt.decode(token);
            if (id) {
                const user = await userModel.findById(id).select('email');
                if (user) {
                    const updateUser = await userModel.updateOne({_id:id, confirmEmail: false}, {confirmEmail: true});
                    updateUser.modifiedCount? res.json({message: "Done plz proceed to sign in"}) : res.json({message: "Already Confirmed!"});
                } else {
                    res.status(404).json({message:"Invalid userID"});
                }
            } else {
                res.status(404).json({message: "Invalid payLoad Data"});
            }
        } else {
            res.status(404).json({message: "Invalid token"});
        }
    } catch (error) {
        res.json({message: "catch error", error});
    }
}

export const refreshToken = async(req, res) => {
    try {
        const { token } = req.params;
        const  decode = jwt.decode(token, process.env.emailToken);
        if (!decode?.id) {
            res.status(400).json({message: "Invalid payload data"});
        } else {
            const user = await userModel.findById(decode.id).select('email confirmEmail');
            if (user) {
                if (user.confirmEmail) {
                    res.status(200).json({message: "Done"})
                } else {
                    const token = jwt.sign({id: user._id}, process.env.emailToken, {expiresIn: 60 * 5});
                    const link = `${req.protocol}://${req.headers.host}${process.env.baseURL}/auth/confirmEmail/${token}`;
                    myEmail(user.email, 'ConfirmEmail', `<a href='${link}'>Follow me on this link to confirm ur account</a>`);
                    res.status(200).json({message: "Done"})
                }
            } else {
                res.status(400).json({message: "Invalid ID"});
            }
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error});
        console.log(error);
    }
}

export const SignIn  = async(req, res) => {
    try {
        const { email, password } = req.body;
        const checkEmail = await userModel.findOne({email});
        if(checkEmail)
        {
            if (checkEmail.isDeleted == false && checkEmail.isBlocked == false) {
                if (checkEmail.confirmEmail) {
                    const match = bcrypt.compareSync(password, checkEmail.password);
                    if (match) {
                        const user = await userModel.findByIdAndUpdate(checkEmail._id, {isOnline: true}, {new: true});
                        const token = jwt.sign({id: user._id}, process.env.emailToken, {expiresIn: '1h'});
                        res.status(200).json({message: "Done", token});
                    } else {
                        res.status(403).json({message: "email Password misMatch"});
                    }
                } else {
                    res.status(400).json({message: "U need to confirm ur account"})
                }
            } else {
                res.status(403).json({message: "Account has been deleted or blocked"});
            }
        }else
        {
            res.status(403).json({message: "email Password misMatch"});
        }
        
    } catch (error) {
        res.status(400).json({message: "catch error", error});
    }
}

export const sendCode = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({email}).select('email');
        if (user) {
            const code = nanoid();
            await userModel.updateOne({email}, {code});
            res.status(200).json({message: "Done"});
            myEmail(email, 'Forget Password', `<h1>Acces code: ${code}</h1>`);
        } else {
            res.status(404).json({message: "Email doesnt exist"})
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error});
    }
}

export const forgetPassword = async(req, res) => {
    try {
        const { code, newPassword, email } = req.body;
        if (code != "null") {
            const hashPassword = bcrypt.hashSync(newPassword);
            const user = await userModel.updateOne({email, code}, {code: "null", password: hashPassword});
            user.modifiedCount? res.status(200).json({message: "Done"}) : res.status(400).json({message: "Invalid code or email"});
        } else {
            res.status(400).json({message: "code can't  be null"});
        }
    } catch (error) {
        res.status(400).json({message: "catch error", error})
    }
}