'use server';

import { fetchProducts } from "@/data-access/products";
import { ProductData } from "@/interfaces/interfaces";

export async function getProductList(filters: number[]): Promise<ProductData[]> {
    try {
        const products = await fetchProducts();
        console.log("Products fetched successfully");

        // If no filters are provided, return all products
        if (filters.length === 0) {
            return products.map(product => ({
                _id: product._id.toString(),
                product_id: product.product_id,
                description: product.description,
                price: product.price,
                name: product.name,
                quantity: product.quantity,
                minimum_order_quantity: product.minimum_order_quantity,
                wholesale_price: product.wholesale_price,
                categories: product.categories,
                search_tags: product.search_tags,
                characteristics: product.characteristics.map(({ name, value, unit }) => ({
                    name,
                    value,
                    unit: isNaN(unit) ? "N/A" : unit, // Handle NaN for unit
                })),
                image_urls: product.image_urls,
                inStock: product.quantity > 0,
            }));
        }

        const stringFilters = filters.map((filter) => filter.toString());

        // Filter and map products only if filters are provided
        const filteredProductList: ProductData[] = products
            .filter(product => product.categories.some(category => stringFilters.includes(category)))
            .map(product => ({
                _id: product._id.toString(),
                product_id: product.product_id,
                description: product.description,
                price: product.price,
                name: product.name,
                quantity: product.quantity,
                minimum_order_quantity: product.minimum_order_quantity,
                wholesale_price: product.wholesale_price,
                categories: product.categories,
                search_tags: product.search_tags,
                characteristics: product.characteristics.map(({ name, value, unit }) => ({
                    name,
                    value,
                    unit: isNaN(unit) ? "N/A" : unit, // Handle NaN for unit
                })),
                image_urls: product.image_urls,
                inStock: product.quantity > 0,
            }));

        return filteredProductList;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Error fetching products');
    }
}
