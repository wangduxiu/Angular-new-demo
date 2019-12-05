import { AppSettings } from '../../../app.settings';
import { util } from '../../util/util';
import * as calendarActions from '../calendar/calendar.actions';
import { Definitions } from '../definitions/definitions.interface';
import { Material, OrderDetailTO } from '../florder-detail/florder-detail.interface';
import { initialStateCombinationMaterial } from '../florder-detail/florder-detail.model';
import * as templateActions from '../template/template.actions';
import * as actions from './order-detail.actions';
import { EditOrderDetail, RecurrenceDate } from './order-detail.interface';
import { initialStateEditOrderDetail } from './order-detail.model';

export function reducer(state = util.deepCopy(initialStateEditOrderDetail), action: actions.Actions | templateActions.Actions | calendarActions.Actions): EditOrderDetail {
  function prepareMaterial(material: Material) {
    switch (material.type) {
      case AppSettings.MATERIAL_TYPE_COMBINATION: {
        material.packingQuantity = '' + parseInt(material.numberOfPallets, 10) * parseInt(material.packingsPerPallet, 10);
        break;
      }
      case AppSettings.MATERIAL_TYPE_PACKING: {
        material.numberOfPallets = null;
        material.palletId = null;
        break;
      }
      case AppSettings.MATERIAL_TYPE_PALLET: {
        material.packingQuantity = null;
        material.packingId = null;
        material.packingsPerPallet = null;
        material.contentId = null;
        material.lineReferenceId = null;
        break;
      }
    }
  }

  function addOrReplaceMaterial(material: Material, returnState: EditOrderDetail) {
    const existingMaterial = !!state.orderDetail.materials.find(
      m => m.internalId === material.internalId
    );
    if (existingMaterial) {
      return Object.assign({}, returnState, {
        orderDetail: Object.assign({}, returnState.orderDetail, {
          materials: state.orderDetail.materials.map(
            m => (m.internalId === material.internalId ? material : m)
          )
        })
      });
    } else {
      return Object.assign({}, returnState, {
        orderDetail: Object.assign({}, returnState.orderDetail, {
          materials: [...state.orderDetail.materials, material]
        })
      });
    }
  }

  function reduceOpenFlorder(dataTO: OrderDetailTO, definitions: Definitions): EditOrderDetail {
    return Object.assign({}, state, {
      mode: Object.assign({}, state.mode, {
        loading: false,
        loadSuccess: true
      }),
      orderDetail: {
        deliveryMethod: {
          soldTo: dataTO.soldTo,
          to: dataTO.to,
          from: dataTO.from,
          shippingCondition: dataTO.transport && definitions.transport.type.find(t => t.id === dataTO.transport),
          incoterm: dataTO.incoterm ? definitions.order.incoterm.find(i => i.id === dataTO.incoterm) : null,
          customerReferenceNumber: dataTO.customerRefNumber,
          senderReferenceNumber: dataTO.senderRefNumber,
          transporter: dataTO.transporter,
          licensePlate: dataTO.licensePlate,
          remarks: dataTO.comments
        },
        planning: {
          recurrence: null,
          loadingDate:
            dataTO.confirmedLoadingDate ||
            dataTO.confirmedUnloadingDate ||
            dataTO.requestedUnloadingDate ||
            dataTO.requestedLoadingDate, // TODO
          requestedUnloadingDate: dataTO.requestedUnloadingDate,
          confirmedUnloadingDate: dataTO.confirmedUnloadingDate,
          exchangePallets: !!dataTO.exchangePallets,
          numberOfExchangePallets: dataTO.numberOfExchangePallets
        },
        requestedBalance: '',
        createTemplate: false,
        templateName: null,
        etmOrderNumber: dataTO.etmOrderNumber,
        salesOrderNumber: dataTO.salesOrderNumber,
        shipmentNumber: dataTO.shipmentNumber,
        registeredBy: dataTO.registeredBy
      }
    });
  }

  function reduceOpenTemplate(dataTO: any, definitions: Definitions): EditOrderDetail {
    return Object.assign({}, state, {
      mode: Object.assign({}, state.mode, {
        loading: false,
        loadSuccess: true
      }),
      orderDetail: {
        deliveryMethod: {
          soldTo: dataTO.soldTo,
          to: dataTO.to,
          from: dataTO.from,
          shippingCondition: dataTO.transport && definitions.transport.type.find(t => t.id === dataTO.transport),
          incoterm: dataTO.incoterm ? definitions.order.incoterm.find(i => i.id === dataTO.incoterm) : null,
          customerReferenceNumber: dataTO.customerRefNumber,
          senderReferenceNumber: dataTO.senderRefNumber,
          transporter: dataTO.transporter,
          licensePlate: dataTO.licensePlate,
          remarks: dataTO.comments
        },
        planning: {
          recurrence: null,
          loadingDate:
            dataTO.confirmedLoadingDate ||
            dataTO.confirmedUnloadingDate ||
            dataTO.requestedUnloadingDate ||
            dataTO.requestedLoadingDate,
          requestedUnloadingDate: dataTO.requestedUnloadingDate,
          confirmedUnloadingDate: dataTO.confirmedUnloadingDate,
          exchangePallets: dataTO.exchangePallets && dataTO.exchangePallets.toString().toLocaleLowerCase() === 'true',// diff with reduceOpenFlorder: explicit check on 'true' string
          numberOfExchangePallets: dataTO.numberExchangePallets
        },
        requestedBalance: '',
        createTemplate: false,
        templateName: null,
        etmOrderNumber: dataTO.etmOrderNumber,// diff with reduceOpenFlorder: no salesOrderNumber
        shipmentNumber: dataTO.shipmentNumber,
        registeredBy: dataTO.registeredBy
      }
    });
  }

  const readOrderTO = function (dataTO: OrderDetailTO, definitions: Definitions): EditOrderDetail {
    const lineItems = dataTO.lineItems || dataTO['lineItem']; // diff between order & template
    const returnState = reduceOpenFlorder(dataTO, definitions);
    return Object.assign({}, returnState, {
      orderDetail: {
        ...returnState.orderDetail,
        status: dataTO.orderStatus,
        deliveryMethod: {
          ...returnState.orderDetail.deliveryMethod,
          type: dataTO.orderType
        },
        planning: {
          ...returnState.orderDetail.planning,
          orderDate: dataTO.orderDate
        },
        materials: lineItems.map(li => {
          return {
            internalId: li.itemNumber,
            type: (li.palletId && li.packingId && 'combination') || (li.palletId && 'pallet') || 'packing',
            palletId: li.palletId,
            packingId: li.packingId,
            packingStatus: li.packingStatus,
            logisticsVarietyPacking: li.logisticsVarietyPacking,
            packingsPerPallet: '' + li.packingsPerPallet,
            numberOfPallets: '' + li.numberOfPallets,
            requestedBalance: '',
            packingQuantity: '' + li.packingQuantity,
            poNumberItemLevel: ''
          };
        }),
        ccr: {
          ccrNumber: dataTO.ccr && dataTO.ccr.ccrNumber || '',
          sealNumber: dataTO.ccr && dataTO.ccr.sealNumber || '',
          ccrLineItems:  dataTO.ccr && mapCcrLineItems(dataTO.ccr.ccrLineItems) || [],
          open: dataTO.ccr && dataTO.ccr.approved && dataTO.ccr.approved.toLowerCase() === 'open',
          accepted: dataTO.ccr && dataTO.ccr.approved && dataTO.ccr.approved.toLowerCase() === 'accepted',
          declined: dataTO.ccr && dataTO.ccr.approved && dataTO.ccr.approved.toLowerCase() === 'declined',
        },
        documents: dataTO.documents,
      }
    });
  };

  const readOrderTemplateTO = function (dataTO: { data: OrderDetailTO, id: number, name: string }, definitions: Definitions) {
    const data = dataTO.data;
    const returnState = reduceOpenTemplate(data, definitions); // diff with readOrderTO: use reduceOpenTemplate iso reduceOpenFlorder

    return Object.assign({}, returnState, {
      orderDetail: {
        ...returnState.orderDetail,
        status: data.orderStatus,
        templateId: dataTO.id, // diff with readOrderTO: extra field
        templateName: dataTO.name, // diff with readOrderTO: extra field
        deliveryMethod: {
          ...returnState.orderDetail.deliveryMethod,
          type: data.orderType,

        },
        planning: {
          ...returnState.orderDetail.planning,
          orderDate: data.orderDate
        },
        materials: data['lineItem'].map((li, index: number) => { // TODO fix this when MW changes  // diff with readOrderTO: lineItem iso lineItems
          return {
            internalId: index,
            type: (li.palletId && li.packingId && 'combination') || (li.palletId && 'pallet') || 'packing',
            palletId: li.palletId,
            packingId: li.packingId,
            packingStatus: li.packingStatus,
            logisticsVarietyPacking: li.logisticsVarietyPacking,
            packingsPerPallet: '' + li.packingsPerPallet,
            numberOfPallets: '' + li.numberOfPallets,
            requestedBalance: '',
            packingQuantity: '' + li.packingQuantity,
            poNumberItemLevel: ''
          };
        })
      }
    });
  };

  const mapCcrLineItems = function (ccrLines) {
    return ccrLines.map(li => {
      return Object.assign({}, li, {
        type: (li.palletId && li.packingId && 'combination') || (li.palletId && 'pallet') || 'packing'
      });
    });
  };

  switch (action.type) {
    case actions.ORDERDETAIL_CREATE_START: {
      const pristineState = util.deepCopy(initialStateEditOrderDetail);
      return Object.assign({}, pristineState, {
        mode: {
          type: action.module,
          state: 'create',
          editWindow: 'delivery',
          createTemplate: false,
          editTemplate: false,
        },
        orderDetail: {
          ...pristineState.orderDetail,
          deliveryMethod: {
            ...initialStateEditOrderDetail.orderDetail.deliveryMethod,
            soldTo: action.payload.activeCustomer
          },
          planning: {
            ...pristineState.orderDetail.planning,
            loadingDate: action.payload.date || pristineState.orderDetail.planning.loadingDate,
            exchangePallets: !action.payload.preventCheckingContractDetails && action.payload.restrictions.palletExchange,
          }
        },
        recurrenceDates: null
      });
    }

    case templateActions.ORDER_TEMPLATE_CREATE_START: {
      const pristineState = util.deepCopy(initialStateEditOrderDetail);
      return Object.assign({}, pristineState, {
        mode: {
          type: 'order',
          state: 'create',
          editWindow: 'delivery',
          createTemplate: true,
          editTemplate: false,
        },
        orderDetail: {
          ...pristineState.orderDetail,
          deliveryMethod: {
            ...initialStateEditOrderDetail.orderDetail.deliveryMethod,
            soldTo: action.payload.activeCustomer // payload = activeCustomer
          }
        },
        recurrenceDates: null
      });
    }

    case actions.ORDERDETAIL_CREATE_SET_DELIVERY_METHOD: {
      const material = util.deepCopy(initialStateCombinationMaterial) as Material;
      material.internalId = Math.max(0, ...state.orderDetail.materials.map(m => m.internalId)) + 1;

      const fromToChanged = (state.orderDetail.deliveryMethod.to && state.orderDetail.deliveryMethod.to.id) !== action.payload.deliveryMethod.to.id ||
        (state.orderDetail.deliveryMethod.from && state.orderDetail.deliveryMethod.from.id) !== action.payload.deliveryMethod.from.id ||
        (state.orderDetail.deliveryMethod.shippingCondition && state.orderDetail.deliveryMethod.shippingCondition.id) !== action.payload.deliveryMethod.shippingCondition.id;

      return Object.assign({}, state, {
        mode: {
          type: action.module,
          state: state.mode.state,
          editWindow: state.mode.state === 'create' ? 'detail' : null,
          material: state.mode.state === 'create' ? material : null,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
        },
        orderDetail: Object.assign({}, state.orderDetail, {
          deliveryMethod: action.payload.deliveryMethod,
          materials: fromToChanged ? [] : state.orderDetail.materials,
          planning: fromToChanged ? {
            ...initialStateEditOrderDetail.orderDetail.planning,
            loadingDate: action.payload.loadingDate || initialStateEditOrderDetail.orderDetail.planning.loadingDate,
            exchangePallets: state.orderDetail.planning.exchangePallets,
          } : state.orderDetail.planning,
        }),
      });
    }

    case actions.ORDERDETAIL_BACK_TO_DELIVERY: {
      return Object.assign({}, state, {
        mode: {
          type: action.payload,
          state: state.mode.state,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          editWindow: 'delivery',
        },
      });
    }

    case actions.ORDERDETAIL_BACK_TO_DETAIL: {
      const material = util.deepCopy(initialStateCombinationMaterial) as Material;
      material.internalId = Math.max(0, ...state.orderDetail.materials.map(m => m.internalId)) + 1;
      return Object.assign({}, state, {
        mode: {
          type: action.payload,
          state: state.mode.state,
          editWindow: 'detail',
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          material: state.mode.state === 'create' ? material : null
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_EDIT_ORDER_DETAIL: {
      const material = util.deepCopy(initialStateCombinationMaterial) as Material;
      material.internalId = Math.max(0, ...state.orderDetail.materials.map(m => m.internalId)) + 1;
      return Object.assign({}, state, {
        mode: {
          material,
          type: state.mode.type,
          state: state.mode.state,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          editWindow: 'detail'
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          openingWindow: 'planning'
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING_GET_DATES_SUCCESS: {
      return Object.assign({}, state, {
        mode: {
          type: state.mode.type,
          state: state.mode.state,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          editWindow: 'planning'
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_START_EDIT_MATERIAL: {
      return Object.assign({}, state, {
        mode: {
          type: 'order',
          state: state.mode.state,
          editWindow: state.mode.editWindow,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          material: action.payload,
        },
      });
    }

    case actions.ORDERDETAIL_CREATE_SAVE_MATERIAL_START: {
      return Object.assign({}, state, {
        mode: Object.assign({}, state.mode, { saving: true })
      });
    }

    case actions.ORDERDETAIL_CREATE_SAVE_MATERIAL_SUCCESS: {
      const material = util.deepCopy(action.payload.material);
      const newMaterial = util.deepCopy(initialStateCombinationMaterial) as Material;
      newMaterial.internalId = Math.max(0, material.internalId, ...state.orderDetail.materials.map(m => m.internalId)) + 1;
      let numberOfExchangePallets = null;
      let maxAmountOfPalletExchangeAvailable = action.payload.calculation && action.payload.calculation.orderLineInfo.maxAmountOfPalletExchangeAvailable || 0;
      if (state.orderDetail.planning.exchangePallets) {
        numberOfExchangePallets = state.orderDetail.planning.numberOfExchangePallets;
        if (typeof  numberOfExchangePallets === 'string') {
          numberOfExchangePallets = parseInt(numberOfExchangePallets, 10);
        }
        const previousMaxAmountOfPalletExchangeAvailable = state.orderDetail.planning.maxAmountOfPalletExchangeAvailable;
        if (numberOfExchangePallets === previousMaxAmountOfPalletExchangeAvailable) {
          numberOfExchangePallets = maxAmountOfPalletExchangeAvailable;
        } else {
          numberOfExchangePallets = Math.min(maxAmountOfPalletExchangeAvailable, numberOfExchangePallets);
        }
      }
      let returnState = Object.assign({}, state, {
        orderDetail: Object.assign({}, state.orderDetail, {
          fullTruck: action.payload.calculation && action.payload.calculation.orderLineInfo.fullTruck || false,
          palletQuantity: action.payload.calculation && parseInt(action.payload.calculation.orderLineInfo.quantity, 10) || 0,
          planning: {
            ...state.orderDetail.planning,
            numberOfExchangePallets,
            maxAmountOfPalletExchangeAvailable
          }
        }),
        loadedEpp: action.payload.calculation && action.payload.calculation.orderLineInfo && action.payload.calculation.orderLineInfo.loadedEpp,
        maxEpp: action.payload.calculation && action.payload.calculation.orderLineInfo && action.payload.calculation.orderLineInfo.maxEpp,
        mode: {
          type: 'order',
          state: state.mode.state,
          editWindow: state.mode.editWindow,
          material: newMaterial,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          saving: false
        }
      });
      prepareMaterial(material);
      returnState = addOrReplaceMaterial(material, returnState);
      const orderContainsCombinations = !!returnState.orderDetail.materials.find(m => m.type === 'combination');
      if (!orderContainsCombinations) {
        returnState.orderDetail.planning.exchangePallets = false;
        returnState.orderDetail.planning.numberOfExchangePallets = null;
      }
      return returnState;
    }

    case actions.ORDERDETAIL_CREATE_SAVE_MATERIAL_OVERLOAD: {
      const material = util.deepCopy(action.payload.material);
      return Object.assign({}, state, {
        mode: {
          material,
          type: 'order',
          state: state.mode.state,
          editWindow: state.mode.editWindow,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          saving: false
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_SAVE_MATERIAL_FAIL: {
      const material = util.deepCopy(action.payload.material);
      return Object.assign({}, state, {
        mode: Object.assign({}, state.mode, { material, saving: false })
      });
    }

    case actions.ORDERDETAIL_CREATE_DELETE_MATERIAL: {
      const returnState = Object.assign({}, state, {
        orderDetail: Object.assign({}, state.orderDetail, {
          materials: state.orderDetail.materials.filter(
            m => m !== action.payload
          ),
          planning: { ...state.orderDetail.planning }
        })
      });
      const orderContainsCombinations = !!returnState.orderDetail.materials.find(m => m.type === 'combination');
      if (!orderContainsCombinations) {
        returnState.orderDetail.planning.exchangePallets = false;
        returnState.orderDetail.planning.numberOfExchangePallets = null;
      }
      return returnState;
    }

    case actions.ORDERDETAIL_EDIT_DELIVERY_METHOD: {
      return Object.assign({}, state, {
        mode: {
          type: state.mode.type,
          state: state.mode.state,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          editWindow: 'delivery'
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          datesLoading: true
        },
      });
    }

    case actions.ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL_GET_DATES_SUCCESS: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          editWindow: state.mode.state === 'create' ? 'planning' : null,
          material: null,
          datesLoading: false
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_SAVE_PLANNING: {
      const form = action.payload;
      return Object.assign({}, state, {
        mode: {
          type: state.mode.type,
          state: 'create-confirm',
          editWindow: null,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          material: null
        },
        orderDetail: Object.assign({}, state.orderDetail, {
          createTemplate: form.createTemplate,
          templateName: form.templateName,
          planning: Object.assign({}, state.orderDetail.planning, {
            loadingDate: form.loadingDate,
            recurrence: form.recurrence,
            exchangePallets: form.exchangePallets,
            numberOfExchangePallets: form.numberOfExchangePallets,
          })
        })
      });
    }

    case actions.ORDERDETAIL_CLEAR: {
      return Object.assign({}, state, {
        mode: {
          type: 'order',
          state: 'view',
          editWindow: null,
          material: null,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          loading: true
        },
        orderDetail: null
      });
    }

    case actions.ORDERDETAIL_OPEN: {
      return Object.assign({}, state, {
        mode: {
          type: 'order',
          state: 'view',
          editWindow: null,
          material: null,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          loading: true
        },
        orderDetail: null
      });
    }

    case actions.ORDERDETAIL_OPEN_SUCCESS: {
      return readOrderTO(action.payload.orderDetail, action.payload.definitions);
    }

    case actions.ORDERDETAIL_COPY_OPEN_ORDER_SUCCESS: {
      const returnState = readOrderTO(action.payload.orderDetail, action.payload.definitions);
      return {
        ...returnState,
        orderDetail: {
          ...returnState.orderDetail,
          etmOrderNumber: null,
          salesOrderNumber: null,
          planning: {
            ...returnState.orderDetail.planning,
            orderDate: null,
            loadingDate: null
          },
          ccr: null
        },
        mode: {
          type: state.mode.type,
          state: 'create-confirm',
          editWindow: 'planning',
          createTemplate: false,
          editTemplate: false,
          material: null,
          loading: false,
          loadSuccess: true,
          saving: false,
          saved: false,
          saveSuccess: false,
          datesLoading: false
        }
      };
    }

    case actions.ORDERDETAIL_CREATE_FROM_TEMPLATE: {
      const returnState = readOrderTemplateTO(action.payload.template, action.payload.definitions);
      return {
        ...returnState,
        orderDetail: {
          ...returnState.orderDetail,
          deliveryMethod: {
            ...returnState.orderDetail.deliveryMethod,
            soldTo: action.payload.activeCustomer
          },
          planning: {
            ...returnState.orderDetail.planning,
            orderDate: null,
            loadingDate: action.payload.date
          },
          ccr: null
        },
        mode: {
          type: state.mode.type,
          state: 'create-confirm',
          editWindow: null,
          createTemplate: false,
          editTemplate: false,
          material: null,
          loading: false,
          loadSuccess: true,
          saving: false,
          saved: false,
          saveSuccess: false,
          datesLoading: false
        }
      };
    }

    case templateActions.TEMPLATE_COPY_FROM_ORDER_SUCCESS: {
      const returnState = readOrderTO(action.payload.orderDetail, action.payload.definitions);
      return {
        ...returnState,
        orderDetail: {
          ...returnState.orderDetail,
          planning: {
            ...returnState.orderDetail.planning,
            orderDate: null,
            loadingDate: null
          },
          ccr: null
        },
        mode: {
          type: state.mode.type,
          state: 'create-confirm',
          editWindow: null,
          createTemplate: true,
          editTemplate: false,
          material: null,
          loading: false,
          loadSuccess: true,
          saving: false,
          saved: false,
          saveSuccess: false,
          datesLoading: false
        }
      };
    }

    case actions.ORDERDETAIL_OPEN_FAIL: {
      return Object.assign({}, state, {
        mode: Object.assign({}, state.mode, {
          loading: false,
          createTemplate: state.mode.createTemplate,
          editTemplate: state.mode.editTemplate,
          loadSuccess: false
        })
      });
    }

    case actions.ORDERDETAIL_CREATE_SUBMIT: {
      return Object.assign({}, state, {
        mode: { ...state.mode, saving: true, saveSuccess: false, saved: false },
        recurrenceDates: action.payload.loadingDates && action.payload.loadingDates.map((date: any) => {
          return {
            ...date,
            createDate: !date.removed && (date.valid && date.requestedDate || date.proposedValid && date.proposedDate) || null,
            saving: !date.removed && (date.proposedValid || date.valid)
          }
        }) || null
      });
    }

    case actions.ORDERDETAIL_CREATE_SUBMIT_SUCCESS: {
      const response = JSON.parse(action.payload.result._body);
      let index = -1;

      const recurrenceDates: RecurrenceDate[] = state.recurrenceDates && state.recurrenceDates.map(date => {
        if (date.saving) {
          index++;
          return {
            ...date,
            etmOrderNumber: response[index].etmOrderNumber,
            salesOrderNumber: response[index].salesOrderNumber,
            saving: false,
          };
        }
        return date;
      }) || null;
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: true,
          saved: true
        },
        orderDetail: Object.assign({}, state.orderDetail, {
          etmOrderNumber: response[0].etmOrderNumber,
          salesOrderNumber: response[0].salesOrderNumber
        }),
        recurrenceDates
      });
    }

    case actions.ORDERDETAIL_CREATE_SUBMIT_FAIL: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: false,
          saved: false
        }
      });
    }

    case actions.ORDERDETAIL_CREATE_LOADINGDATES_SUCCESS: {
      return Object.assign({}, state, {
        availablePickingDates: action.payload
      });
    }

    case actions.ORDERDETAIL_REQUEST_DELIVERY_DATES_SUCCESS_NOEFFECT:
    case actions.ORDERDETAIL_REQUEST_DELIVERY_DATES_SUCCESS: {
      return Object.assign({}, state, {
        availablePickingDates: action.payload
      });
    }

    case actions.ORDERDETAIL_REQUEST_DELIVERY_DATES_FAIL: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          openingWindow: null,
          datesLoading: false
        },
      });
    }

    case actions.ORDERDETAIL_LOAD_TRUCK_CALCULATE_SUCCESS: {
      return Object.assign({}, state, {
        loadedEpp: action.payload.orderLineInfo && action.payload.orderLineInfo.loadedEpp,
        maxEpp: action.payload.orderLineInfo && action.payload.orderLineInfo.maxEpp,
        orderDetail: Object.assign({}, state.orderDetail, {
          fullTruck: action.payload.orderLineInfo.fullTruck,
          palletQuantity: parseInt(action.payload.orderLineInfo.quantity, 10),
          planning: {
            ...state.orderDetail.planning,
            maxAmountOfPalletExchangeAvailable: action.payload.orderLineInfo.maxAmountOfPalletExchangeAvailable
          }
        })
      });
    }

    case actions.ORDERDETAIL_LOAD_TRUCK_CALCULATE_FAIL: {
      return state;
    }

    case calendarActions.CALENDAR_REQUEST_ORDER_DELIVERY_DATES_SUCCESS: {
      return Object.assign({}, state, {
        availablePickingDates: action.payload
      });
    }

    case actions.ORDERDETAIL_GET_RECURRENCE_DATES: {
      return {
        ...state,
        mode: {
          ...state.mode,
          state: 'recurrence-dates',
          loading: true
        },
        recurrenceDates: null
      }
    }
    case actions.ORDERDETAIL_GET_RECURRENCE_DATES_SUCCESS: {
      return {
        ...state,
        mode: {
          ...state.mode,
          loading: false
        },
        recurrenceDates: action.payload.recurrentOrderDates
      }
    }

    case actions.ORDERDETAIL_GET_RECURRENCE_DATES_FAIL: {
      return {
        ...state,
        mode: {
          ...state.mode,
          loading: false
        },
        recurrenceDates: null
      }
    }

    case actions.ORDERDETAIL_BACK_TO_CREATE_CONFIRM: {
      return {
        ...state,
        mode: {
          ...state.mode,
          state: 'create-confirm',
          loading: false
        },
        recurrenceDates: null
      }
    }

    case actions.ORDERDETAIL_RESET_MATERIALS_AND_PLANNING: {
      return {
        ...state,
        mode: {
          ...state.mode,
          material: {
            internalId: 1,
          },
        },
        orderDetail: {
          ...state.orderDetail,
          materials: [],
          planning: {
            ...initialStateEditOrderDetail.orderDetail.planning,
            exchangePallets: state.orderDetail.planning.exchangePallets,
          }
        },
      };
    }

    case templateActions.ORDER_TEMPLATE_EDIT: {
      const returnState = readOrderTemplateTO(action.payload.template, action.payload.definitions);
      return Object.assign({}, state, {
        ...returnState,
        mode: {
          ...returnState.mode,
          type: 'template',
          state: 'create',
          editWindow: 'delivery',
          editTemplate: true,
          createTemplate: false,
          saved: false,
          saveSuccess: false,
          saving: false,
        }
      });
    }

    default: {
      return state;
    }
  }
}
