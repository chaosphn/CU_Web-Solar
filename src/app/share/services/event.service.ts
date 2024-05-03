import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private triggerFunctionSource = new Subject<void>();

  triggerFunction$ = this.triggerFunctionSource.asObservable();

  private triggerNavbarSource = new Subject<void>();

  triggerNavbar$ = this.triggerNavbarSource.asObservable();

  triggerFunction(): void {
    this.triggerFunctionSource.next();
  }

  changeNavbar(): void{
    this.triggerNavbarSource.next();
  }
}
