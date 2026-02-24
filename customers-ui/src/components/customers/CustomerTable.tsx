"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface CustomerTableProps {
  customers: Customer[];
  onDeleteClick: (customer: Customer) => void;
  isLoading?: boolean;
}

export function CustomerTable({
  customers,
  onDeleteClick,
  isLoading = false,
}: CustomerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </TableCell>
          </TableRow>
        ) : customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No customers found.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.country}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" >
                    <Link href={`/customers/${customer.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View customer</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" >
                    <Link href={`/customers/${customer.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit customer</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteClick(customer)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete customer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
