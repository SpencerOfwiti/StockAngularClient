import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getPredictions(): any {
    return this.http.get('http://45.63.97.7:9090/predictions').pipe(map(res => {
      return res;
    }));
  }
}
