const { gql } = require("apollo-server-express");
const mongoose = require("mongoose");

const Customer = require("./models/customers").Customers;
const Product = require("./models/products").Products;
const Review = require("./models/reviews").Reviews;
const Transaction = require("./models/transactions").Transactions;
const Vendor = require("./models/vendors").Vendors;
const Purchase = require("./models/purchases").Purchases;
const Admin = require("./models/admins").Admins;

const typeDefs = gql`
  type Customer {
    id: ID!
    phone_number: String
    name: String
    account_balance: Int
    starred: [Product]
    basket: [Purchase]
    photo: String
    gender: Gender
    purchases: [Purchase]
    subscriptions: [Vendor]
    createdAt: String
  }

  type Admin {
    id: ID!
    username: String
    first_name: String
    last_name: String
    account_balance: Int
    password: String
    photo: String
    createdAt: String
    phone_number: String
    email: String
    monthly_reports: Boolean
  }

  type Purchase {
    product: Product
    quantity: Int
    size: String
    id: ID
    pickup: Vendor
    delivered: Boolean
    customer: Customer
    createdAt: String
    updatedAt: String
    package_id: String
  }

  type Product {
    id: ID!
    vendor: Vendor
    createdAt: String
    updatedAt: String
    photos: [String]
    name: String
    gender: Gender
    category: Category
    sizes: [SizesSchema]
    price: Int
    description: String
    quantity: Int
    liked_by: [Customer]
    keywords: [String]
    buyers: [Purchase]
    reviews: [Review]
  }

  enum Gender {
    MALE
    FEMALE
    UNISEX
  }

  enum Category {
    T_SHIRTS
    SHIRTS
    TROUSERS
    SHORTS
    HOODIES
    JACKETS
    SNEAKERS
    BOOTS
    SANDALS
    TOPS
    DRESSES
    SUITS
    COATS
    SOCKS
    INNERWEARS
    HATS
    SUNGLASSES
    OTHERS
  }

  type Review {
    id: ID!
    product: Product
    message: String
    customer: Customer
    createdAt: String
    updatedAt: String
  }

  type Transaction {
    id: ID!
    transaction_code: String
    amount: Float
    type: TransactionType
    name: String
  }

  enum TransactionType {
    deposit
    withdrawal
  }

  type Vendor {
    id: ID!
    stall_name: String
    description: String
    photo: String
    id_number: String
    account_balance: Float
    escrow: Float
    ratings: [Int]
    phone_number: String
    createdAt: String

    subscribers: [Customer]
    products: [Product]
    sales: [Purchase]
  }

  type Query {
    getPurchases: [Purchase]
    getCustomers: [Customer]
    getCustomer(id: ID!): Customer
    test(id: ID!): [Product]
    getProducts: [Product]
    getAdmins: [Admin]
    getProduct: Product
    getReviews: [Review]
    getVendors: [Vendor]
  }

  type SizesSchema {
    size: String
    quantity: Int
  }

  type Mutation {
    addAdmin(
      phone_number: String
      username: String!
      first_name: String!
      last_name: String!
      password: String!
      photo: String
      email: String
    ): Admin
    addCustomer(phone_number: String!, name: String!, gender: Gender): Customer
    addProduct(
      vendor: String!
      name: String!
      gender: Gender!
      category: Category!
      sizes: [String]!
      price: Int!
      description: String
      keywords: [String]
    ): Product
    addVendor(
      stall_name: String!
      description: String!
      phone_number: String!
      id_number: String!
      password: String
      photo: String
    ): Vendor
    addReview(product: String!, message: String!, customer: String!): Review
    makeSale(purchase_ids: [String!], pickup: String!): String
    markDelivered(purchase_id: String): Purchase
    subscribe(customer: String!, vendor: String!): String
    star(customer: String!, product: String!): String
    addToCart(customer: String!, product: String!, size: String!): Purchase
    like(customer: String!, product: String!): String
  }
`;

