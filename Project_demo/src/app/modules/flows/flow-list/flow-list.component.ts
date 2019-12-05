import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit } from '@jaspero/ng2-confirmations/src/interfaces/resolve-emit';
import { AppSettings } from 'app/app.settings';
import { TranslationHelperService } from 'app/core/services/translate-helper.service';
import { AuthorizationMatrix } from 'app/core/store/contract-details/contract-details.interface';
import { Definition } from 'app/core/store/definitions/definition.interface';
import { Definitions } from 'app/core/store/definitions/definitions.interface';
import { Florder } from 'app/core/store/florders/florder.interface';
import { FlordersFilter } from 'app/core/store/florders/florders-filter.interface';
import { FlowEdit } from 'app/core/store/flows/flow-edit.interface';
import { util } from 'app/core/util/util';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import * as _ from 'typedash';

@Component({
  selector: 'app-flow-list',
  templateUrl: './flow-list.component.html',
  styleUrls: [
    '../../florders/florder-list/florder-list.less',
    './flow-list.component.less',
  ],
})
export class FlowListComponent implements OnChanges {

  @Input() flows: Florder[];
  @Input() readonly definitions: Definitions;
  @Input() isDownloading: boolean;
  @Input() isLoading: boolean;
  @Input() filter: FlordersFilter;
  @Input() totalItems: number;
  @Input() authorization: AuthorizationMatrix;
  @Input() handshaking: boolean;
  @Input() private filterExcecutionTimestamp: Date;

  @Output() cancelFlow: EventEmitter<Florder> = new EventEmitter();
  @Output() acceptFlow: EventEmitter<Florder> = new EventEmitter();
  @Output() acceptFlows: EventEmitter<any> = new EventEmitter();
  @Output() downloadList: EventEmitter<Florder> = new EventEmitter();
  @Output() openFlow: EventEmitter<Florder> = new EventEmitter();
  @Output() copyFlow: EventEmitter<Florder> = new EventEmitter();
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sortChange: EventEmitter<{ sortField: string, sortAscending: boolean }> = new EventEmitter();
  @Output() editFlow: EventEmitter<Florder> = new EventEmitter();
  @Output() editAcceptFlow: EventEmitter<Florder> = new EventEmitter();
  @Output() downloadDocument: EventEmitter<Florder> = new EventEmitter();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  showAll: boolean = false;
  flowListForm: FormGroup;
  dateFormat: string = AppSettings.DATE_FORMAT_ANGULAR;
  pageStats: { selected: number, selectable: number, allSelected: boolean, allOtherFlowEditsValid: boolean } = {
    selected: 0,
    selectable: 0,
    allSelected: false,
    allOtherFlowEditsValid: false,
  };
  selected: number = 0;
  containsBlacklistedItems: boolean = false;

  private collapsedFlows: string[] = [];
  private flowEdits: { [key: string]: FlowEdit } = {};

  constructor(private formBuilder: FormBuilder, private simplePageScrollService: SimplePageScrollService, private confirmationService: ConfirmationService, private translationHelperService: TranslationHelperService) {

  }

