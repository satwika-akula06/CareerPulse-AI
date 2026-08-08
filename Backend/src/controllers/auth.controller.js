const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res){

    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username},{email}]
    })
    
    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "Account already exists with this username or email"
        })
    }

    const hash=await bcrypt.hash(password, 10)

    const user=await userModel.create({
        username,
        email,
        password: hash
    })

    const token=jwt.sign(
        {id:user._id, username:user.username}, 
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token)

    res.status(201).json({  
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
   
}
 

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter both email and password."
            });
        }

        const user = await userModel.findOne({ email });

        // 1. Return 404 if email is not found
        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register first."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        // 2. Return 400 if password does not match
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Incorrect password. Please try again."
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token);
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login controller error:", error);
        return res.status(500).json({
            message: "Internal server error during login."
        });
    }
}

/**
 * @name logoutUserController
 * @description logout a user, clears the token from the cookie and adds it to the blacklist
 * @access Public       
 */
async function logoutUserController(req, res){
    const token = req.cookies.token
    if(!token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}


/**
 * @name getMeController
 * @description get the current logged in user details, expects a valid token in the cookie
 * @access Private
 */
async function getMeController(req, res){


    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",   
        user:{
            id: user._id,
            username: user.username,
            email: user.email

        }
        
    })
}

module.exports={registerUserController, loginUserController, logoutUserController, getMeController}