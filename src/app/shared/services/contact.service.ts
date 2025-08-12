import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { ContactForm } from '../models/mahlatji-business.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  submitContactForm(formData: ContactForm): Observable<{ success: boolean; message: string }> {
    // Simulate form validation
    if (!this.validateForm(formData)) {
      return throwError(() => new Error('Please fill in all required fields'));
    }

    // Simulate API call
    return of({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    }).pipe(delay(1000));
  }

  private validateForm(formData: ContactForm): boolean {
    return !!(
      formData.fullName?.trim() &&
      formData.email?.trim() &&
      formData.subject?.trim() &&
      formData.message?.trim() &&
      this.isValidEmail(formData.email)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Method to send inquiry about specific property
  sendPropertyInquiry(propertyId: string, message: string, contactInfo: Partial<ContactForm>): Observable<{ success: boolean; message: string }> {
    const inquiry = {
      propertyId,
      message,
      ...contactInfo
    };

    // Simulate API call
    console.log('Property inquiry submitted:', inquiry);
    
    return of({
      success: true,
      message: 'Your property inquiry has been sent successfully!'
    }).pipe(delay(800));
  }
}
