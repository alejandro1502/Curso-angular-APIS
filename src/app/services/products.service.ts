import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products'

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  //Post clase 5
  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  //Put clase 6
  update(id: string, dto : UpdateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  //Delete clase 7
  delete(id:string){
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`)
  }
}
