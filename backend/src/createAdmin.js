require("dotenv").config();

const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const cafeConfig = require('./config/cafeConfig');

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await Admin.findOne({ email: cafeConfig.admin.email });

        if (existingAdmin) {
            await Admin.deleteOne({ email: cafeConfig.admin.email });
            console.log("Deleted old admin (was double-hashed). Recreating...");
        }

        // FIX: pass PLAIN TEXT password — the pre('save') hook in Admin.js
        // calls bcrypt.hash() automatically. Never hash manually before this.
        await Admin.create({
            name: cafeConfig.admin.name,
            email: cafeConfig.admin.email,
            password: cafeConfig.admin.password,
        });

        console.log("✅ Admin created successfully");
        console.log("   Email:    " + cafeConfig.admin.email);
        console.log("   Password: " + cafeConfig.admin.password);
        process.exit();
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
