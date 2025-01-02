import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d" // Token validity: 7 days
    });

    // Set token as an HTTP-only cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true, // Prevent client-side JavaScript access to the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict" // Prevent CSRF (Cross-Site Request Forgery) attacks
    });

    return token; // Optional: Return the token if needed elsewhere
};
