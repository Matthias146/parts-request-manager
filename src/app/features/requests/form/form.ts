import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RequestsService } from '../requests.service';
import { Priority, RequestStatus } from '../../../core/models/spare-part-request.model';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  private readonly formBuilder = inject(FormBuilder);
  private readonly requestsService = inject(RequestsService);

  readonly requests = this.requestsService.getAll();
  readonly submitError = signal('');

  readonly priorities: Priority[] = ['low', 'medium', 'high'];
  readonly statuses: RequestStatus[] = ['open', 'under_examination', 'ordered', 'closed'];

  readonly requestForm = this.formBuilder.nonNullable.group({
    partName: ['', [Validators.required, Validators.minLength(2)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    vehicleModel: ['', [Validators.required, Validators.minLength(2)]],
    priority: ['medium' as Priority, [Validators.required]],
    status: ['open' as RequestStatus, [Validators.required]],
    requestedBy: ['', [Validators.required, Validators.minLength(2)]],
  });

  submit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.submitError.set('Please correct the highlighted fields.');
      return;
    }

    this.submitError.set('');

    const value = this.requestForm.getRawValue();
    const nextId = Math.max(0, ...this.requests().map((request) => request.id)) + 1;

    this.requestsService.add({
      id: nextId,
      partName: value.partName.trim(),
      quantity: value.quantity,
      vehicleModel: value.vehicleModel.trim(),
      priority: value.priority,
      status: value.status,
      requestedBy: value.requestedBy.trim(),
      requestedAt: new Date(),
    });

    this.requestForm.reset({
      partName: '',
      quantity: 1,
      vehicleModel: '',
      priority: 'medium',
      status: 'open',
      requestedBy: '',
    });
  }

  hasError(controlName: keyof typeof this.requestForm.controls, errorName: string) {
    const control = this.requestForm.controls[controlName];
    return control.touched && control.hasError(errorName);
  }

}
