import { Component, OnInit } from '@angular/core';

import { Product, CreateProductDTO, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id:'',
      name:'',
    },
    description: ''
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success'|'error'|'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10,0)
    .subscribe(data => {
      this.products = data;
      this.offset += this.limit;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  //Para mostrar la ventana del detalle del producto Clase 3
  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.productChosen = data;
      this.statusDetail = 'success';
    },errorMsg => {
      window.alert(errorMsg);
      this.statusDetail = 'error';
    })
  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title:'Nuevo producto',
      description:'bl bla bla',
      images:[''],
      price: 1000,
      categoryId: 2

    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data)
    })
  }

  updateProduct(){
    const changes: UpdateProductDTO =  {
      title: 'nuevo title',

    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id)
      this.products[productIndex] = data;
      this.productChosen = data;
    })
  }


  deleteProduct(){
    const id = this.productChosen.id;

    this.productsService.delete(id)

    .subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id)
      this.products.splice(productIndex,1)
      this.showProductDetail = false;
    })
  }

  //Para ir teniendo algunos producto y a la medida que el cliente quiera cargar mas va cargando
  //Clase 8
  loadMore(){
    this.productsService.getProductsByPage(this.limit,this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

}
