// Discount Service for handling discount code logic
class DiscountService {
  // Calculate discount amount based on discount code and item price
  static calculateDiscount(discountCode, itemPrice, itemType = 'service') {
    if (!discountCode || !discountCode.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: itemPrice,
        message: 'Invalid or inactive discount code'
      };
    }

    // Check if discount is applicable to this item type
    if (discountCode.applicableTo !== 'all' && 
        discountCode.applicableTo !== itemType + 's') {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: itemPrice,
        message: `Discount code not applicable to ${itemType}s`
      };
    }

    // Check minimum amount requirement
    if (discountCode.minAmount && itemPrice < discountCode.minAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: itemPrice,
        message: `Minimum amount of ₹${discountCode.minAmount.toLocaleString()} required`
      };
    }

    // Check if discount is still valid (date range)
    const now = new Date();
    const startDate = new Date(discountCode.startDate);
    const endDate = new Date(discountCode.endDate);
    
    if (now < startDate || now > endDate) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: itemPrice,
        message: 'Discount code has expired or is not yet active'
      };
    }

    // Check usage limit
    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: itemPrice,
        message: 'Discount code usage limit reached'
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    
    if (discountCode.type === 'percentage') {
      discountAmount = (itemPrice * discountCode.value) / 100;
    } else if (discountCode.type === 'fixed') {
      discountAmount = discountCode.value;
    }

    // Apply maximum discount limit if set
    if (discountCode.maxDiscount && discountAmount > discountCode.maxDiscount) {
      discountAmount = discountCode.maxDiscount;
    }

    // Ensure discount doesn't exceed the item price
    discountAmount = Math.min(discountAmount, itemPrice);

    const finalPrice = itemPrice - discountAmount;

    return {
      isValid: true,
      discountAmount,
      finalPrice,
      message: `Discount applied: ${discountCode.type === 'percentage' ? discountCode.value + '%' : '₹' + discountCode.value.toLocaleString()}`
    };
  }

  // Validate discount code without applying it
  static validateDiscountCode(discountCode) {
    if (!discountCode) {
      return {
        isValid: false,
        message: 'Discount code not found'
      };
    }

    if (!discountCode.isActive) {
      return {
        isValid: false,
        message: 'Discount code is inactive'
      };
    }

    const now = new Date();
    const startDate = new Date(discountCode.startDate);
    const endDate = new Date(discountCode.endDate);
    
    if (now < startDate) {
      return {
        isValid: false,
        message: `Discount code is valid from ${startDate.toLocaleDateString()}`
      };
    }

    if (now > endDate) {
      return {
        isValid: false,
        message: 'Discount code has expired'
      };
    }

    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      return {
        isValid: false,
        message: 'Discount code usage limit reached'
      };
    }

    return {
      isValid: true,
      message: 'Discount code is valid'
    };
  }

  // Get applicable discount codes for an item type
  static getApplicableDiscountCodes(discountCodes, itemType = 'service') {
    const now = new Date();
    
    return discountCodes.filter(code => {
      // Check if code is active
      if (!code.isActive) return false;

      // Check if code is applicable to this item type
      if (code.applicableTo !== 'all' && code.applicableTo !== itemType + 's') {
        return false;
      }

      // Check date range
      const startDate = new Date(code.startDate);
      const endDate = new Date(code.endDate);
      if (now < startDate || now > endDate) return false;

      // Check usage limit
      if (code.usageLimit && code.usedCount >= code.usageLimit) return false;

      return true;
    });
  }

  // Format discount display text
  static formatDiscountText(discountCode) {
    if (!discountCode) return '';
    
    if (discountCode.type === 'percentage') {
      return `${discountCode.value}% OFF`;
    } else {
      return `₹${discountCode.value.toLocaleString()} OFF`;
    }
  }

  // Increment usage count for a discount code
  static incrementUsage(discountCode) {
    if (discountCode) {
      discountCode.usedCount = (discountCode.usedCount || 0) + 1;
    }
  }
}

export default DiscountService;
