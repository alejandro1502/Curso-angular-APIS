import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';

import {environment} from './../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?:number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit',limit)
      params = params.set('offset',limit)
    }
    return this.http.get<Product[]>(this.apiUrl,{params})
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return{
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }


  fetchReadAndUpdate(id: string, dto: UpdateProductDTO){
    return zip(
      this.getProduct(id),
      this.update(id, dto)
    );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) =>{
        if(error.status === HttpStatusCode.Conflict){
          return throwError('Server error')
        }
        if(error.status === HttpStatusCode.NotFound){
          return throwError('Not found')
        }
        if(error.status === HttpStatusCode.Unauthorized){
          return throwError('Unauthorized')
        }
        return throwError('ups algo  salio mal')
      })
    )
  }

  //Clase 8 url parameters/Paginacion
  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`,{
      params: { limit, offset }
    })
    .pipe(
      retry(3),
      map(products => products.map(item =>{
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    )
    };

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
