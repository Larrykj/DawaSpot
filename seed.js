const mongoose = require('mongoose');
require('dotenv').config();

const Medicine = require('./models/Medicine');
const Pharmacy = require('./models/Pharmacy');
const Inventory = require('./models/Inventory');
const Verification = require('./models/Verification');
const User = require('./models/User');

const medicines = [
    // Antibiotics
    { name: 'Augmentin 625mg', genericName: 'Amoxicillin/Clavulanate', category: 'antibiotics', manufacturer: 'GSK', dosage: '625mg', requiresPrescription: true, barcodes: ['8901234567890'] },
    { name: 'Amoxil 500mg', genericName: 'Amoxicillin', category: 'antibiotics', manufacturer: 'Pfizer', dosage: '500mg', requiresPrescription: true, barcodes: ['8901234567891'] },
    { name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin', category: 'antibiotics', manufacturer: 'Dawa Ltd', dosage: '500mg', requiresPrescription: true, barcodes: ['8901234567892'] },
    { name: 'Metronidazole 400mg', genericName: 'Metronidazole', category: 'antibiotics', manufacturer: 'Cosmos', dosage: '400mg', requiresPrescription: true, barcodes: ['8901234567893'] },

    // Pain Relief
    { name: 'Panadol Extra', genericName: 'Paracetamol/Caffeine', category: 'pain-relief', manufacturer: 'GSK', dosage: '500mg/65mg', requiresPrescription: false, barcodes: ['8901234567894'] },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'pain-relief', manufacturer: 'Reckitt', dosage: '400mg', requiresPrescription: false, barcodes: ['8901234567895'] },
    { name: 'Diclofenac 50mg', genericName: 'Diclofenac', category: 'pain-relief', manufacturer: 'Novartis', dosage: '50mg', requiresPrescription: false, barcodes: ['8901234567896'] },
    { name: 'Tramadol 50mg', genericName: 'Tramadol', category: 'pain-relief', manufacturer: 'Dawa Ltd', dosage: '50mg', requiresPrescription: true, barcodes: ['8901234567897'] },

    // Blood Pressure
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine', category: 'blood-pressure', manufacturer: 'Pfizer', dosage: '5mg', requiresPrescription: true, barcodes: ['8901234567898'] },
    { name: 'Losartan 50mg', genericName: 'Losartan', category: 'blood-pressure', manufacturer: 'Sandoz', dosage: '50mg', requiresPrescription: true, barcodes: ['8901234567899'] },
    { name: 'Lisinopril 10mg', genericName: 'Lisinopril', category: 'blood-pressure', manufacturer: 'AstraZeneca', dosage: '10mg', requiresPrescription: true, barcodes: ['8901234567900'] },
    { name: 'Atenolol 50mg', genericName: 'Atenolol', category: 'blood-pressure', manufacturer: 'Cosmos', dosage: '50mg', requiresPrescription: true, barcodes: ['8901234567901'] },

    // Diabetes
    { name: 'Metformin 500mg', genericName: 'Metformin', category: 'diabetes', manufacturer: 'Merck', dosage: '500mg', requiresPrescription: true, barcodes: ['8901234567902'] },
    { name: 'Glibenclamide 5mg', genericName: 'Glibenclamide', category: 'diabetes', manufacturer: 'Sanofi', dosage: '5mg', requiresPrescription: true, barcodes: ['8901234567903'] },
    { name: 'Januvia 100mg', genericName: 'Sitagliptin', category: 'diabetes', manufacturer: 'MSD', dosage: '100mg', requiresPrescription: true, barcodes: ['8901234567904'] },

    // Antimalarial
    { name: 'Coartem', genericName: 'Artemether/Lumefantrine', category: 'antimalarial', manufacturer: 'Novartis', dosage: '20/120mg', requiresPrescription: true, barcodes: ['8901234567905'] },
    { name: 'Malarone', genericName: 'Atovaquone/Proguanil', category: 'antimalarial', manufacturer: 'GSK', dosage: '250/100mg', requiresPrescription: true, barcodes: ['8901234567906'] },
    { name: 'Duo-Cotecxin', genericName: 'Dihydroartemisinin/Piperaquine', category: 'antimalarial', manufacturer: 'Holley Pharma', dosage: '40/320mg', requiresPrescription: true, barcodes: ['8901234567907'] },

    // Vitamins
    { name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', category: 'vitamins', manufacturer: 'Now Foods', dosage: '1000mg', requiresPrescription: false, barcodes: ['8901234567908'] },
    { name: 'Vitamin D3 1000IU', genericName: 'Cholecalciferol', category: 'vitamins', manufacturer: 'Solgar', dosage: '1000IU', requiresPrescription: false, barcodes: ['8901234567909'] },
    { name: 'Multivitamin Complex', genericName: 'Multivitamins', category: 'vitamins', manufacturer: 'Centrum', dosage: 'Various', requiresPrescription: false, barcodes: ['8901234567910'] },

    // Respiratory
    { name: 'Ventolin Inhaler', genericName: 'Salbutamol', category: 'respiratory', manufacturer: 'GSK', dosage: '100mcg', requiresPrescription: true, barcodes: ['8901234567911'] },
    { name: 'Cetrizine 10mg', genericName: 'Cetrizine', category: 'respiratory', manufacturer: 'UCB', dosage: '10mg', requiresPrescription: false, barcodes: ['8901234567912'] },
    { name: 'Actifed Syrup', genericName: 'Triprolidine/Pseudoephedrine', category: 'respiratory', manufacturer: 'Johnson & Johnson', dosage: '1.25mg/30mg per 5ml', requiresPrescription: false, barcodes: ['8901234567913'] },

    // Antacids
    { name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'antacids', manufacturer: 'AstraZeneca', dosage: '20mg', requiresPrescription: false, barcodes: ['8901234567914'] },
    { name: 'Gaviscon', genericName: 'Sodium Alginate', category: 'antacids', manufacturer: 'Reckitt', dosage: '500mg', requiresPrescription: false, barcodes: ['8901234567915'] },
    { name: 'Eno', genericName: 'Sodium Bicarbonate', category: 'antacids', manufacturer: 'GSK', dosage: '5g', requiresPrescription: false, barcodes: ['8901234567916'] }
];

// Nairobi pharmacies with real coordinates
const pharmacies = [
    {
        name: 'Goodlife Pharmacy - Westlands',
        address: 'Sarit Centre, Westlands, Nairobi',
        location: { type: 'Point', coordinates: [36.8034, -1.2582] },
        phone: '+254722000001',
        whatsapp: '+254722000001',
        is24Hours: false,
        verified: true,
        rating: 4.5,
        totalRatings: 128,
        licenseNumber: 'PPB/PH/2024/001'
    },
    {
        name: 'Lifecare Pharmacy',
        address: 'Yaya Centre, Kilimani, Nairobi',
        location: { type: 'Point', coordinates: [36.7891, -1.2921] },
        phone: '+254722000002',
        whatsapp: '+254722000002',
        is24Hours: false,
        verified: true,
        rating: 4.3,
        totalRatings: 95,
        licenseNumber: 'PPB/PH/2024/002'
    },
    {
        name: 'Haltons Pharmacy - CBD',
        address: 'Kenyatta Avenue, Nairobi CBD',
        location: { type: 'Point', coordinates: [36.8169, -1.2841] },
        phone: '+254722000003',
        whatsapp: '+254722000003',
        is24Hours: true,
        verified: true,
        rating: 4.7,
        totalRatings: 256,
        licenseNumber: 'PPB/PH/2024/003'
    },
    {
        name: 'Portal Pharmacy',
        address: 'Karen Shopping Centre, Karen',
        location: { type: 'Point', coordinates: [36.7114, -1.3182] },
        phone: '+254722000004',
        whatsapp: '+254722000004',
        is24Hours: false,
        verified: true,
        rating: 4.4,
        totalRatings: 67,
        licenseNumber: 'PPB/PH/2024/004'
    },
    {
        name: 'Pharmart Pharmacy',
        address: 'Garden City Mall, Kasarani',
        location: { type: 'Point', coordinates: [36.8744, -1.2267] },
        phone: '+254722000005',
        whatsapp: '+254722000005',
        is24Hours: false,
        verified: true,
        rating: 4.2,
        totalRatings: 43,
        licenseNumber: 'PPB/PH/2024/005'
    },
    {
        name: 'Dawa Pharmacy - South B',
        address: 'Capital Centre, South B, Nairobi',
        location: { type: 'Point', coordinates: [36.8367, -1.3089] },
        phone: '+254722000006',
        whatsapp: '+254722000006',
        is24Hours: false,
        verified: true,
        rating: 4.1,
        totalRatings: 38,
        licenseNumber: 'PPB/PH/2024/006'
    },
    {
        name: 'Mediplus Pharmacy',
        address: 'Junction Mall, Ngong Road',
        location: { type: 'Point', coordinates: [36.7521, -1.2998] },
        phone: '+254722000007',
        whatsapp: '+254722000007',
        is24Hours: false,
        verified: true,
        rating: 4.6,
        totalRatings: 112,
        licenseNumber: 'PPB/PH/2024/007'
    },
    {
        name: 'Greenlight Pharmacy',
        address: 'Lavington Mall, Lavington',
        location: { type: 'Point', coordinates: [36.7682, -1.2762] },
        phone: '+254722000008',
        whatsapp: '+254722000008',
        is24Hours: true,
        verified: true,
        rating: 4.4,
        totalRatings: 89,
        licenseNumber: 'PPB/PH/2024/008'
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Medicine.deleteMany({});
        await Pharmacy.deleteMany({});
        await Inventory.deleteMany({});
        await Verification.deleteMany({});
        // Don't delete all users - only non-admin users
        await User.deleteMany({ role: { $ne: 'admin' } });
        console.log('Cleared existing data');

        // Create or update admin user
        const adminEmail = 'admin@dawaspot.co.ke';
        try {
            let adminUser = await User.findOne({ email: adminEmail });

            if (!adminUser) {
                adminUser = new User({
                    name: 'DawaSpot Admin',
                    email: adminEmail,
                    phone: '+254700000000',
                    password: 'Admin@2025!',  // Stronger password
                    role: 'admin',
                    isVerified: true,
                    isActive: true,
                    consentGiven: true,
                    consentDate: new Date(),
                    privacyAccepted: true
                });
                await adminUser.save();
                console.log('✅ Created admin user: admin@dawaspot.co.ke / Admin@2025!');
            } else {
                console.log('ℹ️  Admin user already exists');
            }
        } catch (adminError) {
            console.error('⚠️  Could not create admin user:', adminError.message);
            console.log('ℹ️  You can create an admin user manually later');
        }

        // Seed medicines
        const createdMedicines = await Medicine.insertMany(medicines);
        console.log(`Created ${createdMedicines.length} medicines`);

        // Seed pharmacies
        const createdPharmacies = await Pharmacy.insertMany(pharmacies);
        console.log(`Created ${createdPharmacies.length} pharmacies`);

        // Create inventory (random stock for each pharmacy/medicine combo)
        const inventoryItems = [];
        for (const pharmacy of createdPharmacies) {
            // Each pharmacy has 60-80% of medicines
            const numMedicines = Math.floor(createdMedicines.length * (0.6 + Math.random() * 0.2));
            const shuffledMedicines = createdMedicines.sort(() => 0.5 - Math.random()).slice(0, numMedicines);

            for (const medicine of shuffledMedicines) {
                inventoryItems.push({
                    pharmacy: pharmacy._id,
                    medicine: medicine._id,
                    price: Math.round((50 + Math.random() * 1500) / 10) * 10, // Price between 50-1550 KES
                    quantity: Math.floor(Math.random() * 50) + 1
                });
            }
        }

        await Inventory.insertMany(inventoryItems);
        console.log(`Created ${inventoryItems.length} inventory items`);

        // Create verifications
        const verifications = createdMedicines.map(medicine => ({
            barcode: medicine.barcodes[0],
            medicine: medicine._id,
            manufacturer: medicine.manufacturer,
            batchNumber: `BATCH${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            manufactureDate: new Date('2024-01-01'),
            expiryDate: new Date('2026-12-31'),
            isGenuine: true,
            ppbVerified: Math.random() > 0.3 // 70% PPB verified
        }));

        await Verification.insertMany(verifications);
        console.log(`Created ${verifications.length} verifications`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📋 Admin Login Credentials:');
        console.log('   Email: admin@dawaspot.co.ke');
        console.log('   Password: Admin@2025');
        console.log('\n🔗 Access admin at: http://localhost:3000/admin');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();

