import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product, User } from '../../interfaces/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: User | null = null;
  myProducts: Product[] = [];
  isEditing = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  selectedImageFile: File | null = null;
  imagePreview: string = '';

  profileForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadMyProducts();
  }

  loadProfile() {
    this.isLoading = true;
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.user = res.user;
        this.initForm(res.user);
      },
      error: () => {
        this.isLoading = false;
        // fallback to cached user
        this.user = this.authService.getCurrentUser();
        if (this.user) this.initForm(this.user);
      },
    });
  }

  loadMyProducts() {
    this.productService.getMyProducts().subscribe({
      next: (res) => {
        this.myProducts = res.products || [];
      },
      error: () => {},
    });
  }

  initForm(user: User) {
    this.profileForm = this.fb.group({
      name: [user.name || '', [Validators.required, Validators.minLength(2)]],
      phone: [user.phone || ''],
      hostel: [user.hostel || ''],
      roomNumber: [user.roomNumber || ''],
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedImageFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedImageFile);
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('phone', this.profileForm.value.phone || '');
    formData.append('hostel', this.profileForm.value.hostel || '');
    formData.append('roomNumber', this.profileForm.value.roomNumber || '');
    if (this.selectedImageFile) {
      formData.append('profileImage', this.selectedImageFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        this.user = res.user;
        this.isEditing = false;
        this.selectedImageFile = null;
        this.imagePreview = '';
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to update profile.';
      },
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedImageFile = null;
    this.imagePreview = '';
    this.errorMessage = '';
    if (this.user) this.initForm(this.user);
  }

  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) return product.images[0];
    return '/mackbook.jpg';
  }

  getSellerName(seller: any): string {
    if (typeof seller === 'object' && seller?.name) return seller.name;
    return 'Me';
  }
}
