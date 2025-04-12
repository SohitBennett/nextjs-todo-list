import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created"});
    } catch (err){
        res.status(500).json({ error: "Signup failed" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid creds" });
        }
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
};

