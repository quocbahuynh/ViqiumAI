import Plan from "../models/Plan.js";


export const seedPlan = async () => {
    const count = await Plan.countDocuments();
    if (count === 0) {
        const defaultPlans = [
            {
                name: "Starter",
                value: "starter",
                description: "starter",
                price: 0,
                active: true,
                limit: {
                    messages: 100,
                    personalResponse: false,
                    advancedUpsale: false,
                    confirmedOrder: false,
                    integrateWebsite: false,
                    multiplePlatform: false,
                    reportWeekly: false,
                    reportRealtime: false,
                    trainingAINLP: false,
                    livechat: false,
                    exclusiveStrategy: false,
                    advancedExclusiveStrategy: false,
                }
            },
            {
                name: "Essentials",
                value: "essentials",
                description: "essentials",
                price: 599000,
                active: true,
                limit: {
                    messages: 500,
                    personalResponse: true,
                    advancedUpsale: true,
                    confirmedOrder: true,
                    integrateWebsite: false,
                    multiplePlatform: false,
                    reportWeekly: true,
                    reportRealtime: false,
                    trainingAINLP: false,
                    livechat: true,
                    exclusiveStrategy: false,
                    advancedExclusiveStrategy: false,
                }
            },
            {
                name: "Elite",
                value: "elite",
                description: "Elite",
                price: 799000,
                active: true,
                limit: {
                    messages: 1000,
                    personalResponse: true,
                    advancedUpsale: true,
                    confirmedOrder: true,
                    integrateWebsite: true,
                    multiplePlatform: false,
                    reportWeekly: true,
                    reportRealtime: false,
                    trainingAINLP: false,
                    livechat: true,
                    exclusiveStrategy: false,
                    advancedExclusiveStrategy: false,
                }
            },
            {
                name: "Prestige",
                value: "prestige",
                description: "Prestige",
                price: 999000,
                active: true,
                limit: {
                    messages: 1000000000,
                    personalResponse: true,
                    advancedUpsale: true,
                    confirmedOrder: true,
                    integrateWebsite: true,
                    multiplePlatform: true,
                    reportWeekly: true,
                    reportRealtime: true,
                    trainingAINLP: true,
                    livechat: true,
                    exclusiveStrategy: true,
                    advancedExclusiveStrategy: false,
                }
            },
            {
                name: "Bespoke",
                value: "bespoke",
                description: "Bespoke",
                price: 1000000000,
                active: true,
                limit: {
                    messages: 1000000000,
                    personalResponse: true,
                    advancedUpsale: true,
                    confirmedOrder: true,
                    integrateWebsite: true,
                    multiplePlatform: true,
                    reportWeekly: true,
                    reportRealtime: true,
                    trainingAINLP: true,
                    livechat: true,
                    exclusiveStrategy: true,
                    advancedExclusiveStrategy: true,
                }
            },
        ];

        await Plan.insertMany(defaultPlans);
        console.log('Default plans seeded.');
    } else {
        console.log('Plans already exist. No seeding needed.');
    }
};
