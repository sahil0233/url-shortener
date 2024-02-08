const express = require("express");
const { z } = require("zod");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const jwt = require("jsonwebtoken");
const { User } = require("../db");


const signupSchema = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
});

const signinSchema = z.object({
    username: z.string().email(),
    password: z.string()
})

const updateBody = z.object({
    firstName : z.string().optional(),
    password: z.string().optional(),
    lastName: z.string().optional(),

})

const router = express.Router();

router.get("/test", (req,res) => {
    return res.send("woking");
})

router.post("/signup",async (req,res) => {
    const body = req.body;
    const input = signupSchema.safeParse(body);
    if(!input.success){
        return res.json({
            message: "Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: body.username
    })

    if(user) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    const userId = dbUser._id;



    const token = jwt.sign({
        userId : dbUser._id
    }, JWT_SECRET);
    res.json({
        message: "User created successfully",
	    token: token
    })
})

router.post("/signin", async (req,res) => {
    const body = req.body;
    const input = signinSchema.safeParse(body);
    if(!input.success){
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: body.username,
        password: body.password
    });
    if(user){
        const token = jwt.sign({
            userId : user._id
        }, JWT_SECRET);
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})

router.post("/me", (req,res) => {
    const { token } = req.body;
    if(!token){
        return res.json({
            "loggedin": "false"
        })
    }else {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
              return res.json({
                "loggedin": "false"
              });
            }
            return res.json({
                "loggedin": "true"
            })
          });
    }
})

module.exports = router;