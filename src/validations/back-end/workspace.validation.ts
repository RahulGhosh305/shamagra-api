import Joi from "joi";
import { validate } from "@utils/validate";

// GET ALL PRODUCTS VALIDATION
const getProducts = validate({
  query: Joi.object({
    page: Joi.string().optional(),
    perPage: Joi.string().optional(),
  }),
});

// GET SINGLE PRODUCT VALIDATION
const getProduct = validate({
  params: Joi.object({
    _id: Joi.string().required(),
  }),
});

// ADD PRODUCT VALIDATION
const addProduct = validate({
  body: Joi.object({
    productCode: Joi.string().required(),
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    author: Joi.string().required(),
    descriptionShort: Joi.string().required().allow(null).allow(""),
    authorDescription: Joi.string().required().allow(null).allow(""),
    descriptionLong: Joi.string().required().allow(null).allow(""),
    originalPrice: Joi.number().required(),
    discountPrice: Joi.number().required(),
    discountPercentage: Joi.number(),
    averageScore: Joi.string(),
    totalReviews: Joi.string(),
    status: Joi.string().required(),
    categoryId: Joi.string().required(),
    format: Joi.string().required(),
    totalPages: Joi.string().required(),
    publishDate: Joi.date().required(),
    language: Joi.string().required(),
    originCountry: Joi.string().required(),
    dimensions: Joi.string().required(),
    weight: Joi.string().required(),
    sku: Joi.string().required(),
    features: Joi.array().items(Joi.string()),
    // images: Joi.array().items(Joi.string()).required(),
    photo: Joi.string().required().allow(null).allow(""),
    file: Joi.string().required().allow(null).allow(""),
    freeShippingThreshold: Joi.string(),
    returnPolicy: Joi.string(),
    secureShopping: Joi.string(),
  }),
});

// UPDATE PRODUCT VALIDATION
const updateProduct = validate({
  body: Joi.object({
    _id: Joi.string().required(),
    productCode: Joi.string().required(),
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    author: Joi.string().required(),
    descriptionShort: Joi.string().required().allow(null).allow(""),
    authorDescription: Joi.string().required().allow(null).allow(""),
    descriptionLong: Joi.string().required().allow(null).allow(""),
    originalPrice: Joi.number().required(),
    discountPrice: Joi.number().required(),
    discountPercentage: Joi.number(),
    averageScore: Joi.string(),
    totalReviews: Joi.string(),
    status: Joi.string().required(),
    categoryId: Joi.string().required(),
    format: Joi.string().required(),
    totalPages: Joi.string().required(),
    publishDate: Joi.date().required(),
    language: Joi.string().required(),
    originCountry: Joi.string().required(),
    dimensions: Joi.string().required(),
    weight: Joi.string().required(),
    sku: Joi.string().required(),
    features: Joi.array().items(Joi.string()),
    // images: Joi.array().items(Joi.string()).required(),
    photo: Joi.string().required().allow(null).allow(""),
    file: Joi.string().required().allow(null).allow(""),
    freeShippingThreshold: Joi.string(),
    returnPolicy: Joi.string(),
    secureShopping: Joi.string(),
  }),
});

// DELETE PRODUCT VALIDATION
const deleteProduct = validate({
  params: Joi.object({
    _id: Joi.string().required(),
  }),
});

// GET ALL ORDERS VALIDATION
const getOrders = validate({
  query: Joi.object({
    page: Joi.string().optional(),
    perPage: Joi.string().optional(),
  }),
});

// GET SINGLE ORDER VALIDATION
const getOrder = validate({
  params: Joi.object({
    _id: Joi.string().required(),
  }),
});

// ADD ORDER VALIDATION
const addOrder = validate({
  body: Joi.object({
    user: Joi.object({
      _id: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    }).required(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          productTitle: Joi.string().required(),
          productCode: Joi.string().required(),
          quantity: Joi.number().required(),
          unitPrice: Joi.number().required(),
          subtotal: Joi.number().required(),
        }),
      )
      .required(),
    shippingAddress: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      companyName: Joi.string().optional(),
      streetAddress: Joi.string().required(),
      apartment: Joi.string().optional(),
      city: Joi.string().required(),
      district: Joi.string().required(),
      thana: Joi.string().required(),
      country: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
    }).required(),
    pricing: Joi.object({
      subtotal: Joi.number().required(),
      shippingCharge: Joi.number().required(),
      taxAmount: Joi.number().required(),
      totalAmount: Joi.number().required(),
    }).required(),
    payment: Joi.object({
      method: Joi.string().valid("cod", "mobile", "bank").required(),
      status: Joi.string()
        .valid("pending", "completed", "failed", "refunded")
        .required(),
      transactionId: Joi.string().optional(),
    }).required(),
    orderNotes: Joi.string().optional(),
    orderStatus: Joi.string()
      .valid(
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      )
      .required(),
  }),
});

// UPDATE ORDER VALIDATION
const updateOrder = validate({
  params: Joi.object({
    _id: Joi.string().required(),
  }),
  body: Joi.object({
    user: Joi.object({
      _id: Joi.string().optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
    }).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().optional(),
          productTitle: Joi.string().optional(),
          productCode: Joi.string().optional(),
          quantity: Joi.number().optional(),
          unitPrice: Joi.number().optional(),
          subtotal: Joi.number().optional(),
        }),
      )
      .optional(),
    shippingAddress: Joi.object({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      companyName: Joi.string().optional(),
      streetAddress: Joi.string().optional(),
      apartment: Joi.string().optional(),
      city: Joi.string().optional(),
      district: Joi.string().optional(),
      thana: Joi.string().optional(),
      country: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      phone: Joi.string().optional(),
      email: Joi.string().email().optional(),
    }).optional(),
    pricing: Joi.object({
      subtotal: Joi.number().optional(),
      shippingCharge: Joi.number().optional(),
      taxAmount: Joi.number().optional(),
      totalAmount: Joi.number().optional(),
    }).optional(),
    payment: Joi.object({
      method: Joi.string().valid("cod", "mobile", "bank").optional(),
      status: Joi.string()
        .valid("pending", "completed", "failed", "refunded")
        .optional(),
      transactionId: Joi.string().optional(),
    }).optional(),
    orderNotes: Joi.string().optional(),
    orderStatus: Joi.string()
      .valid(
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      )
      .required(),
  }),
});

// CANCEL ORDER VALIDATION
const deleteOrder = validate({
  params: Joi.object({
    _id: Joi.string().required(),
  }),
});

export {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
};
