import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageSubject = new BehaviorSubject<string | null>(localStorage.getItem('siteName'));

  getStorageChanges(): Observable<string | null> {
    return this.storageSubject.asObservable();
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    this.storageSubject.next(value);
  }
}
