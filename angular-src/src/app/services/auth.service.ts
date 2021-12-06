import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { User, Login, UserNoPW } from '../models/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  prepEndpoint(ep) {
    // 1. 로컬 서버에서 개발시
    // return 'http://localhost:3000/' + ep;

    // 2. 클라우드 서버에서 운영시
    return ep;
  }

  registerUser(user: User): Observable<any> {
    const registerUrl = this.prepEndpoint('users/register');
    return this.http.post<any>(registerUrl, user, httpOptions);
  }

  registerCard(card: any): Observable<any> {
    const registerCardUrl = this.prepEndpoint('users/card');
    return this.http.post<any>(registerCardUrl, card, httpOptions);
  }

  authenticateUser(login: Login): Observable<any> {
    const loginUrl = this.prepEndpoint('users/authenticate');
    return this.http.post<any>(loginUrl, login, httpOptions);
  }

  storeUserData(token: any, userNoPW: UserNoPW) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userNoPW', JSON.stringify(userNoPW));
  }

  logout() {
    localStorage.clear();
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('userNoPW');
  }

  getProfile(): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    // 토큰을 포함한 헤더 옵션 생성
    const httpOptions1 = {
      headers: new HttpHeaders({
        ContentType: 'application/json',
        authorization: 'Bearer ' + authToken,
      }),
    };
    const profileUrl = this.prepEndpoint('users/profile');
    return this.http.get<any>(profileUrl, httpOptions1);
  }

  // 사용자의 명함을 읽어오는 함수
  getCard(username: any): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    const httpOptions1 = {
      headers: new HttpHeaders({
        contentType: 'application/json',
        authorization: 'Bearer' + authToken,
      }),
    };
    const myCardUrl = this.prepEndpoint('users/mycard');
    return this.http.post<any>(myCardUrl, username, httpOptions1);
  }

  // Show user list (just testing DB query)
  getList(): Observable<any> {
    let authToken: any = localStorage.getItem('authToken');
    const httpOptions1 = {
      headers: new HttpHeaders({
        contentType: 'application/json',
        authorization: 'Bearer ' + authToken,
      }),
    };
    const listUrl = this.prepEndpoint('users/list');
    return this.http.get<any>(listUrl, httpOptions1);
  }

  loggedIn(): boolean {
    let authToken: any = localStorage.getItem('authToken');
    return !this.jwtHelper.isTokenExpired(authToken);
  }

  // 환율정보 얻어오기
  getRate(): Observable<any> {
    const APIKey = '109ed01ec33a01f29fb8108938f54b75';
    return this.http.get<any>(
      `http://api.exchangeratesapi.io/v1/latest?access_key=${APIKey}`
    );
  }
}
