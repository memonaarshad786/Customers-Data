"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchCustomers,
  fetchCustomerByName,
  deleteCustomer,
  setSelectedCustomer,
} from "@/lib/redux/slices/customerSlice";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { DeleteConfirmModal } from "@/components/customers/DeleteConfirmModal";
import Swal from "sweetalert2";
import type { Customer } from "@/types/customer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "@/components/ui/use-toast";
import { SearchBar } from "@/components/ui/SearchBar";

export default function CustomersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, loading, page, size, pages, total } = useSelector(
    (state: RootState) => state.customers
  );

  const [showForm, setShowForm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    // load current page from state
    // if there's a search query, fetch by name instead
    if (query && query.trim().length > 0) {
      dispatch(fetchCustomerByName(query));
    } else {
      dispatch(fetchCustomers({ page: page || 1, size: size || 10 }));
    }
  }, [dispatch, page, size]);

  const handleAdd = () => {
    dispatch(setSelectedCustomer(null)); // clear selection for new
    setShowForm(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pages && newPage > pages)) return;
    if (query && query.trim().length > 0) {
      // when searching, reset to first page behavior - for simplicity just refetch search
      dispatch(fetchCustomerByName(query));
    } else {
      dispatch(fetchCustomers({ page: newPage, size }));
    }
  };

  const handleEdit = (customer: any) => {
    dispatch(setSelectedCustomer(customer));
    setShowForm(true);
  };

  const handleDelete = (id?: number | string) => {
    if (id == null) return;
    // open confirmation modal with selected customer
    const cust = customers.find((c) => String(c.id) === String(id)) || null;
    setCustomerToDelete(cust as Customer | null);
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q && q.trim().length > 0) {
      dispatch(fetchCustomerByName(q));
    } else {
      dispatch(fetchCustomers({ page: 1, size }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    try {
      await dispatch(deleteCustomer(String(customerToDelete.id))).unwrap();
      toast({
        type: "success",
        title: "Deleted",
        description: "Customer deleted successfully.",
      });
      setCustomerToDelete(null);
    } catch (err: any) {
      toast({
        type: "error",
        title: "Error",
        description: err?.message || "Failed to delete customer.",
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:w-1/2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Customers Management
              </CardTitle>
            </div>
            <div className="mt-3 sm:mt-4">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search customers by name..."
              />
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-end">
            <Button
              onClick={handleAdd}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              + Add Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-600 py-8">Loading...</p>
          ) : customers.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No customers found.
            </p>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Country</th>
                  <th className="p-3 border">Address</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-gray-50 transition-all border-b"
                  >
                    <td className="p-3 border">{cust.name}</td>
                    <td className="p-3 border">{cust.email}</td>
                    <td className="p-3 border">{cust.phone}</td>
                    <td className="p-3 border">{cust.country}</td>
                    <td className="p-3 border">{cust.address}</td>
                    <td className="p-3 border text-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(cust)}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(cust.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {pages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * size + 1} - {Math.min(page * size, total)}{" "}
                of {total}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  Prev
                </Button>

                {/* page numbers - limit visible pages */}
                <div className="hidden sm:flex items-center space-x-1">
                  {Array.from({ length: pages }).map((_, i) => {
                    const p = i + 1;
                    // show all if pages <= 7, otherwise show window around current page
                    if (pages > 7) {
                      const left = Math.max(1, page - 2);
                      const right = Math.min(pages, page + 2);
                      if (p < left || p > right) return null;
                    }
                    return (
                      <Button
                        key={p}
                        size="sm"
                        variant={p === page ? "default" : "outline"}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && <CustomerForm onClose={() => setShowForm(false)} />}

      <DeleteConfirmModal
        customer={customerToDelete}
        isOpen={!!customerToDelete}
        isLoading={false}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
}
