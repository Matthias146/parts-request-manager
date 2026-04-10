import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-overview',
  imports: [DatePipe],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  private readonly requestsService = inject(RequestsService);

  readonly requests = this.requestsService.getAll();
}
