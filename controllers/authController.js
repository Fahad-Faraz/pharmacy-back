import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER (ADMIN ONLY)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // FIX: basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "cashier",
    });

    // FIX: don't return password hash in response
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email)
    

     if (!email || !password) {
       return res.status(400).json({ message: "Email and password are required" });
     }
     const user = await User.findOne({ email });
     if (!user) return res.status(400).json({ message: "Invalid email or password" });

     const match = await bcrypt.compare(password, user.password);
    //  FIX: don't reveal which field is wrong (security best practice)
     if (!match) return res.status(400).json({ message: "Invalid email or password" });

     const token = jwt.sign(
       { id: user._id, role: user.role },
       process.env.JWT_SECRET,
       { expiresIn: "7d" }
     );

     res.json({
       token,
       user: {
         id: user._id,
         name: user.name,
         role: user.role,
       },
   });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    // FIX: was missing try/catch
    res.status(500).json({ message: err.message });
  }
};
