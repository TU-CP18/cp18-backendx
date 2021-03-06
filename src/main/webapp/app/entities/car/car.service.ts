import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICar } from 'app/shared/model/car.model';
import { ICarIssue } from 'app/shared/model/car-issue.model';
import { ICarCleanliness } from 'app/shared/model/car-cleanliness.model';

type EntityResponseType = HttpResponse<ICar>;
type EntityArrayResponseType = HttpResponse<ICar[]>;

@Injectable({ providedIn: 'root' })
export class CarService {
    public resourceUrl = SERVER_API_URL + 'api/cars';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/cars';
    public resourceUrlCC = SERVER_API_URL + 'api/car-cleanlinesses';

    constructor(private http: HttpClient) {}

    create(car: ICar): Observable<EntityResponseType> {
        return this.http.post<ICar>(this.resourceUrl, car, { observe: 'response' });
    }

    update(car: ICar): Observable<EntityResponseType> {
        return this.http.put<ICar>(this.resourceUrl, car, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICar>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICar[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    getActiveCars(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICar[]>(this.resourceUrl + '/active', { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICar[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }

    getCarStatistics(): Observable<HttpResponse<any>> {
        return this.http.get<Number>(`${this.resourceUrl}/statistics`, { observe: 'response' });
    }
    getIssueForCar(id: Number): Observable<HttpResponse<any>> {
        return this.http.get<ICarIssue[]>(`${this.resourceUrl}/` + `${id}` + '/issues', { observe: 'response' });
    }
    getCleanlinessForCar(): Observable<HttpResponse<any>> {
        return this.http.get<ICarCleanliness[]>(`${this.resourceUrlCC}`, { observe: 'response' });
    }
}
