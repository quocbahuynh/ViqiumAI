export function convertPromotionData(input) {
    // Extract unique productIds
    const uniqueProducts = [...new Set(input.productApply.map(p => p.productId))];
  
    // Extract promoteTarget + productGift only
    const compactProductApply = input.productApply.map(p => ({
      promoteTarget: p.promoteTarget,
      productGift: p.productGift
    }));
  
    // Keep only the first detailed productApply item
    const detailedProductApply = [input.productApply[0]];
  
    // Return new formatted object
    return {
      message: "Thành công",
      data: {
        ...input,
        product: uniqueProducts,
        productApply: detailedProductApply,
        compactProductApply: compactProductApply
      }
    };
  }
  