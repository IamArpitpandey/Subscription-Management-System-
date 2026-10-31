// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

async function main() {
  console.log("🌱 Seeding Brightloop database...");

  // Clear existing data (order matters due to relations)
  await prisma.paymentAllocation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscriptionLine.deleteMany();
  await prisma.subscriptionHistory.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.quotationLine.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.quotationTemplate.deleteMany();
  await prisma.planProduct.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.tax.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@brightloop.com",
      password: hashPassword("Admin@123"),
      role: "ADMIN",
    },
  });

  const staff1 = await prisma.user.create({
    data: {
      name: "Sarah Staff",
      email: "staff@brightloop.com",
      password: hashPassword("Staff@123"),
      role: "STAFF",
    },
  });

  const staff2 = await prisma.user.create({
    data: {
      name: "Mike Staff",
      email: "mike@brightloop.com",
      password: hashPassword("Staff@123"),
      role: "STAFF",
    },
  });

  // --- Customers ---
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+91 98765 43210",
        company: "Acme Corporation",
        address: "123 MG Road, Bangalore, Karnataka 560001",
        status: "ACTIVE",
        createdBy: admin.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "TechSolutions Pvt Ltd",
        email: "hello@techsolutions.in",
        phone: "+91 91234 56789",
        company: "TechSolutions Pvt Ltd",
        address: "456 Park Street, Kolkata, West Bengal 700016",
        status: "ACTIVE",
        createdBy: admin.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Global Traders",
        email: "ops@globaltraders.in",
        phone: "+91 99887 76655",
        company: "Global Traders",
        address: "789 Connaught Place, New Delhi 110001",
        status: "ACTIVE",
        createdBy: staff1.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "SoftWorks LLP",
        email: "billing@softworks.in",
        phone: "+91 98765 12345",
        company: "SoftWorks LLP",
        address: "321 Brigade Road, Bangalore, Karnataka 560025",
        status: "ACTIVE",
        createdBy: staff1.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "CloudNine Services",
        email: "support@cloudnine.in",
        phone: "+91 91234 98765",
        company: "CloudNine Services",
        address: "654 Anna Salai, Chennai, Tamil Nadu 600002",
        status: "INACTIVE",
        createdBy: staff2.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Pixel Craft Studio",
        email: "hi@pixelcraft.in",
        phone: "+91 99887 12345",
        company: "Pixel Craft Studio",
        address: "987 Linking Road, Mumbai, Maharashtra 400050",
        status: "ACTIVE",
        createdBy: admin.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "DataFlow Systems",
        email: "info@dataflow.in",
        phone: "+91 98765 67890",
        company: "DataFlow Systems",
        address: "147 Salt Lake, Kolkata, West Bengal 700064",
        status: "ACTIVE",
        createdBy: staff1.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Zenith Retail",
        email: "accounts@zenithretail.in",
        phone: "+91 91234 11223",
        company: "Zenith Retail",
        address: "258 Commercial Street, Bangalore, Karnataka 560001",
        status: "ACTIVE",
        createdBy: staff2.id,
      },
    }),
  ]);

  // --- Products ---
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Odoo ERP Base",
        description: "Core Odoo ERP platform with CRM, Sales, Inventory",
        type: "SERVICE",
        salesPrice: 4999,
        costPrice: 2000,
        notes: "Base ERP module - required for all Odoo subscriptions",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Odoo Accounting",
        description: "Accounting and invoicing module",
        type: "SERVICE",
        salesPrice: 1999,
        costPrice: 800,
        notes: "Add-on accounting module",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Odoo CRM",
        description: "Customer relationship management module",
        type: "SERVICE",
        salesPrice: 1499,
        costPrice: 600,
        notes: "CRM module for lead and pipeline management",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Odoo Website Builder",
        description: "Drag-and-drop website builder",
        type: "SERVICE",
        salesPrice: 2499,
        costPrice: 1000,
        notes: "Website and e-commerce builder",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Odoo Implementation",
        description: "One-time implementation and setup service",
        type: "GOODS",
        salesPrice: 25000,
        costPrice: 10000,
        notes: "Professional implementation services",
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Odoo Support Annual",
        description: "Annual support and maintenance contract",
        type: "SERVICE",
        salesPrice: 5999,
        costPrice: 2500,
        notes: "Priority email and phone support",
        isActive: true,
      },
    }),
  ]);

  // --- Product Variants ---
  await prisma.productVariant.create({
    data: {
      productId: products[0].id,
      name: "₹560 Variant Addition",
      priceAddition: 560,
      sku: "ODOO-BASE-V1",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[0].id,
      name: "Extra User Seat",
      priceAddition: 500,
      sku: "ODOO-BASE-USER",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[1].id,
      name: "Multi-Currency",
      priceAddition: 800,
      sku: "ODOO-ACC-MC",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[2].id,
      name: "Pipeline Automation",
      priceAddition: 600,
      sku: "ODOO-CRM-AUTO",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[3].id,
      name: "E-commerce Store",
      priceAddition: 1200,
      sku: "ODOO-WEB-ECOM",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[4].id,
      name: "Premium Setup",
      priceAddition: 5000,
      sku: "ODOO-IMPL-PREM",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[5].id,
      name: "24x7 Support",
      priceAddition: 3000,
      sku: "ODOO-SUPPORT-247",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[0].id,
      name: "Advanced Reporting",
      priceAddition: 900,
      sku: "ODOO-BASE-REPORT",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[1].id,
      name: "Tax Automation",
      priceAddition: 700,
      sku: "ODOO-ACC-TAX",
      isActive: true,
    },
  });
  await prisma.productVariant.create({
    data: {
      productId: products[2].id,
      name: "Lead Scoring",
      priceAddition: 400,
      sku: "ODOO-CRM-SCORE",
      isActive: true,
    },
  });

  // --- Taxes ---
  const gst18 = await prisma.tax.create({
    data: {
      name: "GST 18%",
      rate: 18,
      isActive: true,
      createdBy: admin.id,
    },
  });
  const gst28 = await prisma.tax.create({
    data: {
      name: "GST 28%",
      rate: 28,
      isActive: true,
      createdBy: admin.id,
    },
  });
  const gst5 = await prisma.tax.create({
    data: {
      name: "GST 5%",
      rate: 5,
      isActive: true,
      createdBy: admin.id,
    },
  });

  // --- Plans ---
  const now = new Date();
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        name: "Odoo Starter Monthly",
        billingCycle: "MONTHLY",
        price: 4999,
        minQuantity: 1,
        startDate: now,
        endDate: null,
        availabilityFrom: now,
        availabilityTo: null,
        autoClose: false,
        status: "ACTIVE",
        description: "Monthly Odoo ERP starter plan for small businesses",
        createdBy: admin.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Odoo Professional Yearly",
        billingCycle: "YEARLY",
        price: 49999,
        minQuantity: 1,
        startDate: now,
        endDate: null,
        availabilityFrom: now,
        availabilityTo: null,
        autoClose: false,
        status: "ACTIVE",
        description: "Yearly Odoo Professional plan with all core modules",
        createdBy: admin.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Odoo Basic Weekly",
        billingCycle: "WEEKLY",
        price: 1499,
        minQuantity: 1,
        startDate: now,
        endDate: null,
        availabilityFrom: now,
        availabilityTo: null,
        autoClose: true,
        status: "ACTIVE",
        description: "Weekly billing plan for short-term projects",
        createdBy: admin.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Odoo Enterprise Daily",
        billingCycle: "DAILY",
        price: 299,
        minQuantity: 1,
        startDate: now,
        endDate: null,
        availabilityFrom: now,
        availabilityTo: null,
        autoClose: false,
        status: "ACTIVE",
        description: "Daily billing for enterprise-scale usage",
        createdBy: admin.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Odoo Growth Monthly",
        billingCycle: "MONTHLY",
        price: 9999,
        minQuantity: 2,
        startDate: now,
        endDate: null,
        availabilityFrom: now,
        availabilityTo: null,
        autoClose: false,
        status: "ACTIVE",
        description: "Growth plan with multiple user seats",
        createdBy: admin.id,
      },
    }),
  ]);

  // Link products to plans
  await prisma.planProduct.create({
    data: { planId: plans[0].id, productId: products[0].id, quantity: 1 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[0].id, productId: products[1].id, quantity: 1 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[1].id, productId: products[0].id, quantity: 1 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[1].id, productId: products[2].id, quantity: 1 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[1].id, productId: products[3].id, quantity: 1 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[2].id, productId: products[0].id, quantity: 1 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[3].id, productId: products[0].id, quantity: 1 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[4].id, productId: products[0].id, quantity: 2 },
  });
  await prisma.planProduct.create({
    data: { planId: plans[4].id, productId: products[1].id, quantity: 1 },
  });

  // --- Discounts ---
  await prisma.discount.create({
    data: {
      name: "Welcome 10% Off",
      type: "PERCENTAGE",
      value: 10,
      minPurchase: 5000,
      minQuantity: 1,
      validFrom: now,
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      usageCount: 0,
      isActive: true,
      createdBy: admin.id,
    },
  });
  await prisma.discount.create({
    data: {
      name: "₹500 Fixed Off",
      type: "FIXED",
      value: 500,
      minPurchase: 3000,
      minQuantity: 1,
      validFrom: now,
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 50,
      usageCount: 0,
      isActive: true,
      createdBy: admin.id,
    },
  });

  // --- Subscriptions ---
  const sub1 = await prisma.subscription.create({
    data: {
      number: "SB-2026-0001",
      customerId: customers[0].id,
      planId: plans[0].id,
      status: "ACTIVE",
      startDate: new Date("2026-01-01"),
      endDate: null,
      nextBillingDate: new Date("2026-02-01"),
      autoClose: false,
      quantity: 1,
      notes: "Monthly Odoo ERP for Acme",
      createdBy: admin.id,
    },
  });
  const sub2 = await prisma.subscription.create({
    data: {
      number: "SB-2026-0002",
      customerId: customers[1].id,
      planId: plans[1].id,
      status: "ACTIVE",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2027-01-15"),
      nextBillingDate: new Date("2027-01-15"),
      autoClose: false,
      quantity: 1,
      notes: "Yearly Professional for TechSolutions",
      createdBy: staff1.id,
    },
  });
  const sub3 = await prisma.subscription.create({
    data: {
      number: "SB-2026-0003",
      customerId: customers[2].id,
      planId: plans[2].id,
      status: "PAUSED",
      startDate: new Date("2026-02-01"),
      endDate: null,
      nextBillingDate: null,
      autoClose: true,
      quantity: 1,
      notes: "Weekly plan paused for Global Traders",
      createdBy: staff1.id,
    },
  });
  const sub4 = await prisma.subscription.create({
    data: {
      number: "SB-2026-0004",
      customerId: customers[3].id,
      planId: plans[0].id,
      status: "ACTIVE",
      startDate: new Date("2026-03-01"),
      endDate: null,
      nextBillingDate: new Date("2026-04-01"),
      autoClose: false,
      quantity: 1,
      notes: "Monthly starter for SoftWorks",
      createdBy: staff2.id,
    },
  });
  const sub5 = await prisma.subscription.create({
    data: {
      number: "SB-2026-0005",
      customerId: customers[4].id,
      planId: plans[4].id,
      status: "CLOSED",
      startDate: new Date("2025-10-01"),
      endDate: new Date("2026-03-31"),
      nextBillingDate: null,
      autoClose: true,
      quantity: 2,
      notes: "Closed growth plan for CloudNine",
      createdBy: staff2.id,
    },
  });

  // Subscription lines
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub1.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 1,
      unitPrice: 4999,
      total: 4999,
    },
  });
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub1.id,
      productId: products[1].id,
      name: "Odoo Accounting",
      quantity: 1,
      unitPrice: 1999,
      total: 1999,
    },
  });
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub2.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 1,
      unitPrice: 4999,
      total: 4999,
    },
  });
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub2.id,
      productId: products[2].id,
      name: "Odoo CRM",
      quantity: 1,
      unitPrice: 1499,
      total: 1499,
    },
  });
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub2.id,
      productId: products[3].id,
      name: "Odoo Website Builder",
      quantity: 1,
      unitPrice: 2499,
      total: 2499,
    },
  });
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub4.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 1,
      unitPrice: 4999,
      total: 4999,
    },
  });
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub5.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 2,
      unitPrice: 4999,
      total: 9998,
    },
  });
  await prisma.subscriptionLine.create({
    data: {
      subscriptionId: sub5.id,
      productId: products[1].id,
      name: "Odoo Accounting",
      quantity: 1,
      unitPrice: 1999,
      total: 1999,
    },
  });

  // Subscription history
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId: sub1.id,
      action: "STATUS_CHANGE",
      fromStatus: "DRAFT",
      toStatus: "ACTIVE",
      changedBy: admin.id,
      note: "Activated subscription",
    },
  });
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId: sub3.id,
      action: "PAUSE",
      fromStatus: "ACTIVE",
      toStatus: "PAUSED",
      changedBy: staff1.id,
      note: "Paused per customer request",
    },
  });
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId: sub5.id,
      action: "CLOSE",
      fromStatus: "ACTIVE",
      toStatus: "CLOSED",
      changedBy: staff2.id,
      note: "Subscription completed",
    },
  });

  // --- Invoices ---
  const inv1 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0001",
      customerId: customers[0].id,
      subscriptionId: sub1.id,
      userId: admin.id,
      status: "PAID",
      issueDate: new Date("2026-01-01"),
      dueDate: new Date("2026-01-10"),
      periodFrom: new Date("2026-01-01"),
      periodTo: new Date("2026-01-31"),
      subtotal: 6998,
      taxTotal: 1259.64,
      discountTotal: 0,
      grandTotal: 8257.64,
      paidAmount: 8257.64,
      notes: "January 2026 billing",
      userId: admin.id,
    },
  });
  const inv2 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0002",
      customerId: customers[0].id,
      subscriptionId: sub1.id,
      userId: admin.id,
      status: "CONFIRMED",
      issueDate: new Date("2026-02-01"),
      dueDate: new Date("2026-02-10"),
      periodFrom: new Date("2026-02-01"),
      periodTo: new Date("2026-02-28"),
      subtotal: 6998,
      taxTotal: 1259.64,
      discountTotal: 0,
      grandTotal: 8257.64,
      paidAmount: 0,
      notes: "February 2026 billing - overdue soon",
      userId: admin.id,
    },
  });
  const inv3 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0003",
      customerId: customers[1].id,
      subscriptionId: sub2.id,
      userId: staff1.id,
      status: "PAID",
      issueDate: new Date("2026-01-15"),
      dueDate: new Date("2026-01-30"),
      periodFrom: new Date("2026-01-15"),
      periodTo: new Date("2027-01-14"),
      subtotal: 8997,
      taxTotal: 1619.46,
      discountTotal: 0,
      grandTotal: 10616.46,
      paidAmount: 10616.46,
      notes: "Yearly Professional - paid in full",
      userId: staff1.id,
    },
  });
  const inv4 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0004",
      customerId: customers[2].id,
      subscriptionId: sub3.id,
      userId: staff1.id,
      status: "DRAFT",
      issueDate: new Date("2026-02-01"),
      dueDate: new Date("2026-02-08"),
      periodFrom: new Date("2026-02-01"),
      periodTo: new Date("2026-02-07"),
      subtotal: 4999,
      taxTotal: 899.82,
      discountTotal: 0,
      grandTotal: 5898.82,
      paidAmount: 0,
      notes: "Weekly draft invoice",
      userId: staff1.id,
    },
  });
  const inv5 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0005",
      customerId: customers[3].id,
      subscriptionId: sub4.id,
      userId: staff2.id,
      status: "OVERDUE",
      issueDate: new Date("2026-03-01"),
      dueDate: new Date("2026-03-10"),
      periodFrom: new Date("2026-03-01"),
      periodTo: new Date("2026-03-31"),
      subtotal: 4999,
      taxTotal: 899.82,
      discountTotal: 0,
      grandTotal: 5898.82,
      paidAmount: 0,
      notes: "Overdue March invoice",
      userId: staff2.id,
    },
  });

  // Invoice lines
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv1.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 1,
      unitPrice: 4999,
      taxRate: 18,
      taxAmount: 899.82,
      discountAmount: 0,
      total: 5898.82,
    },
  });
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv1.id,
      productId: products[1].id,
      name: "Odoo Accounting",
      quantity: 1,
      unitPrice: 1999,
      taxRate: 18,
      taxAmount: 359.82,
      discountAmount: 0,
      total: 2358.82,
    },
  });
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv2.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 1,
      unitPrice: 4999,
      taxRate: 18,
      taxAmount: 899.82,
      discountAmount: 0,
      total: 5898.82,
    },
  });
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv2.id,
      productId: products[1].id,
      name: "Odoo Accounting",
      quantity: 1,
      unitPrice: 1999,
      taxRate: 18,
      taxAmount: 359.82,
      discountAmount: 0,
      total: 2358.82,
    },
  });
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv3.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 1,
      unitPrice: 4999,
      taxRate: 18,
      taxAmount: 899.82,
      discountAmount: 0,
      total: 5898.82,
    },
  });
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv3.id,
      productId: products[2].id,
      name: "Odoo CRM",
      quantity: 1,
      unitPrice: 1499,
      taxRate: 18,
      taxAmount: 269.82,
      discountAmount: 0,
      total: 1768.82,
    },
  });
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv3.id,
      productId: products[3].id,
      name: "Odoo Website Builder",
      quantity: 1,
      unitPrice: 2499,
      taxRate: 18,
      taxAmount: 449.82,
      discountAmount: 0,
      total: 2948.82,
    },
  });
  await prisma.invoiceLine.create({
    data: {
      invoiceId: inv5.id,
      productId: products[0].id,
      name: "Odoo ERP Base",
      quantity: 1,
      unitPrice: 4999,
      taxRate: 18,
      taxAmount: 899.82,
      discountAmount: 0,
      total: 5898.82,
    },
  });

  // --- Payments ---
  const pay1 = await prisma.payment.create({
    data: {
      invoiceId: inv1.id,
      amount: 8257.64,
      method: "BANK_TRANSFER",
      reference: "NEFT1234567890",
      paymentDate: new Date("2026-01-05"),
      notes: "Full payment for January",
      createdBy: admin.id,
    },
  });
  const pay2 = await prisma.payment.create({
    data: {
      invoiceId: inv3.id,
      amount: 10616.46,
      method: "UPI",
      reference: "UPI9876543210",
      paymentDate: new Date("2026-01-20"),
      notes: "Yearly plan payment via UPI",
      createdBy: staff1.id,
    },
  });

  // Payment allocations
  await prisma.paymentAllocation.create({
    data: {
      paymentId: pay1.id,
      invoiceId: inv1.id,
      amount: 8257.64,
    },
  });
  await prisma.paymentAllocation.create({
    data: {
      paymentId: pay2.id,
      invoiceId: inv3.id,
      amount: 10616.46,
    },
  });

  console.log("✅ Seed complete!");
  console.log("\n📋 Demo Credentials:");
  console.log("  Admin:   admin@brightloop.com / Admin@123");
  console.log("  Staff:   staff@brightloop.com / Staff@123");
  console.log("  Staff2:  mike@brightloop.com / Staff@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
