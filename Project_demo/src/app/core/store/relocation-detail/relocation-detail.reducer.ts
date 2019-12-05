import {RecurrenceDate} from 'app/core/store/order-detail/order-detail.interface';
import * as templateActions from 'app/core/store/template/template.actions';
import {AppSettings} from '../../../app.settings';
import {util} from '../../util/util';
import {Material, OrderDetailTO} from '../florder-detail/florder-detail.interface';
import {initialStateCombinationMaterial} from '../florder-detail/florder-detail.model';
import * as actions from './relocation-detail.actions';
import {EditRelocationDetail, LoadingDatesTO} from './relocation-detail.interface';
import {initialStateEditRelocationDetail} from './relocation-detail.model';

export function reducer(state = util.deepCopy(initialStateEditRelocationDetail), action: actions.Actions | templateActions.Actions): EditRelocationDetail {
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

  function addOrReplaceMaterial(material: Material, returnState: EditRelocationDetail) {
    const existingMaterial = !!state.relocationDetail.materials.find(
      m => m.internalId === material.internalId
    );
    if (existingMaterial) {
      return Object.assign({}, returnState, {
        relocationDetail: Object.assign({}, returnState.relocationDetail, {
          materials: state.relocationDetail.materials.map(
            m => (m.internalId === material.internalId ? material : m)
          )
        })
      });
    } else {
      return Object.assign({}, returnState, {
        relocationDetail: Object.assign({}, returnState.relocationDetail, {
          materials: [...state.relocationDetail.materials, material]
        })
      });
    }
  }

  function reduceOpenFlorder(dataTO: OrderDetailTO): EditRelocationDetail {
    return Object.assign({}, state, {
      mode: Object.assign({}, state.mode, {
        loading: false,
        loadSuccess: true
      }),
      relocationDetail: {
        deliveryMethod: {
          to: dataTO.to,
          from: dataTO.from,
          transport: dataTO.transport,
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
            dataTO.requestedLoadingDate,
          unloadingDate:
            dataTO.confirmedUnloadingDate ||
            dataTO.requestedUnloadingDate,
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
        registeredBy: dataTO.registeredBy
      }
    });
  }

  const readRelocationTO = function (dataTO: OrderDetailTO): EditRelocationDetail {
    const returnState = reduceOpenFlorder(dataTO);
    const lineItems = dataTO.lineItems || dataTO['lineItem']; // diff between order & template
    return Object.assign({}, returnState, {
      relocationDetail: {
        ...returnState.relocationDetail,
        status: dataTO.orderStatus,
        deliveryMethod: {
          ...returnState.relocationDetail.deliveryMethod,
          type: dataTO.orderType
        },
        planning: {
          ...returnState.relocationDetail.planning,
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
      }
    });
  };

  const readRelocationTemplateTO = function (dataTO: { data: OrderDetailTO, id: number, name: string }): EditRelocationDetail {
    const returnState = readRelocationTO(dataTO.data);
    return {
      ...returnState,
      relocationDetail: {
        ...returnState.relocationDetail,
        templateId: '' + dataTO.id,
        templateName: dataTO.name,
        materials: returnState.relocationDetail.materials.map((m, index: number) => {
          return {
            ...m,
            internalId: index
          }
        })
      }
    };
  };

    switch (action.type) {
      case actions.RELOCATIONDETAIL_CLEAR: {
        return Object.assign({}, state, {
          mode: {
            type: 'relocation',
            state: 'view',
            editWindow: null,
            material: null,
            loading: false
          },
          relocationDetail: null
        });
      }

      case actions.RELOCATIONDETAIL_OPEN: {
        return Object.assign({}, state, {
          mode: {
            type: 'relocation',
            state: 'view',
            editWindow: null,
            material: null,
            loading: true
          },
          relocationDetail: null
        });
      }

      case actions.RELOCATIONDETAIL_OPEN_SUCCESS: {
        return readRelocationTO(action.payload as OrderDetailTO);
      }

      case actions.RELOCATIONDETAIL_OPEN_FAIL: {
        return Object.assign({}, state, {
          mode: Object.assign({}, state.mode, {
            loading: false,
            loadSuccess: false
          })
        });
      }

    case actions.RELOCATIONDETAIL_CREATE_START: {
      const pristineState = util.deepCopy(initialStateEditRelocationDetail);
      return Object.assign({}, pristineState, {
        mode: {
          type: 'relocation',
          state: 'create',
          editWindow: 'delivery',
          editTemplate: false,
          createTemplate: false,
        },
        relocationDetail: {
          ...pristineState.relocationDetail,
          deliveryMethod: {
            ...initialStateEditRelocationDetail.relocationDetail.deliveryMethod
          },
          planning: {
            ...initialStateEditRelocationDetail.relocationDetail.planning,
            unloadingDate: action.payload.date || pristineState.relocationDetail.planning.unloadingDate,
          }
        }
      });
    }

      case actions.RELOCATIONDETAIL_CREATE_SET_DELIVERY_METHOD: {
        const material = util.deepCopy(initialStateCombinationMaterial) as Material;
        material.internalId = Math.max(0, ...state.relocationDetail.materials.map(m => m.internalId)) + 1;
        return Object.assign({}, state, {
          mode: {
            type: 'relocation',
            state: state.mode.state,
            editTemplate: state.mode.editTemplate,
            createTemplate: state.mode.createTemplate,
            editWindow: state.mode.state === 'create' ? 'detail' : null,
            material: state.mode.state === 'create' ? material : null,
          },
          relocationDetail: Object.assign({}, state.relocationDetail, {
            deliveryMethod: action.payload.deliveryMethod
          })
        });
      }

      case actions.RELOCATIONDETAIL_EDIT_DELIVERY_METHOD: {
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

      case actions.RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_START: {
        return Object.assign({}, state, {
          mode: Object.assign({}, state.mode, { saving: true })
        });
      }

      case actions.RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_SUCCESS: {
        const material = util.deepCopy(action.payload.material);
        const newMaterial = util.deepCopy(initialStateCombinationMaterial) as Material;
        newMaterial.internalId = Math.max(0, material.internalId, ...state.relocationDetail.materials.map(m => m.internalId)) + 1;
        let returnState = Object.assign({}, state, {
          relocationDetail: Object.assign({}, state.relocationDetail, {
            fullTruck: action.payload.calculation && action.payload.calculation.orderLineInfo.fullTruck || false,
            palletQuantity: action.payload.calculation && parseInt(action.payload.calculation.orderLineInfo.quantity, 10) || 0,
            planning: {
              ...state.relocationDetail.planning,
              maxAmountOfPalletExchangeAvailable: action.payload.calculation && action.payload.calculation.orderLineInfo.maxAmountOfPalletExchangeAvailable || 0
            },
          }),
          mode: {
            type: 'relocation',
            state: state.mode.state,
            editWindow: state.mode.editWindow,
            material: newMaterial,
            editTemplate: state.mode.editTemplate,
            createTemplate: state.mode.createTemplate,
            saving: false,
          },
        });
        prepareMaterial(material);
        returnState = addOrReplaceMaterial(material, returnState);
        const orderContainsCombinations = !!returnState.relocationDetail.materials.find(m => m.type === 'combination');
        if (!orderContainsCombinations) {
          returnState.relocationDetail.planning.exchangePallets = false;
          returnState.relocationDetail.planning.numberOfExchangePallets = null;
        }
        return returnState;
      }

      case actions.RELOCATIONDETAIL_CREATE_START_EDIT_MATERIAL: {
        return Object.assign({}, state, {
          mode: {
            type: 'relocation',
            state: state.mode.state,
            editWindow: state.mode.editWindow,
            editTemplate: state.mode.editTemplate,
            createTemplate: state.mode.createTemplate,
            material: action.payload
          }
        });
      }

      case actions.RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_FAIL: {
        const material = util.deepCopy(action.payload.material);
        return Object.assign({}, state, {
          mode: Object.assign({}, state.mode, { material, saving: false })
        });
      }

      case actions.RELOCATIONDETAIL_CREATE_DELETE_MATERIAL: {
        const returnState = Object.assign({}, state, {
          relocationDetail: Object.assign({}, state.relocationDetail, {
            materials: state.relocationDetail.materials.filter(
              m => m !== action.payload
            ),
            planning: { ...state.relocationDetail.planning }
          })
        });
        const orderContainsCombinations = !!returnState.relocationDetail.materials.find(m => m.type === 'combination');
        if (!orderContainsCombinations) {
          returnState.relocationDetail.planning.exchangePallets = false;
          returnState.relocationDetail.planning.numberOfExchangePallets = null;
        }
        return returnState;
      }

      case actions.RELOCATIONDETAIL_CREATE_SAVE_ORDER_DETAIL: {
        return Object.assign({}, state, {
          mode: {
            ...state.mode,
            editWindow: state.mode.state === 'create' ? 'planning' : null,
            material: null
          }
        });
      }

      case actions.RELOCATIONDETAIL_CREATE_EDIT_ORDER_DETAIL: {
        const material = util.deepCopy(initialStateCombinationMaterial) as Material;
        material.internalId = Math.max(0, ...state.relocationDetail.materials.map(m => m.internalId)) + 1;
        return Object.assign({}, state, {
          mode: {
            material,
            createTemplate: state.mode.createTemplate,
            editTemplate: state.mode.editTemplate,
            type: state.mode.type,
            state: state.mode.state,
            editWindow: 'detail'
          }
        });
      }

    case actions.RELOCATIONDETAIL_CREATE_SAVE_PLANNING: {
      const form = action.payload;
      return Object.assign({}, state, {
        mode: {
          type: state.mode.type,
          state: 'create-confirm',
          editWindow: null,
          editTemplate: state.mode.editTemplate,
          createTemplate: state.mode.createTemplate,
          material: null
        },
        relocationDetail: Object.assign({}, state.relocationDetail, {
          createTemplate: form.createTemplate,
          templateName: form.templateName,
          planning: Object.assign({}, state.relocationDetail.planning, {
            loadingDate: form.loadingDate,
            unloadingDate: form.unloadingDate,
            recurrence: form.recurrence,
            exchangePallets: form.exchangePallets,
            numberOfExchangePallets: form.numberOfExchangePallets
          })
        })
      });
    }

      case actions.RELOCATIONDETAIL_CREATE_EDIT_ORDER_PLANNING: {
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

    case actions.RELOCATIONDETAIL_CREATE_SUBMIT: {
      return Object.assign({}, state, {
        mode: { ...state.mode, saving: true, saveSuccess: false, saved: false },
        recurrenceDates: action.payload.unloadingDates && action.payload.unloadingDates.map((date: any) => {
          return {
            ...date,
            createDate: !date.removed && (date.valid && date.requestedDate || date.proposedValid && date.proposedDate) || null,
            saving: !date.removed && (date.proposedValid || date.valid)
          }
        })
      });
    }

      case actions.RELOCATIONDETAIL_CREATE_SUBMIT_SUCCESS: {
        let response = JSON.parse(action.payload.result._body);

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
          relocationDetail: Object.assign({}, state.relocationDetail, {
            etmOrderNumber: response[0].etmOrderNumber,
            salesOrderNumber: response[0].salesOrderNumber
          }),
          recurrenceDates
        });
      }

      case actions.RELOCATIONDETAIL_CREATE_SUBMIT_FAIL: {
        return Object.assign({}, state, {
          mode: {
            ...state.mode,
            saving: false,
            saveSuccess: false,
            saved: true
          },
          relocationDetail: Object.assign({}, state.relocationDetail, {
            etmOrderNumber: ''
          })
        });
      }

    case actions.RELOCATIONDETAIL_COPY_OPEN_RELOCATION_SUCCESS: {
      const returnState = readRelocationTO(action.payload.relocationDetail);
      return {
        ...returnState,
        relocationDetail: {
          ...returnState.relocationDetail,
          etmOrderNumber: null,
          salesOrderNumber: null,
          planning: {
            ...returnState.relocationDetail.planning,
            orderDate: null,
            loadingDate: null,
            unloadingDate: null,
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

      case templateActions.RELOCATION_TEMPLATE_CREATE_START: {
        const pristineState = util.deepCopy(initialStateEditRelocationDetail);
        return Object.assign({}, pristineState, {
          mode: {
            type: 'relocation',
            state: 'create',
            editWindow: 'delivery',
            createTemplate: true,
            editTemplate: false,
          },
          recurrenceDates: null
        });
      }

    case templateActions.TEMPLATE_COPY_FROM_RELOCATION_SUCCESS: {
      const returnState = readRelocationTO(action.payload.relocationDetail);
      return {
        ...returnState,
        relocationDetail: {
          ...returnState.relocationDetail,
          planning: {
            ...returnState.relocationDetail.planning,
            orderDate: null,
            loadingDate: null,
            unloadingDate: null,
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

      case actions.RELOCATIONDETAIL_GET_RECURRENCE_DATES: {
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
      case actions.RELOCATIONDETAIL_GET_RECURRENCE_DATES_SUCCESS: {
        return {
          ...state,
          mode: {
            ...state.mode,
            loading: false
          },
          recurrenceDates: action.payload.recurrentOrderDates
        }
      }

      case actions.RELOCATIONDETAIL_GET_RECURRENCE_DATES_FAIL: {
        return {
          ...state,
          mode: {
            ...state.mode,
            loading: false
          },
          recurrenceDates: null
        }
      }

      case actions.RELOCATIONDETAIL_BACK_TO_CREATE_CONFIRM: {
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

    case actions.RELOCATIONDETAIL_CREATE_FROM_TEMPLATE: {
      const returnState = readRelocationTemplateTO(action.payload.template);
      return {
        ...returnState,
        relocationDetail: {
          ...returnState.relocationDetail,
          deliveryMethod: {
            ...returnState.relocationDetail.deliveryMethod,
          },
          planning: {
            ...returnState.relocationDetail.planning,
            orderDate: null,
            loadingDate: null,
            unloadingDate: action.payload.date
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

      case templateActions.RELOCATION_TEMPLATE_EDIT: {
        const returnState = readRelocationTemplateTO(action.payload.template);
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

      case actions.RELOCATIONDETAIL_REQUEST_LOADING_DATES: {
        return {
          ...state,
          availableLoadingDates: {
            loaded: false,
            loading: true,
            from: [],
            to: []
          }
        }
      }

      case actions.RELOCATIONDETAIL_REQUEST_LOADING_DATES_SUCCESS: {
        return {
          ...state,
          availableLoadingDates: {
            loaded: true,
            loading: false,
            from: (action.payload as LoadingDatesTO).fromDates,
            to: (action.payload as LoadingDatesTO).toDates
          }
        }
      }

      case actions.RELOCATIONDETAIL_REQUEST_LOADING_DATES_FAIL: {
        return {
          ...state,
          availableLoadingDates: {
            loaded: false,
            loading: false,
            from: [],
            to: []
          }
        }
      }

      case actions.RELOCATIONDETAIL_GET_MATERIALS: {
        return {
          ...state,
          materialsState: {
            ...initialStateEditRelocationDetail.materialsState,
            loading: true,
          }
        }
      }

      case actions.RELOCATIONDETAIL_GET_MATERIALS_SUCCESS: {
        return {
          ...state,
          materialsState: {
            ...initialStateEditRelocationDetail.materialsState,
            loadSuccess: true,
            data: action.payload,
          }
        }
      }

      case actions.RELOCATIONDETAIL_GET_MATERIALS_FAIL: {
        return {
          ...state,
          materialsState: {
            ...initialStateEditRelocationDetail.materialsState,
            loadFailed: true,
            errorMessage: action.payload,
          }
        }
      }

      default: {
        return state;
      }
    }
}
