import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DialogService, FormLayout, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { Brand } from 'src/app/@core/data/brandList';
import { BrandListDataService } from 'src/app/@core/mock/brand-data.service';
import { FormConfig } from 'src/app/@shared/components/admin-form';

@Component({
  selector: 'da-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss'],
})
export class BrandListComponent implements OnInit, OnChanges {
  filterAreaShow = false;
  isAdd: string = 'ADD';

  isAddSession: boolean = true;
  @Output() checked = new EventEmitter();

  sortOptions = ['asc', 'desc'];

  searchForm: {
    keyword: '';
    sort: 'asc' | 'desc';
  } = {
    keyword: '',
    sort: 'asc',
  };

  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'id',
      width: '150px',
    },
    {
      field: 'brandName',
      width: '150px',
    },
    {
      field: 'brandCode',
      width: '100px',
    },
    {
      field: 'updatedDate',
      width: '100px',
    },
    {
      field: 'Actions',
      width: '100px',
    },
  ];

  basicDataSource: Brand[] = [];

  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Brand Name',
        prop: 'brandName',
        type: 'input',
        hide: true,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Brand Code',
        prop: 'brandCode',
        type: 'input',
        hide: true,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },

      {
        label: 'Updated At',
        prop: 'updatedAt',
        type: 'datePicker',
        hide: true,
      },
      // {
      //   label: 'Session',
      //   prop: 'sessions',
      //   type: 'select',
      //   options: ['Seassion1', 'Session2', 'Session3'],
      //   hide: true,
      //   required: true,
      //   rule: {
      //     validators: [{ required: true }],
      //   },
      // },
      // {
      //   label: 'addSession',
      //   prop: 'sessions',
      //   type: 'checkbox',

      //   hide: true,
      //   required: true,
      //   rule: {
      //     validators: [{ required: true }],
      //   },
      // },

      {
        label: 'Seasion Name',
        prop: 'sessionName',
        type: 'input',
        hide: this.isAddSession,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
      {
        label: 'Seasion Code',
        prop: 'sessionCode',
        type: 'input',
        hide: this.isAddSession,
        required: true,
        rule: {
          validators: [{ required: true }],
        },
      },
    ],

    labelSize: '',
  };

  formData = {};

  editForm: any = null;

  editRowIndex = -1;

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription;

  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate: TemplateRef<any>;

  constructor(private brandListDataService: BrandListDataService, private dialogService: DialogService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getList();
  }

  search() {
    this.getList();
  }

  getList() {
    this.busy = this.brandListDataService.getListData(this.pager).subscribe((res) => {
      let data;
      data = JSON.parse(JSON.stringify(res.pageList));
      this.pager.total = res.total;
      if (this.searchForm.sort === 'desc') {
        data = data.reverse();
      }

      this.basicDataSource = data.filter((i: Brand | unknown) => {
        return (i as Brand).brandName!.toUpperCase().includes(this.searchForm.keyword.toUpperCase());
      });
      console.log('basic data Source: ', this.basicDataSource, data);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('change', changes);
  }
  sortFn() {
    this.getList();
  }

  onChange(e: any) {
    console.log('change', e);
  }

  editRow(row: any, index: number) {
    this.isAdd = 'EDIT';
    this.editRowIndex = index;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Editor',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  addBrand() {
    this.isAdd = 'ADD';

    this.editForm = this.dialogService.open({
      id: 'add-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Add Brand',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(index: number) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Delete',
      showAnimate: false,
      content: 'Are you sure you want to delete it?',
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: ($event: Event) => {
            this.basicDataSource.splice(index, 1);
            results.modalInstance.hide();
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }

  reset() {
    this.searchForm = {
      keyword: '',
      sort: 'asc',
    };
    this.pager.pageIndex = 1;
    this.getList();
  }

  onSubmitted(e: any) {
    console.log('Submitted', e);
    this.editForm!.modalInstance.hide();
    if (this.isAdd === 'EDIT') {
      this.basicDataSource.splice(this.editRowIndex, 1, e);
    } else {
      this.basicDataSource.unshift({
        id: `${(Math.random() * 34654564536453).toFixed(0)}`,
        ...e,
      });
    }
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

  onCheck() {
    console.log('Checking...');

    this.isAddSession = !this.isAddSession;
  }
}
