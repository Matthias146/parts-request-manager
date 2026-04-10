import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'statusDisplay',
})
export class StatusDisplayPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'under_examination':
        return 'Under Examination';
      case 'open':
        return 'Open';
      case 'ordered':
        return 'Ordered';
      case 'closed':
        return 'Closed';
      default:
        return value;
    }
  }
}
