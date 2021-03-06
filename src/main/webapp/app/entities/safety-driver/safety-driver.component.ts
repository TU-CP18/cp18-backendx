import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { ISafetyDriver } from 'app/shared/model/safety-driver.model';
import { Principal } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { SafetyDriverService } from './safety-driver.service';

import { Chart } from 'chart.js';

@Component({
    selector: 'jhi-safety-driver',
    templateUrl: './safety-driver.component.html'
})
export class SafetyDriverComponent implements OnInit, OnDestroy {
    currentAccount: any;
    safetyDrivers: ISafetyDriver[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    numberActive: number;
    numberInactive: number;

    chart = [];

    constructor(
        private safetyDriverService: SafetyDriverService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.safetyDriverService
                .search({
                    page: this.page - 1,
                    query: this.currentSearch,
                    size: this.itemsPerPage,
                    sort: this.sort()
                })
                .subscribe(
                    (res: HttpResponse<ISafetyDriver[]>) => this.paginateSafetyDrivers(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.safetyDriverService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ISafetyDriver[]>) => this.paginateSafetyDrivers(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );

        this.safetyDriverService.getSafetyDriverStatistics().subscribe(
            (res: HttpResponse<any>) => {
                console.log(res);
                res.body.entries.forEach(item => {
                    if (item.type === 'active') {
                        this.numberActive = item.number;
                    } else if (item.type === 'inactive') {
                        this.numberInactive = item.number;
                    }
                });

                this.createChart();
            },
            (res: HttpErrorResponse) => {}
        );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/safety-driver'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/safety-driver',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/safety-driver',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInSafetyDrivers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISafetyDriver) {
        return item.id;
    }

    registerChangeInSafetyDrivers() {
        this.eventSubscriber = this.eventManager.subscribe('safetyDriverListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private paginateSafetyDrivers(data: ISafetyDriver[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.safetyDrivers = data;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    private createChart() {
        this.chart = new Chart('canvas', {
            type: 'pie',
            data: {
                datasets: [
                    {
                        data: [this.numberActive, this.numberInactive],
                        backgroundColor: ['#3e95cd', '#8e5ea2']
                    }
                ],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['currently working safety drivers', 'currently not working safety drivers']
            },
            options: {}
        });
    }
}
