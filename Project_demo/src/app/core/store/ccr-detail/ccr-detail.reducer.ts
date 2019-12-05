import { initialStateCombinationMaterial } from '../florder-detail/florder-detail.model';
import { Material, OrderDetailTO } from '../florder-detail/florder-detail.interface';
import * as actions from './ccr-detail.actions';
import { util } from '../../util/util';
import { AppSettings } from '../../../app.settings';
import { initialStateEditOrderDetail } from '../order-detail/order-detail.model';
import { EditOrderDetail } from '../order-detail/order-detail.interface';
import { CCREditMaterialLine } from './ccr-detail.interface';
import { Definitions } from '../definitions/definitions.interface';

export function reducer(state = util.deepCopy(initialStateEditOrderDetail), action: actions.Actions): EditOrderDetail {

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
        material.logisticsVarietyPacking = null;
        material.packingStatus = null;
        material.contentId = null;
        material.lineReferenceId = null;
        break;
      }
    }
  }

  function addOrReplaceMaterial(material: CCREditMaterialLine, returnState: EditOrderDetail) {
    const existingMaterial = !!state.orderDetail.ccr.ccrLineItems.find(
      m => m.internalId === material.internalId
    );
    if (existingMaterial) {
      return Object.assign({}, returnState, {
        orderDetail: Object.assign({}, returnState.orderDetail, {
          ccr: Object.assign({}, returnState.orderDetail.ccr, {
            ccrLineItems: state.orderDetail.ccr.ccrLineItems.map(
              l => {
                if (l.internalId === material.internalId) {
                  return Object.assign({}, l, {
                    ccrPackingsPerPallet: l.packingsPerPallet !== material.packingsPerPallet ? material.packingsPerPallet : null,
                    ccrNumberOfPallets: l.numberOfPallets !== material.numberOfPallets ? material.numberOfPallets : null,
                    ccrPackingQuantity: l.packingQuantity !== material.packingQuantity ? material.packingQuantity : null
                  });
                }
                return l;
              }
            )
          })
        })
      });
    } else {
      return Object.assign({}, returnState, {
        orderDetail: Object.assign({}, returnState.orderDetail, {
          ccr: Object.assign({}, returnState.orderDetail.ccr, {
            ccrLineItems: [...state.orderDetail.ccr.ccrLineItems, material]
          })
        })
      });
    }
  }

  function reduceOpenFlorder(dataTO: OrderDetailTO, definitions: Definitions) {
    return Object.assign({}, state, {
      mode: Object.assign({}, state.mode, {
        loading: false,
        loadSuccess: true
      }),
      orderDetail: {
        deliveryMethod: {
          soldTo: dataTO.soldTo && dataTO.soldTo.id,
          to: dataTO.to,
          from: dataTO.from,
          shippingCondition: dataTO.transport && definitions.transport.type.find(t => t.id === dataTO.transport),
          customerReferenceNumber: dataTO.customerRefNumber,
          senderRefNumber: dataTO.senderRefNumber,
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
          confirmedUnloadingDate: dataTO.confirmedUnloadingDate
        },
        exchangePallets: dataTO.exchangePallets || false,
        numberOfExchangePallets: '',
        requestedBalance: '',
        etmOrderNumber: dataTO.etmOrderNumber,
        registeredBy: dataTO.registeredBy,
        salesOrderNumber: dataTO.salesOrderNumber,
        deliveryNumber: dataTO.deliveryNumber,
        shipmentNumber: dataTO.shipmentNumber
      }
    });
  }

  switch (action.type) {
    case actions.CCRDETAIL_OPEN: {
      return Object.assign({}, state, {
        mode: {
          type: 'ccr',
          state: 'create',
          editWindow: 'delivery',
          loading: true
        }
      });
    }

    case actions.CCRDETAIL_OPEN_SUCCESS: {
      const material = util.deepCopy(initialStateCombinationMaterial) as Material;
      material.internalId = Math.max(0, ...state.orderDetail.materials.map(m => m.internalId)) + 1;
      const dataTO: OrderDetailTO = action.payload.orderDetail;
      const returnState = reduceOpenFlorder(dataTO, action.payload.definitions);
      return Object.assign({}, returnState, {
        mode: {
          ...returnState.mode,
          material: state.mode.state === 'create' ? material : null
        },
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
          materials: [],
          ccr: {
            ccrNumber: dataTO.ccr.ccrNumber,
            sealNumber: dataTO.ccr.sealNumber,
            ccrLineItems: dataTO.lineItems.map(li => {
              return {
                internalId: li.itemNumber,
                type: (li.palletId && li.packingId && 'combination') || (li.palletId && 'pallet') || 'packing',
                palletId: li.palletId,
                packingId: li.packingId,
                packingStatus: li.packingStatus,
                logisticsVarietyPacking: li.logisticsVarietyPacking,
                packingsPerPallet: li.packingsPerPallet,
                numberOfPallets: li.numberOfPallets,
                packingQuantity: li.packingQuantity
              };
            })
          }
        }
      });
    }

    case actions.CCRDETAIL_OPEN_FAIL: {
      return Object.assign({}, state, {
        mode: Object.assign({}, state.mode, {
          loading: false,
          loadSuccess: false
        })
      });
    }

    case actions.CCRDETAIL_CREATE_SAVE_MATERIAL: {
      const material = util.deepCopy(action.payload);
      const newMaterial = util.deepCopy(initialStateCombinationMaterial) as Material;
      newMaterial.internalId = Math.max(0, material.internalId, ...state.orderDetail.ccr.ccrLineItems.map(m => m.internalId)) + 1;
      const returnState = Object.assign({}, state, {
        mode: {
          type: 'ccr',
          state: state.mode.state,
          editWindow: state.mode.editWindow,
          material: newMaterial,
          saving: false
        }
      });
      prepareMaterial(material);
      return addOrReplaceMaterial(material, returnState);
    }

    case actions.CCRDETAIL_CREATE_SUBMIT: {
      return Object.assign({}, state, {
        mode: { ...state.mode, saving: true, saveSuccess: false, saved: false }
      });
    }

    case actions.CCRDETAIL_CREATE_SUBMIT_SUCCESS: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: true,
          saved: true
        },
        orderDetail: Object.assign({}, state.orderDetail, {
          ccr: Object.assign({}, state.orderDetail.ccr, {
            ccrNumber: JSON.parse(action.payload.result._body).ccrNumber,
          }),
        }),
      });
    }

    case actions.CCRDETAIL_CREATE_SUBMIT_FAIL: {
      return Object.assign({}, state, {
        mode: {
          ...state.mode,
          saving: false,
          saveSuccess: false,
          saved: true
        },
        orderDetail: Object.assign({}, state.orderDetail, {
          ccr: Object.assign({}, state.orderDetail.ccr, {
            ccrNumber: ''
          })
        })
      });
    }

    case actions.CCRDETAIL_CREATE_START_EDIT_MATERIAL: {
      return Object.assign({}, state, {
        mode: {
          type: 'ccr',
          state: state.mode.state,
          editWindow: state.mode.editWindow,
          material: {
            ...action.payload,
            isNew: false
          }
        }
      });
    }

    case actions.CCRDETAIL_CREATE_DELETE_MATERIAL: {
      return Object.assign({}, state, {
        orderDetail: Object.assign({}, state.orderDetail, {
          ccr: Object.assign({}, state.orderDetail.ccr, {
            ccrLineItems: state.orderDetail.ccr.ccrLineItems.filter(
              m => m !== action.payload
            )
          })
        })
      });
    }

    default: {
      return state;
    }
  }
}
