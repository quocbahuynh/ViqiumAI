const authUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
export const apiLinks = {

    auth: {
        login: `${authUrl}/api/auth/login`,
        register: `${authUrl}/api/auth/register`,
        enterCode: `${authUrl}/api/auth/verify-account`,
        resendCode: `${authUrl}/api/auth/resend-code`,
        forgetPwd: `${authUrl}/api/auth/forget-password`,
        verifyNewPwd: `${authUrl}/api/auth/verify-newpassword`,
        refresh: `${authUrl}/api/auth/refresh-token`,
        plan: `${authUrl}/api/profile/plan`,
    },
    profile: {
        baseProfile: `${authUrl}/api/profile`
    },
    profession: {
        list: `${authUrl}/api/profession/professions`
    },
    promote: {
        types: `${authUrl}/api/promotion/types`,
        createPromotionDiscount:`${authUrl}/api/promotion/discount-promotion`,
        createPromotionCombo:`${authUrl}/api/promotion/combo-promotion`,
        createPromotionGift:`${authUrl}/api/promotion/gift-promotion`,
        createPromotionBulk:`${authUrl}/api/promotion/bluk-promotion`,
        getDiscountAndCombo:`${authUrl}/api/promotion/discount-and-combo-promotion`,
        delete:`${authUrl}/api/promotion`
    },
    project: {
        disconnectPage: `${authUrl}/api/project/id`,
        pagesInfo: `${authUrl}/api/project/id`,
        pagesList: `${authUrl}/api/project/id`,
        connectFanpage: `${authUrl}/api/project/id`,
        getBaseInformation: `${authUrl}/api/project/id/base-information`,
        updateBaseInformation: `${authUrl}/api/project/id/base-information`,
        list: `${authUrl}/api/project/list`,
        createBase: `${authUrl}/api/project`,
        single: `${authUrl}/api/project/id`

        
    },
    memory:`${authUrl}/api/chatbot/knowledge`,
    image:`${authUrl}/api/photo/upload`,
    product: {
        getClassification: `${authUrl}/api/classification/recommend`,
        getVariants:`${authUrl}/api/classification/value-recommend`,
        addProduct: `${authUrl}/api/product`,
        getProducts: `${authUrl}/api/product/list`,
        getProductById: `${authUrl}/api/product`,
        updateProductById: `${authUrl}/api/product`,
        deleteProductById: `${authUrl}/api/product`,
        getAttributes: `${authUrl}/api/product/attributes/projectid`,
        // getVariants: `${authUrl}/api/product/variants/projectid`,
        // addVariants: `${authUrl}/api/product/variant/projectid`,
        // updateVariants: `${authUrl}/api/product/variant/projectid`,
        // deleteVariants: `${authUrl}/api/product/variant`,
    },
    modelAI:{
        getModel: `${authUrl}/api/project/id/ai-config`
    }
    ,
    chat:{
        sendMessage:`${authUrl}/api/chatbot/ask`,
        getHistory:`${authUrl}/api/chatbot/history`,
        deleteChat:`${authUrl}/api/chatbot/delete-history`,
    },
    voucher:`${authUrl}/api/promotion/list`,
    orders:{
        getListOrders:`${authUrl}/api/order/list`,
        readOrder:`${authUrl}/api/order/read`,
        deleteOrder:`${authUrl}/api/order/delete`,

    },
    statistic: {
        numberRate: `${authUrl}/api/statistic/order-rate`,
        converstation: `${authUrl}/api/statistic/topics`,
        order: `${authUrl}/api/statistic/last-7-days`
    },
    chatbox: {
        getChatBoxByProjectId: `${authUrl}/api/chatbox`,
        update: `${authUrl}/api/chatbox`
    }
}

export const authUrls = Object.values(apiLinks.auth);