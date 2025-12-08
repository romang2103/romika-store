"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductData, ProductDocument } from "@/interfaces/interfaces";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from '@/store/useCategoryStore';
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
} from "@/components/ui/dialog";
import { toast } from "sonner"
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search, X, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormData {
    product_id: number;
    name: string;
    description: string[];
    price: number;
    quantity: number;
    minimum_order_quantity: number | null;
    wholesale_price: number | null;
    categories: string[];
    search_tags: string[];
    image_urls: string[];
    characteristics: { name: string; value: string; unit: string }[];
}

export default function ProductsManagement() {
    const { products, fetchProducts } = useProductStore();
    const { categories, fetchCategories } = useCategoryStore();
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        product_id: 0,
        name: "",
        description: [""],
        price: 0,
        quantity: 0,
        minimum_order_quantity: null,
        wholesale_price: null,
        categories: [],
        search_tags: [],
        image_urls: [""],
        characteristics: [],
    });
    const [categoryInput, setCategoryInput] = useState("");
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([loadProducts(), loadCategories()]);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const loadCategories = async () => {
        try {
            await fetchCategories();
        } catch (error) {
            toast.error("Failed to load categories");
        }
    };

    const loadProducts = async () => {
        try {
            await fetchProducts();
        } catch (error) {
            toast.error("Failed to load products");
        }
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsSubmitting(false);
        setFormData({
            product_id: Math.max(...products.map(p => p.product_id), 0) + 1,
            name: "",
            description: [""],
            price: 0,
            quantity: 0,
            minimum_order_quantity: null,
            wholesale_price: null,
            categories: [],
            search_tags: [],
            image_urls: [""],
            characteristics: [],
        });
        setIsModalOpen(true);
    };

    const handleEdit = (product: ProductData) => {
        setSelectedProduct(product);
        setIsSubmitting(false);
        setFormData({
            product_id: product.product_id,
            name: product.name,
            description: product.description || [""],
            price: product.price,
            quantity: product.quantity,
            minimum_order_quantity: product.minimum_order_quantity,
            wholesale_price: product.wholesale_price,
            categories: product.categories || [],
            search_tags: product.search_tags || [],
            image_urls: product.image_urls || [""],
            characteristics: product.characteristics || [],
        });
        setIsModalOpen(true);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const productData: ProductDocument = {
                ...formData,
                inStock: formData.quantity > 0,
            };

            if (selectedProduct) {
                await updateProductUseCase(selectedProduct.product_id, productData);
                toast.success("Product updated successfully");
            } else {
                await createProductUseCase(productData);
                toast.success("Product created successfully");
            }

            await loadProducts();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(`Failed to ${selectedProduct ? 'update' : 'create'} product`);
        } finally {
            // Add a small delay before re-enabling the button to prevent rapid double-clicks
            setTimeout(() => {
                setIsSubmitting(false);
            }, 1000);
        }
    };

    const addDescriptionLine = () => {
        setFormData(prev => ({
            ...prev,
            description: [...prev.description, ""]
        }));
    };

    const updateDescriptionLine = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.map((line, i) => i === index ? value : line)
        }));
    };

    const removeDescriptionLine = (index: number) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description.filter((_, i) => i !== index)
        }));
    };

    const addImageUrl = () => {
        setFormData(prev => ({
            ...prev,
            image_urls: [...prev.image_urls, ""]
        }));
    };

    const updateImageUrl = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            image_urls: prev.image_urls.map((url, i) => i === index ? value : url)
        }));
    };

    const removeImageUrl = (index: number) => {
        setFormData(prev => ({
            ...prev,
            image_urls: prev.image_urls.filter((_, i) => i !== index)
        }));
    };

    const addCategory = () => {
        if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, categoryInput.trim()]
            }));
            setCategoryInput("");
        }
    };

    const removeCategory = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== category)
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.search_tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                search_tags: [...prev.search_tags, tagInput.trim()]
            }));
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            search_tags: prev.search_tags.filter(t => t !== tag)
        }));
    };

    const addCharacteristic = () => {
        setFormData(prev => ({
            ...prev,
            characteristics: [...prev.characteristics, { name: "", value: "", unit: "" }]
        }));
    };

    const updateCharacteristic = (index: number, field: 'name' | 'value' | 'unit', value: string) => {
        setFormData(prev => ({
            ...prev,
            characteristics: prev.characteristics.map((char, i) =>
                i === index ? { ...char, [field]: value } : char
            )
        }));
    };

    const removeCharacteristic = (index: number) => {
        setFormData(prev => ({
            ...prev,
            characteristics: prev.characteristics.filter((_, i) => i !== index)
        }));
    };

    const toggleCategoryFilter = (categoryId: number) => {
        setSelectedCategoryIds(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const clearCategoryFilters = () => {
        setSelectedCategoryIds([]);
    };

    const filteredProducts = products.filter(product => {
        // Text search filter
        const matchesSearch = searchQuery === "" ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.some(desc => desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
            product.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = selectedCategoryIds.length === 0 ||
            product.categories?.some(cat => selectedCategoryIds.includes(Number(cat)));

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <Button onClick={handleAddNew} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Product
                </Button>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="p-4 border-b space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="search"
                            placeholder="Search products by name, description, or category..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filter by Category
                            {selectedCategoryIds.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {selectedCategoryIds.length}
                                </Badge>
                            )}
                        </Button>
                        {selectedCategoryIds.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCategoryFilters}
                                className="flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Clear filters
                            </Button>
                        )}
                    </div>

                    {showFilters && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Categories</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category.id}`}
                                            checked={selectedCategoryIds.includes(category.id)}
                                            onCheckedChange={() => toggleCategoryFilter(category.id)}
                                        />
                                        <label
                                            htmlFor={`category-${category.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {categories.length === 0 && (
                                <p className="text-sm text-gray-500">No categories available</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Wholesale Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categories
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.product_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.product_id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {product.image_urls?.[0] && (
                                                    <img
                                                        src={product.image_urls[0]}
                                                        alt={product.name}
                                                        className="w-10 h-10 rounded object-cover mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                    {product.description?.[0] && (
                                                        <div className="text-xs text-gray-500 max-w-xs truncate">
                                                            {product.description[0]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {Number(product.price).toFixed(2)} руб
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.wholesale_price ? `${Number(product.wholesale_price).toFixed(2)} руб` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={product.quantity < 10 ? 'text-red-600 font-semibold' : ''}>
                                                {product.quantity}
                                            </span>
                                            {product.minimum_order_quantity && (
                                                <span className="text-xs text-gray-500 block">
                                                    Min: {product.minimum_order_quantity}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {product.categories?.slice(0, 2).map((category, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {categories.find(cat => cat.id === Number(category))?.name || category}
                                                    </Badge>
                                                ))}
                                                {product.categories?.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{product.categories.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={product.inStock ? "default" : "destructive"}>
                                                {product.inStock ? "In Stock" : "Out of Stock"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(product.product_id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t bg-gray-50">
                    <p className="text-sm text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product_id">Product ID</Label>
                                <Input
                                    id="product_id"
                                    type="number"
                                    value={formData.product_id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, product_id: Number(e.target.value) }))}
                                    disabled={!!selectedProduct}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description Lines</Label>
                            {formData.description.map((line, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={line}
                                        onChange={(e) => updateDescriptionLine(index, e.target.value)}
                                        placeholder={`Description line ${index + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeDescriptionLine(index)}
                                        disabled={formData.description.length === 1}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addDescriptionLine}>
                                <Plus className="w-4 h-4 mr-1" /> Add Description Line
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="wholesale_price">Wholesale Price</Label>
                                <Input
                                    id="wholesale_price"
                                    type="number"
                                    step="0.01"
                                    value={formData.wholesale_price || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        wholesale_price: e.target.value ? Number(e.target.value) : null
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minimum_order_quantity">Minimum Order Quantity</Label>
                                <Input
                                    id="minimum_order_quantity"
                                    type="number"
                                    value={formData.minimum_order_quantity || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        minimum_order_quantity: e.target.value ? Number(e.target.value) : null
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Categories</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={categoryInput}
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                    placeholder="Add category"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                />
                                <Button type="button" onClick={addCategory} variant="outline">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.categories.map((category, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {category}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => removeCategory(category)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Search Tags</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add search tag"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag} variant="outline">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.search_tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                        {tag}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => removeTag(tag)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Image URLs</Label>
                            {formData.image_urls.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={url}
                                        onChange={(e) => updateImageUrl(index, e.target.value)}
                                        placeholder={`Image URL ${index + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeImageUrl(index)}
                                        disabled={formData.image_urls.length === 1}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                                <Plus className="w-4 h-4 mr-1" /> Add Image URL
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Characteristics</Label>
                            {formData.characteristics.map((char, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={char.name}
                                        onChange={(e) => updateCharacteristic(index, 'name', e.target.value)}
                                        placeholder="Name"
                                        className="flex-1"
                                    />
                                    <Input
                                        value={char.value}
                                        onChange={(e) => updateCharacteristic(index, 'value', e.target.value)}
                                        placeholder="Value"
                                        className="flex-1"
                                    />
                                    <Input
                                        value={char.unit}
                                        onChange={(e) => updateCharacteristic(index, 'unit', e.target.value)}
                                        placeholder="Unit"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeCharacteristic(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addCharacteristic}>
                                <Plus className="w-4 h-4 mr-1" /> Add Characteristic
                            </Button>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? (selectedProduct ? 'Updating...' : 'Creating...')
                                    : (selectedProduct ? 'Update Product' : 'Create Product')
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
} 