import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paystackReference",
      title: "Paystack Reference",
      type: "string",
    }),
    defineField({
      name: "paystackTransactionId",
      title: "Paystack Transaction ID",
      type: "string",
    }),
    defineField({
      name: "paystackCustomerId",
      title: "Paystack Customer ID",
      type: "string",
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "promoCode",
      type: "string",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Reference",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
            defineField({
              name: "price",
              title: "Price at Purchase",
              type: "number",
            }),
            defineField({
              name: "name",
              title: "Product Name",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Product Image",
              type: "image",
            }),
          ],
          preview: {
            select: {
              productTitle: "product.name",
              quantity: "quantity",
              price: "price",
              media: "product.image",
            },
            prepare(select) {
              return {
                title: select.productTitle || "Unknown Product",
                subtitle: `${select.quantity} x ${select.price}`,
                media: select.media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "text",
      rows: 3,
    }),

  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
    },
    prepare(select) {
      const orderId = select.orderId || "Unknown";
      const orderIdSnippet =
        orderId.length > 10
          ? `${orderId.slice(0, 5)}...${orderId.slice(-5)}`
          : orderId;
      return {
        title: `${select.name || "Order"} (${orderIdSnippet})`,
        subtitle: `${select.amount || 0} ${select.currency || "NGN"}, ${
          select.email || "No email"
        }`,
        media: BasketIcon,
      };
    },
  },
});