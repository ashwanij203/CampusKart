import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sell-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sell-product.html',
  styleUrl: './sell-product.css',
})
export class SellProduct {
  imagePreviews: string[] = [];

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],

      category: ['', Validators.required],

      condition: ['', Validators.required],

      price: ['', Validators.required],

      location: ['', Validators.required],

      description: ['', Validators.required],
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    this.imagePreviews = [];

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };

      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  publishProduct(): void {
    if (this.productForm.valid) {
      console.log(this.productForm.value);

      alert('Product Published Successfully!');
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
