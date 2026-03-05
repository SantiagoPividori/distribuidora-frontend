import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  private tokenKey = 'accessToken';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      if (!token) return null;

      const decoded: any = jwtDecode(token);

      return decoded.sub;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}
