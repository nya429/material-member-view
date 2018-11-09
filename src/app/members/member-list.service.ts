import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Subject } from "rxjs";

@Injectable()
export class MemberListService {
    members = [];
    membersChanged = new Subject<object>();
    typeSuggested = new Subject<[{start: number, suggestion: string}]>();
    memberLoading = new Subject<null>();
    memebrFilterReseted = new Subject<null> ();
    careLocationLoaded = new Subject<{counties:{key: string, value:string}[],
    cities:{key: string, value:string}[]}> ();

    membersSelected = new Subject<object>();
    memberSelection = [];

    matchIndice = [];
    memberLookuped = new Subject<{matches: number[], isLooking: boolean}>();
    flattenMembers = [];
    memberMatchSelected = new Subject<boolean>();

    memebrReportReady = new Subject<object[]> ();

    constructor(private httpClient: HttpClient) { }

    filterForm = {
        'city': "",
        'county': "",
        'disenrolled': false,
        'dob': "",
        'firstName': "",
        'lastName': "",
        'program': "",
        'programEndDate': "",
        'programStartDate': "",
        'offset': 0,
        'limit': 10,
        'sortColoumn': 'nn.NAME_ID',
        'sortDirection': 'ASC'
    }

    getCareManagers() {
        return [
            {key:'All', value:''},    
            {key:'CAB', value:'CAB'},
            {key:'BIO', value:'BIO'},
            ];
    }

    getCareLocations() {
        return this.httpClient.get(`http://localhost:5000/address/filterlocation/list` , {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result: {cities: string[], counties: string[]}) => {
                let locations = {cities: [], counties: []};
                locations.cities = this.formatCityCountyOptions(result.cities);
                locations.counties = this.formatCityCountyOptions(result.counties);
                console.log(locations);
                this.careLocationLoaded.next(locations);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    formatCityCountyOptions(items: string[]) {
        let options = [{key:'All', value:''}];  
        items.map(item => {
            options.push({key: item.replace(/^\w/, chr => chr.toUpperCase()), value: item})
        })
        return options;
    }

    getPrograms() {
        return [ 
            {key:'All', value:''},    
            {key:'ICO', value:'ICO'},
            {key:'SCO', value:'SCO'},
            {key:'CCC', value:'CCC'},
            ]; 
    }

    paginateMemberList(offset: number = 0, pageSize: number = 10, sortColoumn?:string, sortDirection?:string) {
        const request = {
            'offset': offset,
            'limit': pageSize,
            'sortColoumn': sortColoumn ? sortColoumn : 'nn.NAME_ID',
            'sortDirection': sortDirection ? sortDirection : 'ASC'
        }

        updateForm(this.filterForm, request);
        this.getMemebrList();
    }

    getMemebrList() {
        this.memberLoading.next();
        // const request = {
        //     'offset': offset,
        //     'limit': pageSize,
        //     'sortColoumn': sortColoumn ? sortColoumn : 'nn.NAME_ID',
        //     'sortDirection': sortDirection ? sortDirection : 'ASC'
        // }
    
        // updateForm(this.filterForm, request);
 
        return this.httpClient.post(`http://localhost:5000/member/list`, this.filterForm, {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result) => {
                    this.changeMemberList(result);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    changeMemberList(result) {
        this.members = result['members'];
        this.flattenMembers = flattenMap(result['members']);
        this.membersChanged.next(result);
    }

    serachMemebr(form) {
        this.filterForm.offset = 0;
        updateForm(this.filterForm, form);
        this.getMemebrList();
    }

    typeAhead(form) {
        return this.httpClient.post(`http://localhost:5000/member/quick_search_test`, form, {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result) => {
                 this.typeSuggested.next(result['result'])
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    filterReset() {
        const patch = 
            {
                'city': "",
                'county': "",
                'disenrolled': false,
                'dob': "",
                'firstName': "",
                'lastName': "",
                'program': "",
                'programEndDate': "",
                'programStartDate': "",
                'offset': 0,
                'sortColoumn': 'nn.NAME_ID',
                'sortDirection': 'ASC'
            }
        updateForm(this.filterForm, patch);
        this.memebrFilterReseted.next();
    }

    selectMember(selected, numRow) {
        this.memberSelection = selected;
        const selection = {selected:  this.memberSelection, numRow: numRow};
        this.membersSelected.next(selection);
    }

    quickLookup(searchStr: string) {
        const re = /[,\s\\\-\/]+/gi;
        const isLooking = searchStr.length > 0;
        let matchIndice = [];
        let matchCCAid = [];
        if (isLooking) {
            const patterns = searchStr.trim().toLowerCase().split(re);
            const patternLen = patterns.length;
            this.flattenMembers.forEach((flattenMember, index) => {
                let mutablePatterns = [...patterns];
                const flat = flattenMember['flattenStr'];
                const match = mutablePatterns.reduce((match, pattern) => 
                flat.search(pattern) >=0 ? match+=1 : mutablePatterns.splice(1)
                , 0);
                match == patternLen ?  matchIndice.push(index) : null;
                match == patternLen ?  matchCCAid.push(flattenMember['ccaid']) : null;
            });
        }
        this.setMatchNum(matchCCAid, isLooking);
        this.memberLookuped.next({matches: matchIndice, isLooking: isLooking});
    }

    toggleMatchSelect() {
        this.memberSelection.length > 0 && this.isAllMatchSelected()? 
        this.memberMatchSelected.next(false) : 
        this.memberMatchSelected.next(true);
    }

    setMatchNum(matchIndice: any[], isLooking: boolean) {
        this.matchIndice = isLooking ?  matchIndice : [];
    }

    getMatchNum() {
        return this.matchIndice.length;
    }

    isAllMatchSelected() {
        let matchCount = this.memberSelection.reduce((count, selected) => 
            this.matchIndice.includes(selected.ccaid) ? count+=1 : count
        , 0);
        return matchCount === this.matchIndice.length;
    }

    isMatchSelected() {
        let matchCount = this.memberSelection.reduce((count, selected) => 
        this.matchIndice.includes(selected.ccaid) ? count+=1 : count
    , 0);
        return matchCount !== 0;
    }

    getReportDate(request) {
        return this.httpClient.post(`http://localhost:5000/member/list/report`, request, {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result) => {
                 this.memebrReportReady.next(result['members']);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    } 
}

function updateForm(target: object, patch: object) {
    Object.keys(target).map(key => {
        if(`${key}` in patch) {
            target[`${key}`] = patch[`${key}`]
        }
    })
}

function flattenMap(target: object[]) {
    const re = /[,\s\\\-\/]+/gi;
    console.log(target)
    return target.map(obj => {
      const flattenStr = Object.keys(obj).reduce(
        (flat, key) => obj[`${key}`] ? 
            flat.concat(obj[`${key}`].trim().replace(re, '').toLowerCase()) : 
            flat, 
        "");
        const ccaid = obj['ccaid'] ? obj['ccaid'] : flattenStr;
        return new Object({'flattenStr': flattenStr, 'ccaid': ccaid});
    });
  }