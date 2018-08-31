import { Injectable, Component } from '@angular/core';
import { HttpModule, Http, Request, RequestMethod, Response, ResponseOptions, Headers, RequestOptions } from '@angular/http';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { UserModel } from './model';

@Component({
    providers: [Http]
})

@Injectable()

export class UserService {
    public headers: Headers;
    public _getUrl: string = '/api/Values/GetUser';
    public _getByIdUrl: string = '/api/Values/GetByID';
    public _deleteByIdUrl: string = '/api/Values/DeleteByID';
    public _saveUrl: string = '/api/Values/Save';

    constructor(private _http: Http) { }

    getall(): Observable<UserModel[]> {
        return this._http.get(this._getUrl)
            .pipe(map(res => <UserModel[]>res.json()))
            .pipe(catchError(this.handleError));
    }

    getByID(id: string): Observable<UserModel> {
        var getByIdUrl = this._getByIdUrl + '/' + id;
        return this._http.get(getByIdUrl)
            .pipe(map(res => <UserModel>res.json()))
            .pipe(catchError(this.handleError));
    }

    save(user: UserModel): Observable<string> {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this._saveUrl, body, options)
            .pipe(map(res => res.json().message))
            .pipe(catchError(this.handleError));
    }

    delete(id: string): Observable<string> {
        var deleteBuIdUrl = this._deleteByIdUrl + '/' + id;
        return this._http.delete(deleteBuIdUrl)
            .pipe(map(response => response.json().message))
            .pipe(catchError(this.handleError));
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Opps!! Server error');
    }   
}