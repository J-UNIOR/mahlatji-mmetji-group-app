import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../shared/services/contact.service';
import { ContactForm } from '../../shared/models/mahlatji-business.interface';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  contactForm: ContactForm = {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  };

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);

  // Company contact information
  companyInfo = {
    address: '8 John Street, Eldorette, Akasia, Pretoria, 0182, South Africa',
    phone: '+27 12 001 0576',
    email: 'info@mahlatjimmetji.co.za',
    hours: {
      weekdays: '8:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    coordinates: {
      lat: -25.6599318,
      lng: 28.130212
    }
  };

  private contactService = inject(ContactService);

  // Removed empty constructor

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isSubmitting()) {
      this.markFormGroupTouched(form);
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(false);

    this.contactService.submitContactForm(this.contactForm).subscribe({
      next: (response: { success: boolean }) => {
        if (response.success) {
          this.submitSuccess.set(true);
          this.resetForm(form);
        }
        this.isSubmitting.set(false);
      },
      error: (error: unknown) => {
        console.error('Contact form submission error:', error);
        let message = 'Failed to send message. Please try again.';
        if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string') {
          message = (error as { message?: string }).message!;
        }
        this.submitError.set(message);
        this.isSubmitting.set(false);
      }
    });
  }

  onRetrySubmit(form: NgForm): void {
    this.submitError.set(null);
    this.onSubmit(form);
  }

  private markFormGroupTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  private resetForm(form: NgForm): void {
    this.contactForm = {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      serviceInterest: '',
      subject: '',
      message: '',
      preferredContact: 'email'
    };
    form.resetForm();
  }

  onCallUs(): void {
    window.location.href = `tel:${this.companyInfo.phone}`;
  }

  onEmailUs(): void {
    window.location.href = `mailto:${this.companyInfo.email}`;
  }

  onGetDirections(): void {
    const address = encodeURIComponent(this.companyInfo.address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, '_blank');
  }
}
