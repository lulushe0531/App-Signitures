import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { HttpErrorResponse } from '@angular/common/http';
import { AppSig } from '../models/appSig';


@Component({
    selector: 'app-table',
    templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
    public rows:Array<any> = [];
    public columns:Array<any> = [
      {title: 'Name', name: 'name', filtering: {filterString: '', placeholder: 'Filter by name'}},
      {
        title: 'Category',
        name: 'category',
        sort: false,
        filtering: {filterString: '', placeholder: 'Filter by category'}
      },
      {title: 'ID', className: ['text-success'], name: 'appSigId', sort: 'asc'},
      {title: 'Vendor', name: 'vendor', sort: '', filtering: {filterString: '', placeholder: 'Filter by vendor'}},
      {title: 'Release date', className: 'text-warning', name: 'releaseDate'},
      {title: 'Behavior', name: 'behavior'}
    ];
    public page:number = 1;
    public itemsPerPage:number = 10;
    public maxSize:number = 5;
    public numPages:number = 1;
    public length:number = 0;
  
    public config:any = {
      paging: true,
      sorting: {columns: this.columns},
      filtering: {filterString: ''},
      className: ['table-striped', 'table-bordered']
    };
  
    private data:Array<any>;
  
    public constructor(private dataService : DataService ) {
      this.data = [];
      this.length = this.data.length;
    }
  
    public ngOnInit():void {
      
      this.dataService.getJSON().subscribe(data => {
        data.forEach(appSig => {
          let appObject: AppSig = {
            name: appSig[0],
            appSigId: appSig[14],
            category: appSig[1],
            releaseDate: appSig[5],
            vendor: appSig[6],
            behavior: appSig[8]
          }
          //console.log(appObject)
          this.data.push(appObject);
        });
        this.onChangeTable(this.config);
    });

    }
  
    public changePage(page:any, data:Array<any> = this.data):Array<any> {
      let start = (page.page - 1) * page.itemsPerPage;
      let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
      return data.slice(start, end);
    }
  
    public changeSort(data:any, config:any):any {
      if (!config.sorting) {
        return data;
      }
  
      let columns = this.config.sorting.columns || [];
      let columnName:string = void 0;
      let sort:string = void 0;
  
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].sort !== '' && columns[i].sort !== false) {
          columnName = columns[i].name;
          sort = columns[i].sort;
        }
      }
  
      if (!columnName) {
        return data;
      }
  
      // simple sorting
      return data.sort((previous:any, current:any) => {
        if (previous[columnName] > current[columnName]) {
          return sort === 'desc' ? -1 : 1;
        } else if (previous[columnName] < current[columnName]) {
          return sort === 'asc' ? -1 : 1;
        }
        return 0;
      });
    }
  
    public changeFilter(data:any, config:any):any {
      let filteredData:Array<any> = data;
      this.columns.forEach((column:any) => {
        if (column.filtering) {
          
          filteredData = filteredData.filter((item:any) => {
            if(item[column.name]){
              return item[column.name].toString().match(column.filtering.filterString);
            }
            return;
          });
        }
      });
  
      if (!config.filtering) {
        return filteredData;
      }
  
      if (config.filtering.columnName) {
        return filteredData.filter((item:any) =>
          item[config.filtering.columnName].match(this.config.filtering.filterString));
      }
  
      let tempArray:Array<any> = [];
      filteredData.forEach((item:any) => {
        let flag = false;
        this.columns.forEach((column:any) => {
          if(item[column.name]){
            if (item[column.name].toString().match(this.config.filtering.filterString)) {
              flag = true;
            }
          }
          
        });
        if (flag) {
          tempArray.push(item);
        }
      });
      filteredData = tempArray;
  
      return filteredData;
    }
  
    public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
      if (config.filtering) {
        Object.assign(this.config.filtering, config.filtering);
      }
  
      if (config.sorting) {
        Object.assign(this.config.sorting, config.sorting);
      }
  
      let filteredData = this.changeFilter(this.data, this.config);
      let sortedData = this.changeSort(filteredData, this.config);
      this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
      this.length = sortedData.length;
    }
  
    public onCellClick(data: any): any {
      console.log(data);
    }
  }