const resolvers = {
  Query: {
    getAdmins: (parent, args) => {
      return Admin.find();
    },

    getPurchases: (parent, args) => {
      return Purchase.find();
    },

    getCustomers: (parent, args) => {
      return Customer.find({}).populate("starred").populate("subscriptions");
    },

    getCustomer: (parent, args) => {
      return Customer.findById(args.id)
        .populate("starred")
        .populate("subscriptions");
    },

    getProducts: (parent, args) => {
      return Product.find({})
        .populate("vendor")
        .populate("liked_by")
        .populate("buyers.customer");
    },

    getProduct: (parent, args) => {
      return Product.findById(args.id)
        .populate("vendor")
        .populate("liked_by")
        .populate("buyers.customer");
    },

    getReviews: (parent, args) => {
      return Review.find({}).populate("product").populate("customer");
    },

    getVendors: (parent, args) => {
      return Vendor.find({});
    },

    test: (parent, args) => {
      return Product.find({ "buyers.customer": args.id });
    },
  },

  Customer: {
    purchases(parent) {
      return Purchase.find({ customer: parent.id });
    },
  },

  Product: {
    reviews(parent) {
      return Review.find({ product: parent.id })
        .populate("customer")
        .populate("product");
    },
    vendor(parent) {
      return Vendor.findOne();
    },
    buyers(parent) {
      return Purchase.find({ product: parent.id }).populate("customer");
    },
  },

  Purchase: {
    product(parent) {
      return Product.findOne();
    },
    pickup(parent) {
      return Vendor.findOne();
    },
  },

  Vendor: {
    subscribers(parent) {
      return Customer.find({ subscriptions: parent.id });
    },
    products(parent) {
      return Product.find({ vendor: parent.id });
    },
    sales(parent) {
      return Purchase.find({ "product.price": 2300 })
        .populate("product")
        .exec();
    },
  },

  Mutation: {
    //super admin adding an admin
    addAdmin: (parent, args) => {
      let admin = new Admin({
        username: args.username,
        first_name: args.first_name,
        last_name: args.last_name,
        password: args.password,
        photo: args.photo,
        phone_number: args.phone_number,
        email: args.email,
      });
      return admin.save();
    },

    // customer signing up
    addCustomer: (parent, args) => {
      let customer = new Customer({
        name: args.name,
        phone_number: args.phone_number,
        gender: args.gender,
      });
      return customer.save();
    },

    // vendor signing up
    addVendor: async (parent, args) => {
      let vendor = new Vendor({
        stall_name: args.stall_name,
        phone_number: args.phone_number,
        description: args.description,
        id_number: args.id_number,
        password: args.password,
        photo: args.photo,
      });
      return vendor.save();
    },

    // customer review product
    addReview: (parent, args) => {
      let review = new Review({
        product: args.product,
        message: args.message,
        customer: args.customer,
      });
      return review.save();
    },

    //vendor adding product
    addProduct: (parent, args) => {
      const {
        vendor,
        name,
        gender,
        category,
        sizes,
        price,
        description,
        keywords,
      } = args;

      let sizes_arr = [];

      for (let i = 0; i < sizes.length; i = i + 2) {
        let sizes_obj = {
          size: sizes[i],
          quantity: parseInt(sizes[i + 1]),
        };
        sizes_arr.push(sizes_obj);
      }

      console.log(sizes_arr);

      let product = new Product({
        vendor,
        name,
        gender,
        category,
        price,
        sizes: sizes_arr,
        description,
        keywords,
      });
      return product.save();
    },

    // customer pays for products
    makeSale: async (parent, args) => {
      const { purchase_ids, pickup } = args;

      const purchase_ids_arr = purchase_ids;

      let customer = "";
      let vendors = [];

      let total_price = 0;

      purchase_ids_arr.forEach((id) => {
        Purchase.findById(id)
          .populate("product")
          .populate("customer")
          .then((purchase) => {
            if (purchase == null) console.log(`Purchase ${id} not found`);

            // if (purchase.quantity > purchase.product.sizes[purchase.size].quantity) console.log(`Quantities of purchase id ${id} are > than number available : /nAvailable-> ${purchase.product.sizes[purchase.size].quantity} /nRequired -> ${purchase.quantity}`)

            total_price =
              purchase.product.price * purchase.quantity + total_price;
            customer = purchase.customer._id;

            let vendor = {
              id: purchase.product.vendor,
              amount: purchase.product.price * purchase.quantity,
            };

            vendors.push(vendor);
          })
          .catch((err) => {
            return err;
          });
      });
      await new Promise((r) => setTimeout(r, 100));

      console.log(total_price);
      console.log(vendors);
      console.log(customer);

      Customer.findById(customer)
        .then((customer) => {
          if (customer == null) console.log("Customer not found");

          if (customer.account_balance < total_price) {
            console.log("Insufficient funds to make all purchases");
          }

          customer.account_balance = customer.account_balance - total_price;
          customer.save();
        })
        .catch((err) => {
          return err;
        });

      purchase_ids_arr.forEach((id) => {
        Purchase.findById(id)
          .populate("product")
          .then((purchase) => {
            Product.findById(purchase.product._id).then((product) => {
              product.sizes.forEach((size) => {
                if (size.size == purchase.size) {
                  size.quantity = size.quantity - purchase.quantity;
                }
              });
              product.save();
            });
          })
          .catch((err) => {
            return err;
          });
      });

      await new Promise((r) => setTimeout(r, 100));

      vendors.forEach((vendor) => {
        Vendor.findById(vendor.id)
          .then((returned_vendor) => {
            returned_vendor.escrow =
              returned_vendor.escrow + vendor.amount * 0.95;
            returned_vendor.save();
          })
          .catch((err) => {
            return err;
          });
      });

      Purchase.updateMany(
        { _id: { $in: purchase_ids_arr } },
        {
          pickup,
          package_id: new Date().getTime(),
        }
      )
        .then((docs) => {
          console.log(docs);
        })
        .catch((err) => err);
    },

    // vendor brings item to packaging site
    markDelivered: (parent, args) => {
      const { purchase_id } = args;

      return Purchase.findById(purchase_id)
        .populate("product")
        .then((purchase) => {
          purchase.delivered = true;
          Vendor.findById(purchase.product.vendor).then((vendor) => {
            console.log(vendor);
            let amount = purchase.product.price * 0.95 * purchase.quantity;
            vendor.escrow = vendor.escrow - amount;
            vendor.account_balance = +amount;

            vendor.save();
          });
          purchase.save();
        });
    },

    // customer subscribes to vendor
    subscribe: (parent, args) => {
      const { customer, vendor } = args;

      return Customer.findById(customer).then((customer) => {
        if (customer == null) console.log("Did not find customer");

        customer.subscriptions.addToSet(vendor);
        customer.save().then(() => {
          return "Subscribed";
        });
      });
    },

    // customer adds a product to wishlist
    star: (parent, args) => {
      const { customer, product } = args;

      return Customer.findById(customer).then((customer) => {
        if (customer == null) console.log("Did not find customer");

        customer.starred.addToSet(product);
        customer.save().then(() => {
          return "Starred";
        });
      });
    },

    // customer adds a product to cart
    addToCart: (parent, args) => {
      const { customer, product, size } = args;

      let newPurchase = new Purchase({
        customer,
        product,
        size,
      });

      return newPurchase.save();
    },

    // customer liking a product
    like: (parent, args) => {
      const { customer, product } = args;

      return Product.findById(product).then((product) => {
        if (product == null) console.log("Did not find product");

        product.liked_by.addToSet(customer);
        product.save().then(() => {
          return "Product liked";
        });
      });
    },
  },
};

exports.typeDefs = typeDefs;
exports.resolvers = resolvers;
