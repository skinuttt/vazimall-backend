const typeDefs = gql `
   type Customer {
    id: ID!
    phone_number : String
    name : String
    account_balance : Int
    starred : [Product]
    basket : [Product]    
    photo : String
    notifications : [Notification]
   }

   type Notification {
       notice : String
       timestamp : String
   }

   type Product {
        id : ID!
        vendor : Vendor
        photos : [String]
        name : String
        gender : Gender
        category : Category
        size : [String]
        price : Int
        description : String
        quantity : Int
        liked_by : [Customer]
        buyers : [Buyer]
        keywords : [String]
   }

   type Buyer {
       buyer : Customer
       timestamp : String
   }

   enum Gender {
       MALE
       FEMALE
       UNISEX
   }

   enum Category {
        T-SHIRTS
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
        id : ID!
        product : Product
        message : String
        customer : Customer
   }

   type Transaction {
        id : ID!
        vendor : Vendor 
        transaction_code : String
        amount : Float
   }

   type Vendor {
        id : ID!
        subscribers : [Customer]
        stall_name : String
        description : String
        photo : String
        account_balance : Float
        ratings : [Int]
        phone_number : String
   }


   type Query {
        getCustomers(): [Customer!]!
        getProducts(): [Product!]!
        getReviews(): [Review!]!
        getVendors(): [Vendor!]!
   }

   input ProductInput {
        vendor : String!    
        name : String!
        gender : Gender!
        category : Category!
        size : [String]!
        price : Int!
        description : String!
        quantity : Int 
        keywords : [String]!
   }  

   type Mutation {
        addCustomer(phone_number : String! , name : String! ): Customer 
        addProduct( input : ProductInput ): Product
        addVendor( stall_name : String! , description : String! , phone_number : String! ) : Vendor
        addReview( product : String! , message : String! , customer : String! ) : Review
   }
`

const resolvers = {
    Query: {
      getCustomers: (parent, args) => {
        return Customer.find({});
      },
      getProducts: (parent, args) => {
        return Product.find({});
      },
      getReviews: (parent, args) => {
        return Review.find({});
      },
      getVendors: (parent, args) => {
        return Vendor.find({});
      }
    },

    Mutation: {
      addCustomer: (parent, args) => {
        let customer = new Customer({
          name: args.name,
          phone_number: args.phone_number,          
        });
        return customer.save();
      },
      addVendor: (parent, args) => {
        let vendor = new Vendor({
          stall_name: args.stall_name,
          phone_number: args.phone_number,   
          description: args.description       
        });
        return vendor.save();
      },
      addReview: (parent, args) => {
        let review = new Review({
          product: args.product,
          message: args.message,  
          customer: args.customer     
        });
        return review.save();
      },
      addProduct: (parent, args) => {
        const {vendor,name,gender,category,size,price,description,quantity,keywords} = args.input
        let product = new Product({
               vendor,
               name,
               gender,
               category,
               size,
               price,
               description,
               quantity,
               keywords
        });
        return product.save();
      },
     
    }
  }