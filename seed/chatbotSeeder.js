import { trainingCollection } from "../mongovector.js";





export const seedTraining = async () => {
    const count = await trainingCollection.countDocuments();
    if (count === 0) {
        await trainingCollection.insertMany([
            { user: 'User1', message: 'Hello!' },
        ]);
        console.log('Default training seeded.');
    } else {
        console.log('Training already exist. No seeding needed.');
    }
};

