require("dotenv").config();

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await Admin.findOne({ email: "admin@velvet-vault.com" });

        if (existingAdmin) {
            // FIX: delete the old admin — it was created with a double-hashed password.
            // bcrypt.hash() was called in this script AND again in Admin.js pre('save') hook
            // = double-hash = comparePassword always fails = 401 on every login attempt.
            await Admin.deleteOne({ email: "admin@velvet-vault.com" });
            console.log("Deleted old admin (was double-hashed). Recreating...");
        }

        // FIX: pass PLAIN TEXT password — the pre('save') hook in Admin.js
        // calls bcrypt.hash() automatically. Never hash manually before this.
        await Admin.create({
            name: "Admin",
            email: "admin@velvet-vault.com",
            password: "velvetpassword",
        });

        console.log("✅ Admin created successfully");
        console.log("   Email:    admin@velvet-vault.com");
        console.log("   Password: velvetpassword");
        process.exit();
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
