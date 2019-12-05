import { ContractInfo } from 'app/core/store/contract-info/contract-info.interface';
import { CustomerInfo } from 'app/core/store/customer-info/customer-info.interface';
import { util } from '../../util/util';
import { CDFlorderType } from '../contract-details/contract-details.interface';
import { DeliveryMethod, FlowDetailTO, Material } from '../florder-detail/florder-detail.interface';
import { initialStatePackingMaterial } from '../florder-detail/florder-detail.model';
import * as actions from './flow-detail.actions';
import { EditFlowDetail } from './flow-detail.interface';
import { initialStateEditFlowDetail } from './flow-detail.model';

export function reducer(state = util.deepCopy(initialStateEditFlowDetail), action: actions.Actions): EditFlowDetail {
  function addOrReplaceMaterial(material: Material, returnState: EditFlowDetail) {
    const existingMaterial = !!state.flowDetail.materials.find(
      m => m.internalId === material.internalId,
    );
    if (existingMaterial) {
      return Object.assign({}, returnState, {
        flowDetail: Object.assign({}, returnState.flowDetail, {
          materials: state.flowDetail.materials.map(
            m => (m.internalId === material.internalId ? material : m),
          ),
        }),
      });
    } else {
      return Object.assign({}, returnState, {
        flowDetail: Object.assign({}, returnState.flowDetail, {
          materials: [...state.flowDetail.materials, material],
        }),
      });
    }
  }

  function reduceOpenFlow(dataTO: FlowDetailTO, flowTypes: CDFlorderType[]) {
    const flowType = flowTypes.find(ft => ft.id === dataTO.flowType);
    const shippingCondition = flowType && flowType.shippingConditions.length && flowType.shippingConditions[0];
    const from = shippingCondition && shippingCondition.froms.find(f => f.id === dataTO.from.id);
    const to = from && from.tos.find(f => f.id === dataTO.to.id);
    const wholesalers = to && to.wholesaler.wholesalers && to.wholesaler.wholesalers;
    const wholesaler = dataTO.wholeSalerId ? (wholesalers && wholesalers.find(w => w.id === dataTO.wholeSalerId) || {id: dataTO.wholeSalerId, name:dataTO.wholeSalerId}) : null;
    return Object.assign({}, state, {
      mode: Object.assign({}, state.mode, {
        loading: false,
        loadSuccess: true,
      }),
      flowDetail: {
        deliveryMethod: {
          to: dataTO.to,
          from: dataTO.from,
          transport: dataTO.transport,
          clearing: dataTO.clearing === 'yes' ? true : dataTO.clearing === 'no' ? false : null,
          customerReferenceNumber: dataTO.customerRefNumber,
          senderReferenceNumber: dataTO.senderRefNumber,
          transporter: dataTO.transporter,
          licensePlate: dataTO.licensePlate,
          remarks: dataTO.comments,
          remarksHandshaker: dataTO.handshakeComments,
          wholesaler,
        },
        planning: {
          flowDate: dataTO.flowDate,
          loadingDate:
            dataTO.confirmedLoadingDate ||
            dataTO.confirmedUnloadingDate ||
            dataTO.requestedUnloadingDate ||
            dataTO.requestedLoadingDate, // TODO
          requestedUnloadingDate: dataTO.requestedUnloadingDate,
          confirmedUnloadingDate: dataTO.confirmedUnloadingDate,
        },
        etmOrderNumber: dataTO.etmOrderNumber,
        salesOrderNumber: dataTO.salesOrderNumber,
        shipmentNumber: dataTO.shipmentNumber,
        registeredBy: dataTO.registeredBy,
        globalType: dataTO.globalType,
        isLocked: !!dataTO.isLocked,
      },
    });
  }

  function readFlowTO(dataTO: FlowDetailTO, customerInfo: CustomerInfo, contractInfo: ContractInfo, isHandshakerOrLateHandshake: boolean, type: 'FLOWH' | 'FLOWR') {
    const returnState = reduceOpenFlow(dataTO, type === 'FLOWH' ? contractInfo.flowHandshakeTypes : contractInfo.flowRegistrationTypes);
    const handshakes = contractInfo.handshakes;
    const handshaker = handshakes && handshakes[returnState.flowDetail.deliveryMethod.from.id] && handshakes[returnState.flowDetail.deliveryMethod.from.id][returnState.flowDetail.deliveryMethod.to.id];
    const lateHandshake = !handshaker && isHandshakerOrLateHandshake;
    return Object.assign({}, returnState, {
      flowDetail: {
        ...returnState.flowDetail,
        status: dataTO.handshakeStatus,
        deliveryMethod: {
          ...returnState.flowDetail.deliveryMethod,
          type: dataTO.flowType
        },
        planning: {
          ...returnState.flowDetail.planning,
          flowDate: dataTO.flowDate,
        },
        materials: dataTO.flowLineItems.map(li => {
          return {
            type: 'packing',
            internalId: li.itemNumber,
            packingId: li.packingId,
            packingStatus: li.packingStatus,
            logisticsVarietyPacking: li.logisticsVarietyPacking,
            packingQuantity: li.definitiveQuantity || li.originalQuantity,
            poNumberItemLevel: '',
            contentId: li.contentId,
            lineReferenceId: li.lineReferenceId
          };
        }),
        registrar: !handshaker,
        handshaker,
        lateHandshake,
        updateDate: dataTO.updateDate,
        updateTime: dataTO.updateTime,
        updateBy: dataTO.updateBy,
      }
    });
  }

  switch (action.type) {
    case actions.FLOWDETAIL_CREATE_START: {
      return Object.assign({}, util.deepCopy(initialStateEditFlowDetail), {
        mode: {
          type: action.module,
          state: 'create',
          editWindow: 'delivery',
        },
      });
    }

    case actions.FLOWDETAIL_CREATE_SET_DELIVERY_METHOD: {
      const material = util.deepCopy(initialStatePackingMaterial) as Material;
      material.internalId = Math.max(0, ...state.flowDetail.materials.map(m => m.internalId)) + 1;
      material.isNew = true;

      const fromToChanged = (state.flowDetail.deliveryMethod.to && state.flowDetail.deliveryMethod.to.id) !== action.payload.to.id ||
        (state.flowDetail.deliveryMethod.from && state.flowDetail.deliveryMethod.from.id) !== action.payload.from.id;

      return Object.assign({}, state, {
        mode: {
          type: action.module,
          state: state.mode.state === 'edit' ? 'edit-confirm' : state.mode.state,
          editWindow: state.mode.state === 'create' ? 'detail' : null,
          material: state.mode.state === 'create' ? material : null,
        },
        flowDetail: Object.assign({}, state.flowDetail, {
          deliveryMethod: action.payload as DeliveryMethod,
          materials: fromToChanged ? [] : state.flowDetail.materials,
          planning: fromToChanged ? initialStateEditFlowDetail.flowDetail.planning : state.flowDetail.planning,
        }),
        flowDate: null,
      });
    }

    case actions.FLOWDETAIL_BACK_TO_DELIVERY: {
      return Object.assign({}, state, {
        mode: {
          type: action.payload,
          state: state.mode.state,
          editWindow: 'delivery',
        },
      });
    }

    case actions.FLOWDETAIL_BACK_TO_DETAIL: {
      const material = util.deepCopy(initialStatePackingMaterial) as Material;
      material.internalId = Math.max(0, ...state.flowDetail.materials.map(m => m.internalId)) + 1;
      material.isNew = true;
      return Object.assign({}, state, {
        mode: {
          type: action.payload,
          state: state.mode.state,
          editWindow: 'detail',
          material: state.mode.state === 'create' ? material : null,
        },
      });
    }

    case actions.FLOWDETAIL_CREATE_EDIT_FLOW_DETAIL: {
      const material = util.deepCopy(initialStatePackingMaterial) as Material;
      material.internalId = Math.max(0, ...state.flowDetail.materials.map(m => m.internalId)) + 1;
      material.isNew = true;
      return Object.assign({}, state, {
        mode: {
          material: !state.flowDetail.lateHandshake && material, // Late handshakes cannot add new materials
          type: state.mode.type,
          state: state.mode.state === 'edit-confirm' ? 'edit' : state.mode.state,
          editWindow: 'detail',
        },
      });
    }

    case actions.FLOWDETAIL_CREATE_EDIT_FLOW_PLANNING: {
      return Object.assign({}, state, {
        mode: {
          type: state.mode.type,
          state: state.mode.state,
          editWindow: 'planning',
        },
      });
    }

    case actions.FLOWDETAIL_CREATE_START_EDIT_MATERIAL: {
      return Object.assign({}, state, {
        mode: {
          type: 'order',
          state: state.mode.state,
          editWindow: state.mode.editWindow,
          material: action.payload,
        },
      });
    }

    case actions.FLOWDETAIL_CREATE_SAVE_MATERIAL: {
      const material = action.payload;
      const newMaterial = util.deepCopy(initialStatePackingMaterial) as Material;
      newMaterial.internalId = Math.max(0, action.payload.internalId, ...state.flowDetail.materials.map(m => m.internalId)) + 1; // Necessary so that when edited can be found back . Will be 0 when posted thanks to isNew = true
      newMaterial.isNew = true; // Will set internalId = 0 when sending POST request.  Keep it 'true' !!!
      const existingMaterial = !!state.flowDetail.materials.find(
        m => m.internalId === material.internalId,
      );

      const returnState = Object.assign({}, state, {
        mode: {
          type: 'flow',
          state: state.mode.state,
          editWindow: state.mode.editWindow,
          material: !state.flowDetail.lateHandshake && newMaterial, // Late handshakes cannot add new materials
          saving: false,
        },
        flowDetail: {
          ...state.flowDetail,
          planning: !existingMaterial && state.mode.state === 'create' ? initialStateEditFlowDetail.flowDetail.planning : state.flowDetail.planning,

        },
      });
      return addOrReplaceMaterial(material, returnState);
    }

    case actions.FLOWDETAIL_CREATE_DELETE_MATERIAL: {
      return Object.assign({}, state, {
        flowDetail: Object.assign({}, state.flowDetail, {
          materials: state.flowDetail.materials.filter(
            m => m !== action.payload,
          ),
        }),
      });
    }

    case actions.FLOWDETAIL_EDIT_DELIVERY_METHOD: {
      return Object.assign({}, state, {
        mode: {
          type: state.mode.type,
          state: state.mode.state === 'edit-confirm' ? 'edit' : state.mode.state,
          editWindow: 'delivery',
        },
      });
    }

    case actions.FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL: {
      return Object.assign({}, state, {
        mode: {
          type: 'flow',
          state: state.mode.state === 'edit' ? 'edit-confirm' : state.mode.state,
          editWindow: state.mode.state === 'create' ? 'planning' : null,
          material: null,
        },
      });
    }

    case actions.FLOWDETAIL_CREATE_SAVE_PLANNING: {
      const form = action.payload;
      return Object.assign({}, state, {
        mode: {
          type: state.mode.type,
          state: 'create-confirm',
          editWindow: null,
          material: null,
        },
        flowDetail: Object.assign({}, state.flowDetail, {
          planning: Object.assign({}, state.flowDetail.planning, {
            flowDate: form.flowDate,
          }),
        }),
      });
    }

    case actions.FLOWDETAIL_OPEN: {
      return Object.assign({}, state, {
        mode: {
          type: 'flow',
          state: 'view',
          editWindow: null,
          material: null,
          loading: true,
        },
        flowDetail: null,
      });
    }

    case actions.FLOWDETAIL_OPEN_SUCCESS: {
      return readFlowTO(action.payload.flowDetail, action.payload.customerInfo, action.payload.contractInfo, false, 'FLOWR');
    }

    case actions.FLOWDETAIL_COPY_OPEN_FLOW_SUCCESS: {
      const returnState = readFlowTO(action.payload.flowDetail, action.payload.customerInfo, action.payload.contractInfo, false, 'FLOWR');
      return {
        ...returnState,
        flowDetail: {
          ...returnState.flowDetail,
          etmOrderNumber: null,
          salesOrderNumber: null,
          planning: {
            ...returnState.flowDetail.planning,
            flowDate: null,
            loadingDate: null,
            requestedUnloadingDate: null,
            confirmedUnloadingDate: null,
          }
        },
        mode: {
          type: state.mode.type,
          state: 'create-confirm',
          editWindow: 'planning',
          material: null,
        }
      };
    }


    case actions.FLOWDETAIL_OPEN_FAIL: {
      return Object.assign({}, state, {
        mode: Object.assign({}, state.mode, {
          loading: false,
          loadSuccess: false,
        }),
      });
    }

    case actions.FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT: {
      return Object.assign({}, state, {
        mode: { ...state.mode, saving: true, saveSuccess: false, saved: false },
      });
    }

    case actions.FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_SUCCESS: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: true,
          saved: true,
        },
        flowDetail: Object.assign({}, state.flowDetail, {
          etmOrderNumber: JSON.parse(action.payload.result._body).etmOrderNumber,
        }),
      });
    }

    case actions.FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_FAIL: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: false,
          saved: false,
        }
      });
    }

    case actions.FLOWDETAIL_ACCEPT_FLOW_START: {
      return Object.assign({}, state, {
        mode: { ...state.mode, saving: true, saveSuccess: false, saved: false },
      });
    }

    case actions.FLOWDETAIL_ACCEPT_FLOW_SUCCESS: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: true,
          saved: true,
        }
      });
    }

    case actions.FLOWDETAIL_ACCEPT_FLOW_FAIL: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: false,
          saved: true,
        }
      });
    }

    case actions.FLOWDETAIL_EDIT_FLOW: {
      const returnState = readFlowTO( action.payload.flowDetail, action.payload.customerInfo, action.payload.contractInfo, false, 'FLOWR' );
      return Object.assign({}, state, {
        ...returnState,
        mode: {
          ...returnState.mode,
          type: 'flow',
          state: 'edit',
          editWindow: 'delivery',
          saving: false,
          saveSuccess: false,
          saved: false,
        }
      });
    }

    case actions.FLOWDETAIL_EDIT_ACCEPT_FLOW: {
      const returnState = readFlowTO( action.payload.flowDetail, action.payload.customerInfo, action.payload.contractInfo, true , 'FLOWH');
      return Object.assign({}, state, {
        ...returnState,
        mode: {
          ...returnState.mode,
          type: 'flow',
          state: returnState.flowDetail.lateHandshake ? 'edit-confirm' : 'edit',
          editWindow: returnState.flowDetail.lateHandshake ? null : 'delivery',
          saving: false,
          saveSuccess: false,
          saved: false,
        }
      });
    }

    case actions.FLOWDETAIL_REQUEST_DELIVERY_DATES_SUCCESS: {
      return Object.assign({}, state, {
        datesRange: action.payload
      });
    }

    case actions.FLOWDETAIL_REQUEST_DELIVERY_DATES_FAIL: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          openingWindow: null,
        },
      });
    }

    case actions.FLOWDETAIL_CHECK_FLOW_DATE: {
      return {
        ...state,
        flowDetail: {
          ...state.flowDetail,
          flowDateError: null,
        },
      };
    }

    case actions.FLOWDETAIL_CHECK_FLOW_DATE_SUCCESS: {
      return Object.assign({}, state, {
        flowDate: action.payload,

        flowDetail: {
          ...state.flowDetail,
          deliveryMethod: {
            ...state.flowDetail.deliveryMethod,
            clearing:
              action.payload.CheckFlowDateResponse.clearing &&
              action.payload.CheckFlowDateResponse.clearing === 'X' ? true : false,
          },
          flowDateError: null,
        },
      });
    }

    case actions.FLOWDETAIL_CHECK_FLOW_DATE_ERROR: {
      return Object.assign({}, state, {
        flowDetail: {
          ...state.flowDetail,
          flowDateError: action.payload.Message,
        },
      });
    }

    case actions.FLOWDETAIL_RESET_MATERIALS_AND_PLANNING: {
      return {
        ...state,
        mode: {
          ...state.mode,
          material: {
            internalId: 1,
          },
        },
        flowDetail: {
          ...state.flowDetail,
          materials: [],
          planning: initialStateEditFlowDetail.flowDetail.planning,
        },
      };
    }

    default: {
      return state;
    }
  }
}
