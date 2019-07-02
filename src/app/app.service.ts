import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vescell } from 'ng-container-terminal';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {}

  getPrestow() {
    return this.http.get<Vescell<any>[]>(
      // 'http://0.0.0.0:5001/prestow/' + 'P170323001C'
      'http://0.0.0.0:5001/prestow/' + 'P1812050001'
    );
  }
}
