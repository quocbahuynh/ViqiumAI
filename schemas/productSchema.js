import { z } from 'zod';

export const productSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is required" }).min(1),
        description: z.string().optional(),
        basePrice: z.number({ required_error: "Base price is required" }).min(0),
        basePhotoUrl: z.string().url().optional().or(z.literal("")),
        variant: z.array(
            z.object({
                photoUrl: z.string().optional().or(z.literal("")),
                price: z.number().optional(),
                classifications: z.array(
                    z.object({
                        classificationId: z.string(),
                        valueClassificationId: z.string(),
                        label: z.string().optional(),
                        aidescription: z.string().optional(),
                        value: z.string().optional(),
                        typeRoles: z.string().optional(),
                        valueLabel: z.string().optional(),
                        valueAidescription: z.string().optional(),
                        valueValue: z.string().optional(),
                        valueTypeRoles: z.string().optional()
                    })
                ).optional()
            })
        ).optional()
    })
});
