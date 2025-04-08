import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = "http://localhost:4001";

// This mock data will be used as fallback if the API call fails

const image_url =
  "https://img.freepik.com/premium-vector/various-hand-drawn-food-cookery-doodle-outline-sketch-seamless-pattern-white-background-vector_502272-629.jpg?w=2000";
const mockOrders = [
  {
    order_id: "ORD-2025",
    customer_id: 1,
    customer_name: "Jane Doe",
    dishes: [
      { dish_name: "Burger", quantity: 2, price: 10.99 },
      { dish_name: "Fries", quantity: 1, price: 5.99 },
    ],
    status: 1, // Status 1: Waiting for Approval
    bill_amount: 27.99,
    discount_amount: 3.0,
    final_amount: 24.99,
    is_delivery: true,
    created_at: "2025-03-26T10:30:00Z",
    customer_address: "Room 101, Block A",
  },
  {
    order_id: "ORD-2024",
    customer_id: 2,
    customer_name: "Mike Chen",
    dishes: [
      { dish_name: "Pizza", quantity: 1, price: 15.5 },
      { dish_name: "Soda", quantity: 2, price: 2.5 },
    ],
    status: 2, // Status 2: Waiting for Payment
    bill_amount: 20.5,
    discount_amount: 2.0,
    final_amount: 18.5,
    is_delivery: true,
    created_at: "2025-03-26T10:15:00Z",
    customer_address: "Room 203, Block B",
  },
  {
    order_id: "ORD-2023",
    customer_id: 3,
    customer_name: "Alex Smith",
    dishes: [
      { dish_name: "Pasta", quantity: 1, price: 18.99 },
      { dish_name: "Garlic Bread", quantity: 1, price: 7.0 },
      { dish_name: "Salad", quantity: 1, price: 10.0 },
    ],
    status: 3, // Status 3: Cooking
    bill_amount: 35.99,
    discount_amount: 3.0,
    final_amount: 32.99,
    is_delivery: false,
    created_at: "2025-03-26T09:45:00Z",
    customer_address: "Room 305, Block C",
  },
  {
    order_id: "ORD-2022",
    customer_id: 4,
    customer_name: "Emily Taylor",
    dishes: [
      { dish_name: "Noodles", quantity: 1, price: 14.5 },
      { dish_name: "Spring Rolls", quantity: 2, price: 4.0 },
    ],
    status: 0, // Status 0: Rejected/Failed
    bill_amount: 22.5,
    discount_amount: 2.5,
    final_amount: 20.0,
    is_delivery: true,
    created_at: "2025-03-26T09:30:00Z",
    customer_address: "Room 408, Block D",
  },
  {
    order_id: "ORD-2021",
    customer_id: 5,
    customer_name: "James Wilson",
    dishes: [
      { dish_name: "Biryani", quantity: 1, price: 25.0 },
      { dish_name: "Raita", quantity: 1, price: 5.0 },
    ],
    status: 4, // Status 4: Ready for Pickup/Delivery
    bill_amount: 30.0,
    discount_amount: 5.0,
    final_amount: 25.0,
    is_delivery: true,
    created_at: "2025-03-26T09:00:00Z",
    customer_address: "Room 210, Block B",
  },
];

