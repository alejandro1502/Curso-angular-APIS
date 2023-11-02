export interface Product {
  id: string;
  title: string;
  price: number;
  images: string [];
  description: string;
  category: Category;
  taxes?: number;
}

export interface Category{
  id: string;
  name: string;
}


export interface CreateProductDTO extends Omit<Product, 'id' | 'category'>{
  categoryId: number;
}

//El partial hace que todos los datos sean opcionales
export interface UpdateProductDTO extends Partial<CreateProductDTO>{

}
