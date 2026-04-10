import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RequestsService } from '../requests.service';
import { StatusDisplayPipe } from '../../../shared/pipes/status-display.pipe';

@Component({
  selector: 'app-overview',
  imports: [DatePipe, StatusDisplayPipe],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  private readonly requestsService = inject(RequestsService);

  readonly requests = this.requestsService.getAll();
}
