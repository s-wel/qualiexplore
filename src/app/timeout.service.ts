import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './qualiexplore/auth/auth.service';

@Injectable()
export class TimeoutService {
  //intactivity timer 20 mins
  private timeoutDuration = 20 * 60000; // 20 * 60000 ms = 20 min
  private timeoutTimer: Observable<number>;
  private timeoutSubject = new Subject();

  constructor(private authService:AuthService) {
    this.timeoutTimer = timer(this.timeoutDuration);
  }

  startTimer(): void {
    this.timeoutTimer
      .pipe(takeUntil(this.timeoutSubject))
      .subscribe(() => {
        // close any pop up modal if it's open
        let ref = document.getElementById('cancel');
        if(ref){
          ref.click()
          this.authService.logout()
        }
        else{
          this.authService.logout()
        }
      });
  }

  resetTimer(): void {
    this.timeoutSubject.next();
    this.startTimer();
  }
}
