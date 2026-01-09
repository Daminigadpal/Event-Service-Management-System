import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true
    },
    booking: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Booking",
      required: [true, 'Booking ID is required']
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Customer ID is required']
    },
    invoiceType: {
      type: String,
      enum: ['quotation', 'proforma', 'final'],
      required: [true, 'Invoice type is required'],
      default: 'final'
    },
    items: [{
      description: {
        type: String,
        required: [true, 'Item description is required']
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1
      },
      unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price must be positive']
      },
      total: {
        type: Number,
        required: [true, 'Item total is required']
      }
    }],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal must be non-negative']
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate must be non-negative']
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, 'Tax amount must be non-negative']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be non-negative']
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'pending', 'partial', 'paid', 'overdue', 'cancelled'],
      default: 'draft'
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    paidDate: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    terms: {
      type: String,
      maxlength: [500, 'Terms cannot exceed 500 characters']
    },
    // Payment tracking
    advancePaid: {
      type: Number,
      default: 0,
      min: [0, 'Advance paid must be non-negative']
    },
    balancePaid: {
      type: Number,
      default: 0,
      min: [0, 'Balance paid must be non-negative']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Index for efficient querying
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ booking: 1 });
invoiceSchema.index({ customer: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ issueDate: -1 });

// Pre-save hook to calculate totals
invoiceSchema.pre('save', function(next) {
  // Calculate subtotal if items exist
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  }
  
  // Calculate tax amount
  this.taxAmount = this.subtotal * (this.taxRate / 100);
  
  // Calculate total amount
  this.totalAmount = this.subtotal + this.taxAmount;
  
  // Update payment status
  const totalPaid = this.advancePaid + this.balancePaid;
  if (totalPaid >= this.totalAmount) {
    this.paymentStatus = 'paid';
    this.status = 'paid';
    this.paidDate = new Date();
  } else if (totalPaid > 0) {
    this.paymentStatus = 'partial';
    this.status = 'partial';
  } else {
    this.paymentStatus = 'pending';
    if (this.status === 'draft') {
      this.status = 'sent';
    }
  }
  
  next();
});

// Generate invoice number
invoiceSchema.pre('save', function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV-${year}${month}-${random}`;
  }
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
