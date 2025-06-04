"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductData, ProductDocument } from "@/interfaces/interfaces";
import { useProductStore } from "@/store/useProductStore";
import { 
  createProductUseCase, 
  updateProductUseCase, 
  deleteProductUseCase 
} from "@/use-cases/productManagementUseCases";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

export default function ProductsManagement() {
    const { products, fetchProducts } = useProductStore();
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

    const form = useForm<ProductData>();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            await fetchProducts();
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: ProductData) => {
        setSelectedProduct(product);
        form.reset(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (productId: number) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProductUseCase(productId);
                await loadProducts();
                toast.success("Product deleted successfully")
            } catch (error) {
                toast.error("Failed to delete product")
            }
        }
    };

    const onSubmit = async (data: ProductDocument) => {
        try {
            if (selectedProduct) {
                await updateProductUseCase(selectedProduct.product_id, data);
            } else {
                await createProductUseCase(data);
            }
            await loadProducts();
            setIsEditModalOpen(false);
            toast.success(`Product ${selectedProduct ? 'updated' : 'created'} successfully`)
        } catch (error) {
            toast.error(`Failed to ${selectedProduct ? 'update' : 'create'} product`)
        }
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Products Management</h1>
                <Button>Add New Product</Button>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="p-4">
                    <Input 
                        type="search" 
                        placeholder="Search products..." 
                        className="max-w-sm"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.product_id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                            variant="outline"
                                            className="mr-2"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(product.product_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Product Form</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={selectedProduct?.name}
                                onChange={(e) => form.setValue('name', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="price"
                                value={selectedProduct?.price}
                                onChange={(e) => form.setValue('price', Number(e.target.value))}
                                type="number"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                                Quantity
                            </Label>
                            <Input
                                id="quantity"
                                value={selectedProduct?.quantity}
                                onChange={(e) => form.setValue('quantity', Number(e.target.value))}
                                type="number"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={() => form.handleSubmit(onSubmit)()}>
                            {selectedProduct ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 