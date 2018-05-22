import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService{

    constructor(private http: Http) {

    }

    public getJSON(): Observable<any> {
        return this.http.get("./assets/test.json")
            .map((res: any) => res.json())
            .catch((error: any) => error);

    }
}