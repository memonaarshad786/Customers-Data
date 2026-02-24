import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/redux/axiosClient";

interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  country?: string;
  region?: string;
  postalZip?: string;
  numberrange?: number;
  created_at?: string;
  updated_at?: string;
}

interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  total: number;
  pages: number;
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  page: 1,
  size: 10,
  total: 0,
  pages: 0,
};

// 🔹 GET all customers (with pagination)
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async ({ page = 1, size = 10 }: { page?: number; size?: number }) => {
    const res = await api.get(`/customers?page=${page}&size=${size}`);
    // return full response so UI can read pagination metadata
    return res.data;
  }
);

// 🔹 GET customer by name (slug)
export const fetchCustomerByName = createAsyncThunk(
  "customers/fetchByName",
  async (name: string) => {
    const res = await api.get(`/customers?name=${name}`);
    return res.data;
  }
);

// 🔹 GET customer by ID
export const fetchCustomerById = createAsyncThunk(
  "customers/fetchById",
  async (id: string | number) => {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  }
);

// 🔹 CREATE customer
export const createCustomer = createAsyncThunk(
  "customers/create",
  async (data: Customer, { rejectWithValue }) => {
    try {
      const res = await api.post("/customers", data);
      return { ...data, id: res.data.id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 UPDATE customer
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }: { id: number; data: Customer }, { rejectWithValue }) => {
    try {
      await api.put(`/customers/${id}`, data);
      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔹 DELETE customer
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: string | number, { rejectWithValue }) => {
    try {
      await api.delete(`/customers/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟦 fetch all
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload now contains { total, page, pages, size, count, customers }
        state.customers = action.payload.customers || [];
        state.page = action.payload.page || state.page;
        state.size = action.payload.size || state.size;
        state.total = action.payload.total || 0;
        state.pages = action.payload.pages || 0;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customers";
      })

      // 🟩 create
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      })

      // 🟨 update
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1)
          state.customers[index] = {
            ...state.customers[index],
            ...action.payload,
          };
      })

      // 🟥 delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload
        );
      });
  },
});

export const { setSelectedCustomer } = customersSlice.actions;
export default customersSlice.reducer;
