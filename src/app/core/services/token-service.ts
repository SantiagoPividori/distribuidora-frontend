import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class TokenService {

  private readonly accessKey  = 'accessToken';
  private readonly refreshKey = 'refreshToken';

  // ── Verifica si estamos en el browser ────────────
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // ── Access token ──────────────────────────────────
  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.accessKey);
  }

  setToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.accessKey, token);
  }

  removeToken(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.accessKey);
  }

  // ── Refresh token ─────────────────────────────────
  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.refreshKey);
  }

  setRefreshToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.refreshKey, token);
  }

  removeRefreshToken(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.refreshKey);
  }

  // ── Utils ─────────────────────────────────────────
  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}