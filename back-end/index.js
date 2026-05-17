require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { createServer } = require("http");
const { initSocket } = require("./controller/socketIo");
const { current } = require("./controller/currentTime");

const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const USER = require("./Models/user");
const Request = require("./Models/requests");

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser())
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

const server = createServer(app);
initSocket(server); 

mongoose.connect(process.env.MONGOODB_URL).then(() => {
    console.log("connection successfull!");
}).catch((err) => {
    console.log("connection failed -> ", err);
})

const TokenValid = async (req, res, next) => {
    try {
        const token = req.cookies.sessiontok;
        if (!token) {
            return res.status(401).json({ message: "You don't have permission to enter." });
        }
        const isValid = await jwt.verify(token, process.env.SECRET_KEY_JWT);
        req.user = isValid;
        next();
    } catch (error) {
        res.status(403).json({ message: "You do not have permission to enter."});
    }
};

app.get('/api', TokenValid, (req, res) => {
    res.send(`Welcome ${req.user.name}, server is running now`);
});

app.post("/login", async (req,res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).send({message: "missing username or password"});
    }
    try {
        const user = await USER.findOne({username: username});
        const pass = await bcrypt.compare(password, user.password);
        console.log(pass)
        if(pass) {
            /*
            recover link from gitHub if we don't use Date of PCs and we will get current from external API
            https://github.com/davidayalas/current-time?tab=readme-ov-file
            */ 
        
            // change status of account
            user.status = true;
               // get last date
                const duration = {
                    login: current(),
                    logout: ""
                }
                user.lastLogin.push(duration)
                // append date in data if not found
                await user.save();
            

            // payload Data
            const data = {
                username: user.username,
                name: user.name,
                job: user.job,
                isLogin: user.status,
                lastLogin: user.lastLogin
            }

            // expired after one hour
            const token = jwt.sign(data, process.env.SECRET_KEY_JWT, { expiresIn: "12h" });

            return res.status(200).cookie("sessiontok", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            }).send({ status: "success" });
        }
        return res.status(404).send({message: "failed"})
    }
    catch(err) {
        console.log(err);
        return res.status(500).send({message: "internal server error", error: err})
    }
})

app.post("/logout", TokenValid, async (req,res) => {
    try {
        await USER.updateOne({username: req.user.username}, {status: false});
        const user = await USER.findOne({username: req.user.username});
        /*
            here i will search on last login time and update it 
            ->>> user.lastLogin[user.lastLogin.length - 1].logout
        */
        if(user.lastLogin[user.lastLogin.length - 1].logout === "") {
            user.lastLogin[user.lastLogin.length - 1].logout = current();
            await user.save();
        }
        
        res.clearCookie("sessiontok", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        res.status(200).send({message: "logout successfully!"});
    }
    catch(err) {
        res.status(500).send({message: "internal server error"});
        console.log("err message: ", err);
    }
})

app.get('/getData', TokenValid, (req,res) => {
    try {
        const data = {
            name: req.user.name,
            user: req.user.username,
            job: req.user.job,
            status: req.user.isLogin,
            last_login: req.user.lastLogin
        }
        res.status(200).send({message: "success", data: data});
    }
    catch(err) {
        res.status(500).send({message: "internal server error", details: err});
    }
})

app.post("/request", TokenValid, async (req,res) => {
    const { name, reason, priority, details } = req.body;
    if(name === '' || reason === '' || priority === null) {
        return res.status(400).send({message: "please enter valid inputs"});
    }
    try {
        const newReq = new Request({
            name,
            reason,
            priority,
            details: details
        });
        await newReq.save();

        res.status(200).send({message: "your request sent and return your ID", response: String(newReq._id)});
    }
    catch(error) {
        res.status(500).send({title: "internal server error", message: error})
    }
});


app.get("/Requests", TokenValid, async (req,res) => {
    const Data = await Request.find();
    try {
        if(!Data) {
            return res.status(404).send({message: "no data found"});
        }
        return res.status(200).send({message: "success", requests: Data});
    }
    catch(error) {
        return  res.status(500).send({message: "internal server error"});
    }
})

app.get("/getReq", TokenValid, async (req,res) => {
    try {
        // i search to last request to wizard which pending if i am find it, i will return it 
        const pendingReq = await Request.findOne({ wizard: req.user.name, agentRes: false }).sort({ createdAt: 1 });
        if (!pendingReq) {
            // here i will set new wizard on pending request doesn't have any wizard 
            const setLastPendingReq = await Request.findOneAndUpdate(
                { wizard: "" },
                { wizard: req.user.name, "Timeer.time_recieve": current()},
                { sort: { createdAt: 1 }, new: true }
            );

            if (!setLastPendingReq) {
                return res.status(404).send({ message: "don't have any request" });
            }
            const Data = {
                _id: setLastPendingReq._id,
                name: setLastPendingReq.name,
                reason: setLastPendingReq.reason,
                priority: setLastPendingReq.priority,
                details: setLastPendingReq.details
            };

            res.status(200).send({ data: Data });
        } else {
            return res.status(200).send({ data: pendingReq });
        }
    }
    catch(error) {
        res.status(500).send({ message: "internal server error" });
        console.log("error: ", error);
    }
});

app.post("/solveCase", TokenValid, async (req,res) => {
    const {id} = req.body;

    if(!id) return res.status(400).send({message: "missing req id"});
    
    try {
        await Request.updateOne({_id: id}, {wizardRes: true, "Timeer.time_ending": current()});

        const { getIO } = require("./controller/socketIo");
        const io = getIO();
        io.emit(`resolved-${id}`, { resolved: true });

        res.status(200).send({message: "updated status of wizard"});
    }
    catch(err) {
        console.error("err: ", err);
        return res.status(500).send({title: "internal server error", message: err})
    }
});

app.post("/shakeMark", TokenValid, async (req,res) => {
    const { id } = req.body;
    if(!id) return res.status(400).send({message: "missing id of request"});
    try {
        await Request.updateOne( {_id: id}, {agentRes: true} );

        const { getIO } = require("./controller/socketIo");
        const io = getIO();
        io.emit(`resolvedAgent-${id}`, { resolved: true });
        
        res.status(200).send({message: "solve the request successfully"});
    }
    catch(error) {
        console.log("err ", error)
        return res.status(500).send({title: "internal server error", message: err});
    }
})

// app.post("/enc/:pass", async (req,res) => {
//     const plainText = req.params.pass;
//     const salt = 10;
//     const encryptionText = await bcrypt.hash(plainText, salt);
//     res.status(200).send({message: encryptionText});
// })

server.listen(PORT, () => {
    console.log("server is running")
})  