  ngOnInit(): void {
    const controlsConfig = {
      flows: this.formBuilder.array([]),
    };
    this.flowListForm = this.formBuilder.group(controlsConfig);
    this.updateChecks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.flows) {
      console.log(changes.flows);
      this.flows = this.flows.map((flow) => {
        return {
          ...flow,
          flowLineItems: flow.flowLineItems.map((item) => {
            return {
              ...item,
            };
          }),
        };
      });
      this.updateChecks();
    }
    if (changes.filterExcecutionTimestamp) {
      this.resetFlowEdits();
    }
  }

  resetFlowEdits() {
    this.flowEdits = {};
    this.selected = 0;
    this.pageStats = {
      selectable: 0,
      selected: 0,
      allSelected: false,
      allOtherFlowEditsValid: false,
    };
  }

  /**
   * Update form objects for the current subset of flows shown.  Use already stored data from previous edit actions for current query
   * formEdit => formGroup controls
   */
  updateChecks() {
    if (this.flowListForm) {
      this.pageStats = {
        selectable: 0,
        selected: 0,
        allSelected: false,
        allOtherFlowEditsValid: false,
      };
      this.containsBlacklistedItems = false;
      const flowGroupControls = this.flows.map((flow) => {
        let flowEdit: FlowEdit = this.flowEdits['' + flow.etmOrderNumber];
        const canHandshake = this.canAcceptHandshake(flow);
        if (canHandshake) {
          flow.flowLineItems.forEach((fli) => {
            let quantity = fli.definitiveQuantity;
            if (flowEdit) {
              const i = flowEdit.items.find(i => i.itemNumber === fli.itemNumber);
              quantity = i.definitiveQuantity;
            }
            fli.definitiveQuantity = quantity === null ? fli.originalQuantity : quantity;
          });
        }
        if (!flowEdit) {
          flowEdit = {
            flow,
            etmOrderNumber: '' + flow.etmOrderNumber,
            fromId: flow.from.id,
            toId: flow.to.id,
            customerReferenceNumber: flow.customerRefNumber,
            comments: null,
            checked: false,
            collapsed: !this.showAll,
            statusId: flow.status && (flow.status as Definition).id,
            flowType: null,
            valid: true,

            items: flow.flowLineItems.map(
              fli => {
                return {
                  itemNumber: fli.itemNumber,
                  packingId: fli.packingId,
                  contentId: fli.contentId,
                  originalQuantity: fli.originalQuantity,
                  definitiveQuantity: fli.definitiveQuantity,
                  lineReferenceId: fli.lineReferenceId,
                };
              },
            ),
          } as FlowEdit;
          this.flowEdits['' + flow.etmOrderNumber] = flowEdit;
        }
        flowEdit.flow = flow;
        flow['valid'] = flowEdit.valid;
        if (this.canAcceptHandshake(flow)) {
          this.pageStats.selectable++;
        } else if (flowEdit.checked && flow.blacklisted) {
          flowEdit.checked = false;
          this.selected--;
        }
        if (flowEdit.checked) {
          flow['isChecked'] = true;
          this.pageStats.selected++;
        }

        this.containsBlacklistedItems = this.containsBlacklistedItems || flow.blacklisted;

        const formGroup = this.formBuilder.group({
          checked: [flowEdit.checked],
          etmOrderNumber: [flowEdit.etmOrderNumber],
          statusId: [flowEdit.statusId],
          canAcceptHandshake: [this.canAcceptHandshake(flow)],
          items: this.formBuilder.array(flowEdit.items.map(i => this.formBuilder.group({
            itemNumber: [i.itemNumber],
            definitiveQuantity: [
              i.definitiveQuantity,
              [
                Validators.required,
                util.getNumericValidator(),
              ],
            ],
            originalQuantity: [i.originalQuantity],
          }))),
        });
        return formGroup;
      });
      const flowArrayControl = this.formBuilder.array(flowGroupControls);
      this.flowListForm.setControl('flows', flowArrayControl);

      // Add conditional validations
      (this.flowListForm.get('flows') as FormArray).controls.forEach((flowControl: FormGroup) => {
        const checkboxControl = flowControl.get('checked');
        (flowControl.get('items') as FormArray).controls.forEach((itemControl: FormGroup) => {
          util.conditionalValidation(this.flowListForm, () => itemControl.get('definitiveQuantity'), [util.createCondition(() => checkboxControl)], [
            Validators.required,
            util.getNumericValidator(),
          ]);
        });
      });

      this.pageStats.allSelected = (this.pageStats.selected === this.pageStats.selectable && this.pageStats.selected > 0);

      const etmOrderNumbersOnThisPage = this.flows.map(flow => flow.etmOrderNumber);
      this.pageStats.allOtherFlowEditsValid = !Object.keys(this.flowEdits).filter(key => etmOrderNumbersOnThisPage.indexOf(key) < 0).find(key => {
        const flowEdit = this.flowEdits[key];
        flowEdit.valid = !(flowEdit.items.find(item => !util.isNumeric(item.definitiveQuantity) || !util.isNumeric(item.originalQuantity)));
        return flowEdit.checked && !flowEdit.valid;
      });
    }
  }

  private updateToggleSelectAllCheckbox(): void {
    this.pageStats.allSelected = (this.pageStats.selected === this.pageStats.selectable && this.pageStats.selected > 0);
  }

  /**
   * When changing sorting / pagination, a new subset of flows will be shown.  Story currently changed / checked flows in memory to be used when accept/cancel flow
   * formGroup controls => flowEdit
   */

  private storeEditFields() {
    (this.flowListForm.get('flows') as FormArray).controls.forEach(flowControl => {
      const flowEdit = this.flowEdits['' + flowControl.get('etmOrderNumber').value];
      flowEdit.checked = flowControl.get('checked').value;
      (flowControl.get('items') as FormArray).controls.forEach(itemControl => {
        const itemEdit = flowEdit.items.find(i => i.itemNumber === itemControl.get('itemNumber').value);
        itemEdit.originalQuantity = itemControl.get('originalQuantity').value;
        itemEdit.definitiveQuantity = itemControl.get('definitiveQuantity').value;
      });
    });
  }

  onPageChange(pageNr) {
    this.storeEditFields();
    this.pageChange.emit(pageNr);
    this.simplePageScrollService.scrollToElement('#top', 0);
  }

  /**
   * Check if flow is collapsed or not
   * @param {string} etmOrderNumber of flow to check.  Flow shall always exist in flowEdit object since that object is created by updateChecks (when flow is set)
   * @returns {boolean} collapsed or not
   */
  isCollapsed(etmOrderNumber: string): boolean {
    return this.collapsedFlows.indexOf(etmOrderNumber) >= 0;
  }

  /**
   * set collapsed boolean to other value
   * @param {string} etmOrderNumber of flow to check.  Flow shall always exist in flowEdit object since that object is created by updateChecks (when flow is set)
   * @returns {boolean} collapsed or not
   */
  toggleCollapsed(etmOrderNumber: string): boolean {
    if (this.collapsedFlows.indexOf(etmOrderNumber) >= 0) {
      this.collapsedFlows = _.without(this.collapsedFlows, [etmOrderNumber]);
      return false;
    } else {
      this.collapsedFlows.push(etmOrderNumber);
      return true;
    }
  }

  toggleCollapseAll() {
    if (this.showAll) {
      this.collapsedFlows = this.flows.map(f => f.etmOrderNumber);
    } else {
      this.collapsedFlows = [];
    }
    this.showAll = !this.showAll;
  }

  toggleSelected(checkbox, flow) {
    this.selected += checkbox.checked ? 1 : -1;
    this.pageStats.selected += checkbox.checked ? 1 : -1;
    this.updateToggleSelectAllCheckbox();
    const flowEdit: FlowEdit = this.flowEdits['' + flow.etmOrderNumber];
    flowEdit.checked = checkbox.checked;
    flow['isChecked'] = checkbox.checked;
  }

  toggleSelectAll(checkbox) {
    (this.flowListForm.get('flows') as FormArray).controls.forEach(flowControl => {
      if (flowControl.get('checked').value !== checkbox.checked && flowControl.get('canAcceptHandshake').value) {
        flowControl.get('checked').setValue(checkbox.checked);
        this.selected += checkbox.checked ? 1 : -1;

        const flowEdit = this.flowEdits['' + flowControl.get('etmOrderNumber').value];
        flowEdit.checked = checkbox.checked;
        const flow = this.flows.find(flow => flow.etmOrderNumber === flowEdit.etmOrderNumber);
        flow['isChecked'] = checkbox.checked;
      }
    });
    // There is an issue with unchecking the checkboxes on flow level.  Therefore, I decided to recreate the flowControls.  That worked...
    // Dirty hack: set flows-array with new objects, so that tablflowListForme is rerendered, and then checkboxes are unchecked !
    this.storeEditFields();
    this.flows = [
      ...this.flows.map(flow => {
        return { ...flow };
      }),
    ];
    this.pageStats.selected = checkbox.checked ? this.pageStats.selectable : 0;
    this.updateToggleSelectAllCheckbox();
  }

  sort(field: string) {
    this.storeEditFields();
    util.sortHelper(this, field);
  }

  sortBnd = this.sort.bind(this);

  preventRouting(event) {
    event.stopPropagation();
  }

  openMenu(event) {
    event.stopPropagation();
  }

  acceptFlowClicked($event, flow: Florder) {
    this.preventRouting($event);
    if (flow['valid']) {
      this.acceptFlow.emit(flow);
    }
  }

  cancelFlowClicked($event, flow: Florder) {
    const title = 'FLOWS.LIST.LABELS.CANCEL_FLOW';
    const question = 'FLOWS.LIST.LABELS.CANCEL_FLOW_CONFIRM';
    const yes = 'SHARED.BUTTONS.YES';
    const no = 'SHARED.BUTTONS.NO';
    this.translationHelperService.translateArrayToObject([
        title,
        question,
        yes,
        no,
      ],
      { flowId: flow.etmOrderNumber }).subscribe(translations => {
      this.confirmationService.create(translations[title], translations[question], {
        confirmText: translations[yes],
        declineText: translations[no],
      }).subscribe((answer: ResolveEmit) => {
        if (answer.resolved) {
          this.cancelFlow.emit(flow);
        }
      });
    });
  }

  getContent(id: string): string {
    const brick = id && this.definitions.global.brick.find(b => b.id === id);
    return brick && brick.name;
  }

  acceptFlowsClicked() {
    this.storeEditFields();
    const flowEdits = util.deepCopy(this.flowEdits);
    this.acceptFlows.emit(Object.keys(flowEdits).map(key => flowEdits[key]));
  }

  canAcceptHandshake(flow: Florder): boolean {
    return !!(!flow.blacklisted && flow.executeHandshake && this.authorization.FLOW.ACCEPT && (flow.status as Definition).id === '02' && !flow.failed);
  }

  canCancelHandshake(flow: Florder): boolean {
    return !!(!flow.blacklisted && flow.canCancel && !flow.failed);
  }

  originalQuantityChanged(value: string, flow: any, item: any) {
    item.originalQuantity = value;
    this.validateQuantity(flow);
  }

  definitiveQuantityChanged(value: string, flow: any, item: any) {
    item.definitiveQuantity = value;
    this.validateQuantity(flow);
  }

  private validateQuantity(flow: any) {
    const invalidItem = flow.flowLineItems.find(item => !util.isNumeric(item.definitiveQuantity) || !util.isNumeric(item.originalQuantity));
    flow.valid = !(invalidItem);
  }
}
