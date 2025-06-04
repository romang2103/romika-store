import { ProductData, ProductDocument } from "@/interfaces/interfaces";
import { 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "@/data-access/products";

export async function createProductUseCase(productData: ProductDocument): Promise<ProductDocument> {        
  try {
    const newProduct = await createProduct(productData);
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProductUseCase(productId: number, productData: Partial<ProductData>): Promise<ProductData> {
  try {
    const updatedProduct = await updateProduct(productId, productData);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

export async function deleteProductUseCase(productId: number): Promise<void> {
  try {
    await deleteProduct(productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
} 