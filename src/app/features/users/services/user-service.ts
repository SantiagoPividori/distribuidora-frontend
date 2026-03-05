import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

}
