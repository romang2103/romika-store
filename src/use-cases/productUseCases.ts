'use server';

import { fetchProducts } from "@/data-access/productRepository";
import { ProductData } from "@/interfaces/interfaces";

export async function getAllProducts(): Promise<ProductData[]> {
    try {
        const products = await fetchProducts();
        console.log("Products fetched successfully");
        return products.map(product => ({
            _id: product._id?.toString(),
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
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Error fetching products');
    }
}

export async function getProductList(filters: number[]): Promise<ProductData[]> {
    try {
        const products = await fetchProducts();
        console.log("Products fetched successfully");

        // Convert filters to string for comparison
        const stringFilters = filters.map((filter) => filter.toString());

        // Filter and map products
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