// Mock reservation data for fallback
const mockReservations = [
  {
    id: 1,
    customer_id: 101,
    customer_name: "Sarah Johnson",
    customer_email: "sarah.j@example.com",
    customer_phone: "9876543210",
    people_count: 4,
    table_number: 8,
    reservation_date: "2025-05-15",
    reservation_time: "19:00:00",
    end_time: "20:00:00",
    status: "pending", // pending, approved, rejected, completed
    booking_amount: 50,
    additional_request: "Window seat preferred, celebrating anniversary",
    created_at: "2025-05-10T14:30:00Z",
    customer_image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    customer_id: 102,
    customer_name: "Michael Chen",
    customer_email: "michael.c@example.com",
    customer_phone: "8765432109",
    people_count: 2,
    table_number: 4,
    reservation_date: "2025-05-15",
    reservation_time: "18:30:00",
    end_time: "19:30:00",
    status: "approved",
    booking_amount: 30,
    additional_request: "",
    created_at: "2025-05-11T09:15:00Z",
    customer_image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    customer_id: 103,
    customer_name: "Emma Davis",
    customer_email: "emma.d@example.com",
    customer_phone: "7654321098",
    people_count: 6,
    table_number: 12,
    reservation_date: "2025-05-16",
    reservation_time: "20:00:00",
    end_time: "22:00:00",
    status: "pending",
    booking_amount: 75,
    additional_request: "Birthday celebration, need space for cake cutting",
    created_at: "2025-05-12T16:45:00Z",
    customer_image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 4,
    customer_id: 104,
    customer_name: "John Smith",
    customer_email: "john.s@example.com",
    customer_phone: "6543210987",
    people_count: 3,
    table_number: 6,
    reservation_date: "2025-05-17",
    reservation_time: "19:30:00",
    end_time: "21:00:00",
    status: "rejected",
    booking_amount: 0,
    additional_request: "",
    created_at: "2025-05-13T11:20:00Z",
    customer_image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
];

// Mock data for fallback
const mockPopularOrders = [
  {
    dish_id: "D001",
    dish_name: "Chicken Biryani",
    total_orders: 156,
    revenue: 15600,
    rating: 4.5,
    image_url: "/images/biryani.jpg",
  },
  {
    dish_id: "D002",
    dish_name: "Paneer Butter Masala",
    total_orders: 142,
    revenue: 12780,
    rating: 4.3,
    image_url: "/images/paneer.jpg",
  },
  {
    dish_id: "D003",
    dish_name: "Masala Dosa",
    total_orders: 128,
    revenue: 8960,
    rating: 4.4,
    image_url: "/images/dosa.jpg",
  },
];

const mockRecentOrders = [
  {
    order_id: "ORD001",
    customer_name: "John Doe",
    dishes: [
      { dish_name: "Chicken Biryani", quantity: 2 },
      { dish_name: "Butter Naan", quantity: 4 },
    ],
    total_amount: 560,
    order_time: "2024-03-20T14:30:00",
    status: "Completed",
  },
  {
    order_id: "ORD002",
    customer_name: "Alice Smith",
    dishes: [
      { dish_name: "Paneer Butter Masala", quantity: 1 },
      { dish_name: "Jeera Rice", quantity: 2 },
    ],
    total_amount: 340,
    order_time: "2024-03-20T14:15:00",
    status: "Completed",
  },
  {
    order_id: "ORD003",
    customer_name: "Mike Johnson",
    dishes: [{ dish_name: "Masala Dosa", quantity: 2 }],
    total_amount: 160,
    order_time: "2024-03-20T14:00:00",
    status: "Completed",
  },
];

// Validation functions
const validateDiscount = (data) => {
  if (data.discount_amount === undefined || !data.menu_items) {
    throw new Error("Missing required fields for discount");
  }

  const discountAmount = parseFloat(data.discount_amount);
  if (isNaN(discountAmount) || discountAmount <= 0) {
    throw new Error("Discount amount must be a positive number");
  }

  if (!Array.isArray(data.menu_items) || data.menu_items.length === 0) {
    throw new Error("At least one dish must be selected");
  }
};

const validateCoupon = (data) => {
  if (
    !data.code ||
    !data.value ||
    !data.min_order_value ||
    !data.usage_limit ||
    !data.valid_until
  ) {
    return -1;
  }

  if (data.code.length > 12) {
    return -2;
  }

  if (data.min_order_value < data.value) {
    return -3;
  }

  const value = parseFloat(data.value);
  if (isNaN(value) || value <= 0) {
    return -4;
  }

  const minOrderValue = parseInt(data.min_order_value);
  if (!Number.isInteger(minOrderValue) || minOrderValue <= 0) {
    return -5;
  }

  const usageLimit = parseInt(data.usage_limit);
  if (!Number.isInteger(usageLimit) || usageLimit <= 0) {
    return -6;
  }
};

const canteenService = {
  // Fetch order queue data
  getOrderQueue: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/order-queue`);
      console.log("API Response:", response.data);
      return response.data.orders;
    } catch (error) {
      console.error("Error fetching order queue:", error);
      return mockOrders;
    }
  },

  // Accept a new order (status 1 -> status 2: Waiting for Approval -> Waiting for Payment)
  acceptOrder: async (order_id) => {
    try {
      console.log(`Accepting order ${order_id}`);
      const response = await axios.post(`${API_URL}/canteen/accept-order`, {
        order_id,
      });

      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || "Order accepted successfully",
        };
      } else {
        throw new Error("Failed to accept order");
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      throw new Error(
        error.response?.data?.message || "Failed to accept order"
      );
    }
  },

  // Mark order as ready for cooking (status 2 -> status 3: Waiting for Payment -> Cooking)
  // This is handled by the backend after payment confirmation
  // markOrderReady: async (order_id) => {
  //   try {
  //     console.log(`Marking order ${order_id} as ready for cooking`);
  //     const response = await axios.post(`${API_URL}/canteen/ready-order`,
  //       { order_id },
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         timeout: 10000
  //       }
  //     );

  //     if (response.status === 200) {
  //       return { success: true, message: response.data.message || 'Order marked as cooking' };
  //     } else {
  //       throw new Error('Failed to mark order as cooking');
  //     }
  //   } catch (error) {
  //     console.error('Error marking order as cooking:', error);
  //     throw new Error(error.response?.data?.message || 'Failed to mark order as cooking');
  //   }
  // },

  // Complete an order (status 3 -> status 4: Cooking -> Ready for Pickup/Delivery)
  completeOrder: async (order_id) => {
    try {
      console.log(`Completing order ${order_id}`);
      const response = await axios.post(`${API_URL}/canteen/ready-order`, {
        order_id,
      });

      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || "Order ready for pickup/delivery",
        };
      } else {
        throw new Error("Failed to mark order as ready");
      }
    } catch (error) {
      console.error("Error marking order as ready:", error);
      throw new Error(
        error.response?.data?.message || "Failed to mark order as ready"
      );
    }
  },

  // Reject an order (status -> status 0: Any status -> Rejected/Failed)
  rejectOrder: async (order_id) => {
    try {
      console.log(`Rejecting order ${order_id}`);
      const response = await axios.post(`${API_URL}/canteen/reject-order`, {
        order_id,
      });

      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || "Order rejected successfully",
        };
      } else {
        throw new Error("Failed to reject order");
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      throw new Error(
        error.response?.data?.message || "Failed to reject order"
      );
    }
  },

  // Get order details
  // getOrderDetails: async (order_id) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/canteen/orders`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching order details:', error);
  //     throw error;
  //   }
  // },

  // Get active discounts
  getActiveDiscounts: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/active-discounts`);
      console.log("Bjasd: ", response);
      console.log("Active discounts:", response.data.discounts);
      console.log("Data aa rha hau !");
      return response.data.discounts;
    } catch (error) {
      console.error("Error fetching active discounts:", error);
      // For development, return mock data if API call fails
      return [
        {
          dish_id: 1,
          canteen_id: 1,
          dish_name: "Paneer Butter Masala",
          price: 120,
          discount: 10,
          is_veg: true,
          dish_tag: "Main Course",
          image_url: "/images/dishes/paneer.jpg",
        },
        {
          dish_id: 2,
          canteen_id: 1,
          dish_name: "Chicken Biryani",
          price: 150,
          discount: 5,
          is_veg: false,
          dish_tag: "Main Course",
          image_url: "/images/dishes/biryani.jpg",
        },
        {
          dish_id: 3,
          canteen_id: 1,
          dish_name: "Pasta Alfredo",
          price: 90,
          discount: 0,
          is_veg: true,
          dish_tag: "Main Course",
          image_url: "/images/dishes/pasta.jpg",
        },
        {
          dish_id: 4,
          canteen_id: 1,
          dish_name: "Margherita Pizza",
          price: 110,
          discount: 15,
          is_veg: true,
          dish_tag: "Main Course",
          image_url: "/images/dishes/pizza.jpg",
        },
        {
          dish_id: 5,
          canteen_id: 1,
          dish_name: "Veg Fried Rice",
          price: 80,
          discount: 0,
          is_veg: true,
          dish_tag: "Main Course",
          image_url: "/images/dishes/friedrice.jpg",
        },
      ];
    }
  },

  // Get active coupons
  getActiveCoupons: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/active-coupons`);

      console.log("Active coupons API response:", response.data);

      if (response.data && response.data.coupons) {
        return response.data.coupons;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching active coupons:", error);
      // For development, return mock data if API call fails
      return [
        {
          id: 1,
          code: "WELCOME20",
          value: 20,
          min_order_value: 100,
          usage_limit: 100,
          valid_until: "2025-04-30",
        },
        {
          id: 2,
          code: "SPECIAL50",
          value: 50,
          min_order_value: 200,
          usage_limit: 50,
          valid_until: "2025-03-31",
        },
        {
          id: 3,
          code: "NEWUSER15",
          value: 15,
          min_order_value: 75,
          usage_limit: 200,
          valid_until: "2025-05-15",
        },
      ];
    }
  },

  // Delete a discount
  deleteDiscount: async (discountId) => {
    try {
      const response = await axios.post(`${API_URL}/canteen/delete-discount`, {
        dishId: discountId,
      });

      if (response.status === 200) {
        console.log(`Discount for dish ${discountId} deleted successfully`);
        return {
          success: true,
          message: response.data.message || "Discount Deleted",
        };
      } else {
        throw new Error("Failed to delete discount");
      }
    } catch (error) {
      console.error(`Error deleting discount for dish ${discountId}:`, error);
      throw new Error(error.response?.data?.message || "Internal Server Error");
    }
  },

  // Delete a coupon
  deleteCoupon: async (couponId) => {
    try {
      const response = await axios.post(`${API_URL}/canteen/delete-coupon`, {
        couponId: couponId,
      });

      if (response.status === 200) {
        console.log(`Coupon ${couponId} deleted successfully`);
        return {
          success: true,
          message: response.data.message || "Coupon Deleted",
        };
      } else {
        throw new Error("Failed to delete coupon");
      }
    } catch (error) {
      console.error(`Error deleting coupon ${couponId}:`, error);
      throw new Error(error.response?.data?.message || "Internal Server Error");
    }
  },

  // Create a new discount
  createDiscount: async (discountData) => {
    try {
      // Validate discount data
      validateDiscount(discountData);

      const response = await axios.post(
        `${API_URL}/canteen/create-discounts`,
        {
          discount_amount: discountData.discount_amount,
          menu_items: discountData.menu_items,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (response.status === 200) {
        console.log("Discount created successfully:", response.data);
        return {
          success: true,
          message: response.data.message || "Discounts Updated Successfully",
        };
      } else {
        throw new Error("Failed to create discount");
      }
    } catch (error) {
      console.error("Error creating discount:", error);
      throw new Error(error.response?.data?.message || "Internal Server Error");
    }
  },

  // Create a new coupon
  createCoupon: async (couponData) => {
    try {
      // Validate coupon data
      // const val = validateCoupon(couponData);
      // if(val === -1){
      //   alert('Missing required fields for coupon')
      // }
      // else if(val === -2){
      //  alert('Coupon Code length must be less than 13 characters')
      // }
      // else if(val === -3){
      //   alert('Discount Value must be less than Minimum Order Value');
      // }
      // else if(val === -4){
      //   alert('Coupon value must be a valid number greater 0');
      // }
      // else if(val === -5){
      //   alert('Discount value must be greater 0');
      // }
      // else{
      //   alert('Usage limit must be a positive integer');
      // }

      const response = await axios.post(
        `${API_URL}/canteen/create-coupon`,
        {
          code: couponData.code,
          // canteen_id: couponData.canteen_id,
          value: couponData.value,
          min_order_value: couponData.min_order_value,
          usage_limit: couponData.usage_limit,
          valid_until: couponData.valid_until,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (response.status === 200) {
        console.log("Coupon created successfully:", response.data);
        return {
          success: true,
          message: response.data.message || "Coupon Created Successfully",
        };
      } else {
        throw new Error("Failed to create coupon");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      // Handle specific error codes from the backend
      if (error.response && error.response.status === 409) {
        throw new Error("Coupon Code Already Exists");
      }
      throw new Error(error.response?.data?.message || "Internal Server Error");
    }
  },

  // Get menu items for a canteen
  getMenuItems: async (canteenId) => {
    try {
      const response = await axios.post(`${API_URL}/canteen/menu-items`);
      console.log("Menu items fetched successfully:", response.data.menu);
      return response.data.menu;
    } catch (error) {
      console.error("Error fetching menu items:", error);
      // For development, return mock data if API call fails
      return [
        {
          id: 1,
          canteen_id: 1,
          name: "Paneer Butter Masala",
          price: 120,
          discount: 10,
          rating: 4.8,
          category_tag: "Main Course",
          dish_tag: "North Indian",
          is_veg: true,
          image: "https://example.com/paneer.jpg",
        },
        {
          id: 2,
          canteen_id: 1,
          name: "Chicken Biryani",
          price: 150,
          discount: 5,
          rating: 4.5,
          category_tag: "Main Course",
          dish_tag: "Hyderabadi",
          is_veg: false,
          image: "https://example.com/biryani.jpg",
        },
        {
          id: 3,
          canteen_id: 1,
          name: "Pasta Alfredo",
          price: 90,
          discount: 0,
          rating: 4.2,
          category_tag: "Main Course",
          dish_tag: "Italian",
          is_veg: true,
          image: "https://example.com/pasta.jpg",
        },
        {
          id: 4,
          canteen_id: 1,
          name: "Margherita Pizza",
          price: 110,
          discount: 15,
          rating: 4.7,
          category_tag: "Main Course",
          dish_tag: "Italian",
          is_veg: true,
          image: "https://example.com/pizza.jpg",
        },
        {
          id: 5,
          canteen_id: 2,
          name: "Veg Fried Rice",
          price: 80,
          discount: 0,
          rating: 3.9,
          category_tag: "Main Course",
          dish_tag: "Chinese",
          is_veg: true,
          image: "https://example.com/friedrice.jpg",
        },
        {
          id: 6,
          canteen_id: 3,
          name: "Butter Chicken",
          price: 130,
          discount: 0,
          rating: 4.9,
          category_tag: "Main Course",
          dish_tag: "North Indian",
          is_veg: false,
          image: "https://example.com/butterchicken.jpg",
        },
        {
          id: 7,
          canteen_id: 4,
          name: "Manchurian",
          price: 70,
          discount: 5,
          rating: 4.0,
          category_tag: "Starter",
          dish_tag: "Chinese",
          is_veg: true,
          image: "https://example.com/manchurian.jpg",
        },
        {
          id: 8,
          canteen_id: 4,
          name: "Dosa",
          price: 60,
          discount: 0,
          rating: 3.8,
          category_tag: "Breakfast",
          dish_tag: "South Indian",
          is_veg: true,
          image: "https://example.com/dosa.jpg",
        },
        {
          id: 9,
          canteen_id: 5,
          name: "Mutton Rogan Josh",
          price: 140,
          discount: 20,
          rating: 4.9,
          category_tag: "Main Course",
          dish_tag: "Kashmiri",
          is_veg: false,
          image: "https://example.com/mutton.jpg",
        },
        {
          id: 10,
          canteen_id: 5,
          name: "Chole Bhature",
          price: 100,
          discount: 10,
          rating: 4.3,
          category_tag: "Main Course",
          dish_tag: "Punjabi",
          is_veg: true,
          image: "https://example.com/chole.jpg",
        },
        {
          id: 11,
          canteen_id: 1,
          name: "Cold Coffee",
          price: 60,
          discount: 0,
          rating: 4.6,
          category_tag: "Beverages",
          dish_tag: "Coffee",
          is_veg: true,
          image: "https://example.com/coldcoffee.jpg",
        },
        {
          id: 12,
          canteen_id: 1,
          name: "Fresh Orange Juice",
          price: 70,
          discount: 5,
          rating: 4.8,
          category_tag: "Beverages",
          dish_tag: "Fruit Juice",
          is_veg: true,
          image: "https://example.com/orangejuice.jpg",
        },
      ];
    }
  },

  // Add a new menu item
  addMenuItem: async (menuItemData) => {
    try {
      // Validate discount percentage before sending to server
      if (menuItemData.discount < 0 || menuItemData.discount > 100) {
        throw new Error("Discount must be between 0 and 100 percent");
      }
      // Prepare data for API - transform field names if needed
      const apiData = {
        name: menuItemData.dish_name,
        dish_tag: menuItemData.dish_tag,
        price: menuItemData.price,
        discount: menuItemData.discount,
        // rating: menuItemData.rating,
        dish_category: menuItemData.dish_category,
        is_veg: menuItemData.is_veg,
        img_url: menuItemData.imageFile || image_url,
      };

      if (menuItemData.imageFile) {
        const formData = new FormData();

        // Add all non-file data to the form
        Object.keys(apiData).forEach((key) => {
          formData.append(key, apiData[key]);
        });

        if (menuItemData.imageFile) {
          formData.append("image", menuItemData.imageFile);
        }

        const response = await axios.post(
          `${API_URL}/canteen/add-dish`,
          formData
        );

        console.log("Menu item added successfully:", response.data);
        return response.data.menu;
      } else {
        console.log("1");
        const response = await axios.post(
          `${API_URL}/canteen/add-dish`,
          apiData, {withCredentials: true}
        );

        console.log("Menu item added successfully:", response.data);
        return response.data;
      }
      // const response = await axios.post('${API_URL}/canteen/menu-items', )
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  },

  // Update an existing menu item
  updateMenuItem: async (itemId, menuItemData) => {
    try {
      // Validate discount percentage before sending to server
      if (menuItemData.discount < 0 || menuItemData.discount > 100) {
        throw new Error("Discount must be between 0 and 100 percent");
      }

      // Prepare data for API - transform field names if needed
      const apiData = {
        name: menuItemData.name,
        dish_tag: menuItemData.dish_tag,
        price: menuItemData.price,
        discount: menuItemData.discount,
        // rating: menuItemData.rating,
        dish_category: menuItemData.category_tag,
        is_veg: menuItemData.is_veg,
        status: menuItemData.status | image_url,
      };

      if (menuItemData.imageFile) {
        const formData = new FormData();

        Object.keys(apiData).forEach((key) => {
          formData.append(key, apiData[key]);
        });

        if (menuItemData.imageFile) {
          formData.append("image", menuItemData.imageFile);
        }

        const response = await axios.post(
          `${API_URL}/canteen/edit-dish`,
          formData
        );

        console.log("Menu item updated successfully:", response.data);
        return response.data;
      } else {
        const response = await axios.post(
          `${API_URL}/canteen/edit-dish`,
          apiData
        );

        console.log("Menu item updated successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  },

  // Delete a menu item
  deleteMenuItem: async (itemId) => {
    try {
      const response = await axios.post(
        `${API_URL}/canteen/menu-items/delete-dish`,
        { dish_id: itemId }
      );
      console.log("Menu item deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  },

  // Function to change password
  changePassword: async (current_password, new_password) => {
    try {
      const response = await axios.post(`${API_URL}/canteen/edit-password`, {
        new_password: new_password,
        current_password: current_password,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Get current user profile
  getUserProfile: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/profile`);
      console.log("Profile response:", response.data.profile);
      return response.data.profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      // For development: Return mock data if API call fails
      return {
        username: "johnsmith",
        name: "John Smith",
        img_url: "/images/business_avatar.png",
        role: "Canteen Manager",
        address: "Student Center, Building 5, Floor 2",
        opening_time: "08:00",
        closing_time: "20:00",
        opening_status: true,
        auto_accept: false,
        delivery_available: true,
      };
    }
  },

  // Update canteen profile
  updateCanteenProfile: async (profileData) => {
    try {
      // Prepare data for API
      const apiProfileData = {
        username: profileData.username,
        name: profileData.name,
        address: profileData.address,
        opening_time: profileData.opening_time,
        closing_time: profileData.closing_time,
        opening_status: profileData.opening_status,
        auto_accept: profileData.auto_accept,
        delivery_available: profileData.delivery_available,
        img_url: profileData.img_url,
      };

      console.log("Sending profile update:", apiProfileData);

      const response = await axios.post(
        `${API_URL}/canteen/edit-profile`,
        apiProfileData
      );

      console.log("Profile updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Function to update profile image
  updateProfileImage: async (imageFile) => {
    try {
      // Create a FormData object to send the image file
      const formData = new FormData();
      formData.append("profile_image", imageFile);

      const response = await axios.post(
        `${API_URL}/canteen/profile-image`,
        formData
      );

      // Check if the response has image_url or img_url
      const responseData = response.data;
      if (!responseData.image_url && !responseData.img_url && imageFile) {
        // If neither exists but we have a file, create a local URL
        responseData.img_url = URL.createObjectURL(imageFile);
      }

      return responseData;
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw error;
    }
  },

  // Get reservations
  getReservations: async (canteenId) => {
    try {
      const response = await axios.post(`${API_URL}/canteen/reservation-queue`);
      console.log("Reservations fetched successfully:", response.data);
      return response.data.reservations;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      // For development, return mock data if API call fails
      return mockReservations;
    }
  },

  // // Update reservation status
  // updateReservationStatus: async (reservationId, status) => {
  //   try {
  //     // Convert numeric status to string for backward compatibility with API if needed
  //     let statusString = status;
  //     if (typeof status === 'number') {
  //       switch(status) {
  //         case 0: statusString = 'rejected'; break;
  //         case 1: statusString = 'pending'; break;
  //         case 2: statusString = 'approved'; break;
  //         case 3: statusString = 'completed'; break;
  //         default: statusString = 'pending';
  //       }
  //     }

  //     console.log(`Reservation ${reservationId} status update: numeric=${status}, string=${statusString}`);

  //     const response = await axios.post(`${API_URL}/canteen/reservations/${reservationId}/status`,
  //       { status: statusString },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
  //         },
  //         timeout: 10000
  //       }
  //     );
  //     console.log(`Reservation ${reservationId} status updated to ${status}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error updating reservation status:`, error);
  //     throw error;
  //   }
  // },

  // Function to get popular orders
  getPopularOrders: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/canteen/orders/popular`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching popular orders:", error);
      return mockPopularOrders;
    }
  },

  // Function to get recent orders
  getRecentOrders: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/canteen/orders/recent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      return mockRecentOrders;
    }
  },

  // Get home order queue data
  getHomeOrderQueue: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/home-order-queue`);
      const data = response.data;
      return {
        orders_in_queue: data.orders_in_queue || 0,
        pending_orders: data.pending_orders || 0,
        message: data.message,
      };
    } catch (error) {
      console.error("Error fetching order queue data:", error);
      // Return mock data for development
      return {
        message: "Order queue data sent",
        orders_in_queue: 3,
        pending_orders: 2,
      };
    }
  },

  // Get discount data for home page
  getHomeDiscountData: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/canteen/home-discount-n-coupons`
      );
      const data = response.data;
      console.log(data);
      return {
        active_coupons: data.active_coupons || 0,
        active_discounts: data.active_discounts || 0,
        message: data.message,
      };
    } catch (error) {
      console.error("Error fetching discount data:", error);
      // Return mock data for development
      return {
        message: "Discount data sent",
        active_coupons: 5,
        active_discounts: 3,
      };
    }
  },

  // Get reservation data for home page
  getHomeReservationData: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/canteen/home-reservation-queue`
      );

      const data = response.data;
      console.log("Reservation data response:", data);
      return {
        pending_reservations: data.pending_reservations || 0,
        confirmed_reservations: data.confirmed_reservations || 0,
        message: data.message,
      };
    } catch (error) {
      console.error("Error fetching reservation data:", error);
      // Return mock data for development
      return {
        message: "Reservation data sent",
        pending: 2,
        confirmed: 7,
      };
    }
  },

  // Get trending picks for home page
  getTrendingPicks: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/trending-picks`);
      const data = response.data;
      console.log("Trending picks response:", data);
      console.log(data.trending_picks[4].img_url);
      return {
        items: data.trending_picks || [],
        message: data.message,
      };
    } catch (error) {
      console.error("Error fetching trending picks:", error);
      // Return mock data for development
      return {
        message: "Trending picks data sent",
        items: [
          {
            id: 1,
            name: "Tandoori Chicken",
            image_url:
              "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            orders: 45,
          },
          {
            id: 2,
            name: "French Fries",
            image_url:
              "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            orders: 38,
          },
          {
            id: 3,
            name: "Burger",
            image_url:
              "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            orders: 32,
          },
          {
            id: 4,
            name: "Peanut Butter Sandwich",
            image_url:
              "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            orders: 30,
          },
          {
            id: 5,
            name: "Biryani",
            image_url:
              "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
            orders: 28,
          },
        ],
      };
    }
  },

  /**
   * Fetches the statistics data for the top 4 cards on statistics page
   * @returns {Promise} Promise object that resolves to the statistics data
   */
  getStatisticsData: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/get-statistics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics data:", error);
      // Return mock data for development
      return {
        total_sales: 12845,
        total_orders: 486,
        avg_order_value: 26.45,
        total_customers: 1284,
        delta: {
          sales: 1425,
          orders: 37,
          avg_order_value: 1.28,
          customers: 122,
        },
        popular_items: [
          {
            name: "Classic Burger",
            orders: 342,
            price: "₹8.99",
            image: "/images/food/burger.jpg",
          },
          {
            name: "Margherita Pizza",
            orders: 275,
            price: "₹12.99",
            image: "/images/food/pizza.jpg",
          },
          {
            name: "Caesar Salad",
            orders: 208,
            price: "₹7.99",
            image: "/images/food/salad.jpg",
          },
        ],
        recent_orders: [
          {
            customer: "Sarah Wilson",
            items: 2,
            total: "₹24.98",
            status: "Completed",
            image: "/images/users/user1.jpg",
          },
          {
            customer: "Mike Johnson",
            items: 1,
            total: "₹12.99",
            status: "Preparing",
            image: "/images/users/user2.jpg",
          },
          {
            customer: "Emma Davis",
            items: 3,
            total: "₹32.50",
            status: "New",
            image: "/images/users/user3.jpg",
          },
        ],
      };
    }
  },

  /**
   * Fetches the graph data for sales and orders analytics
   * @returns {Promise} Promise object that resolves to the graphs data
   */
  getGraphsData: async () => {
    try {
      const response = await axios.post(`${API_URL}/canteen/get-graphs`);
      console.log("yeh hamara hai ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching graph data:", error);
      // Generate sample data for development

      // Generate monthly data (last 30 days)
      const generateMonthlyData = () => {
        const today = new Date();
        const sales = [];
        const orders = [];

        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const day = date.getDate();

          sales.push({
            date: date.toISOString().split("T")[0],
            day: day,
            amount: Math.floor(Math.random() * 1500) + 1000,
          });

          orders.push({
            date: date.toISOString().split("T")[0],
            day: day,
            count: Math.floor(Math.random() * 40) + 20,
          });
        }

        return { sales, orders };
      };

      // Generate yearly data (12 months)
      const generateYearlyData = () => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const today = new Date();
        const currentMonth = today.getMonth();
        const sales = [];
        const orders = [];

        for (let i = 11; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          const month = months[monthIndex];

          sales.push({
            month: month,
            amount: Math.floor(Math.random() * 40000) + 30000,
          });

          orders.push({
            month: month,
            count: Math.floor(Math.random() * 1000) + 800,
          });
        }

        return { sales, orders };
      };

      const monthlyData = generateMonthlyData();
      const yearlyData = generateYearlyData();

      return {
        monthly: {
          sales: monthlyData.sales,
          orders: monthlyData.orders,
        },
        yearly: {
          sales: yearlyData.sales,
          orders: yearlyData.orders,
        },
      };
    }
  },

  // Accept reservation
  acceptReservation: async (reservationId) => {
    try {
      console.log(`Accepting reservation ${reservationId}`);

      const response = await axios.post(
        `${API_URL}/canteen/accept-reservation`,
        { reservation_id: reservationId },
        {
          headers: {
            /* Auth headers */
          },
          timeout: 10000,
        }
      );
      console.log(`Reservation ${reservationId} accepted successfully`);
      return response.data;
    } catch (error) {
      console.log("Reservation failed !");
      console.error(`Error accepting reservation:`, error);
      throw error;
    }
  },

  // Reject reservation
  rejectReservation: async (reservationId) => {
    try {
      console.log(`Rejecting reservation ${reservationId}`);

      const response = await axios.post(
        `${API_URL}/canteen/reject-reservation`,
        { reservation_id: reservationId },
        {
          headers: {
            /* Auth headers */
          },
          timeout: 10000,
        }
      );
      console.log(`Reservation ${reservationId} rejected successfully`);
      return response.data;
    } catch (error) {
      console.error(`Error rejecting reservation:`, error);
      throw error;
    }
  },
};

export default canteenService;
