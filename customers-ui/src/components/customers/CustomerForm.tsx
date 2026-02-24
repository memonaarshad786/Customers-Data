"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  createCustomer,
  updateCustomer,
  setSelectedCustomer,
} from "@/lib/redux/slices/customerSlice";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  address: z.string().min(3, "Address is required"),
  country: z.string().min(2, "Country is required"),
  region: z.string().optional(),
  postalZip: z.string().optional(),
  // Accept strings from inputs but coerce to number (or undefined) before validation
  numberrange: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    // If the value is already a number, return it; otherwise coerce
    return typeof val === "number" ? val : Number(val);
  }, z.number().optional()),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export function CustomerForm({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCustomer } = useSelector(
    (state: RootState) => state.customers
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (selectedCustomer) {
      reset(selectedCustomer);
    } else {
      reset({});
    }
  }, [selectedCustomer, reset]);

  const onSubmit = (data: CustomerFormData) => {
    if (selectedCustomer) {
      dispatch(updateCustomer({ id: selectedCustomer.id!, data }));
    } else {
      dispatch(createCustomer(data));
    }
    dispatch(setSelectedCustomer(null));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[520px] shadow-xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>
            {selectedCustomer ? "Edit Customer" : "Add New Customer"}
          </CardTitle>
          {/* <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button> */}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("name")}
                placeholder="Full Name"
                className="w-full border p-2 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full border p-2 rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("phone")}
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("address")}
                placeholder="Address"
                className="w-full border p-2 rounded"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            <div>
              <input
                {...register("country")}
                placeholder="Country"
                className="w-full border p-2 rounded"
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {selectedCustomer ? "Update" : "Add Customer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
