import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-sell-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sell-product.html',
  styleUrl: './sell-product.css',
})
export class SellProduct {
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.imagePreviews = [];
    this.selectedFiles = Array.from(input.files);

    this.selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  publishProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('title', this.productForm.value.title);
    formData.append('category', this.productForm.value.category);
    formData.append('condition', this.productForm.value.condition);
    formData.append('price', this.productForm.value.price);
    formData.append('location', this.productForm.value.location);
    formData.append('description', this.productForm.value.description);

    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.productService.addProduct(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = 'Product published successfully!';
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to publish product. Please try again.';
      },
    });
  }
}
