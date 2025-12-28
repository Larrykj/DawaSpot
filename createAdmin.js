const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Hash the password manually
        const hashedPassword = await bcrypt.hash('Admin2025!', 12);

        // Use direct collection insert to avoid model middleware issues
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Delete existing admin
        await usersCollection.deleteOne({ email: 'admin@dawaspot.co.ke' });

        // Create new admin user directly
        const result = await usersCollection.insertOne({
            name: 'DawaSpot Admin',
            email: 'admin@dawaspot.co.ke',
            phone: '+254700000000',
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
            isActive: true,
            consentGiven: true,
            consentDate: new Date(),
            privacyAccepted: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            notifications: {
                email: true,
                sms: false,
                push: true
            },
            savedPharmacies: [],
            savedMedicines: [],
            loginAttempts: 0
        });

        console.log('✅ Admin user created successfully!');
        console.log('   Email: admin@dawaspot.co.ke');
        console.log('   Password: Admin2025!');
        console.log('   Access: http://localhost:3000/admin');
        console.log('   ID:', result.insertedId);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
