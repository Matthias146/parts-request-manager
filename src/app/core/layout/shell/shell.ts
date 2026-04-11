import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly appName = signal('Spare Parts Hub');
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);

  logout() {
    this.storageService.logout();
    this.storageService.clearError();
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
