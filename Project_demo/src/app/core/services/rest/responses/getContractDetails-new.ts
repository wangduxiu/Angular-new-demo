import {ContractDetailsTO} from '../../../store/contract-details/contract-details.interface';

export default {
  defaults: {
    transport: 'Z2',
    localCurrency: 'EUR'
  },
  restrictions: {
    useCcrValidation: true,
    blankReceiptPossible: true,
    deviationManagement: true,
    overruleMaxQty: false,
    GS1LineRef: false,
    palletExchange: true
  },
  orderTypes: [
    {
      id: 'EPS-CUS',
      name: 'Delivery FLOW for EPS',
      shippingConditions: [
        {
          shippingCondition: 'Z2',
          froms: [
            {
              id: 'BE11_001',
              tos: [
                {
                  id: '0002000220',
                  incoterms: [
                    {
                      incoterm: '',
                      combination: {
                        palletIds: [
                          {
                            id: '000000000031000004',
                            name: 'EUROPALLET-9200 (batch)',
                            packingIds: [
                              {
                                id: '000000000021000002',
                                name: 'RTI-46-CONT',
                                packingStatusses: [
                                  {
                                    id: '20',
                                    name: 'Conditioned 200',
                                    logisticsVarietyPackings: [
                                      {
                                        id: 'I',
                                        name: 'Folded in',
                                        packingsPerPallets: [
                                          {
                                            id: '304',
                                            name: '304 LC'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            id: 'NO_LC',
                            name: null,
                            packingIds: [
                              {
                                id: '000000000031000004',
                                name: 'EUROPALLET-9200 (batch)',
                                packingStatusses: [
                                  {
                                    id: 'CH',
                                    name: 'Checked',
                                    logisticsVarietyPackings: [
                                      {
                                        id: 'S',
                                        name: 'Stacked',
                                        packingsPerPallets: [
                                          {
                                            id: '18',
                                            name: '18 PC'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      packings: [
                        {
                          id: '000000000021000002',
                          name: 'RTI-46-CONT',
                          packingStatusses: [
                            {
                              id: 'UN',
                              name: 'Unsorted',
                              logisticsVarietyPackings: [
                                {
                                  id: 'I',
                                  name: 'Folded in',
                                  packingsPerPallets: []
                                }
                              ]
                            }
                          ]
                        }
                      ],
                      pallets: [
                        {
                          id: '000000000031000004',
                          name: 'EUROPALLET-9200 (batch)',
                          packingStatusses: [
                            {
                              id: '30',
                              name: 'Conditioned',
                              logisticsVarietyPackings: []
                            },
                            {
                              id: 'CH',
                              name: 'Checked',
                              logisticsVarietyPackings: [
                                {
                                  id: 'L',
                                  name: 'Loose',
                                  packingsPerPallets: []
                                }
                              ]
                            }
                          ]
                        }
                      ],
                    }
                  ],
                  poNumber: {
                    required: true,
                    unique: false,
                    mask: '^PBN[0-9][0-9][0-9][0-9]$',
                    example: 'PBN1234'
                  }
                }
              ]
            }
          ]
        }
      ],
    },
    {
      id: 'CUS-EPS',
      name: 'Return/Collection FLOW for EPS',
      shippingConditions: [
        {
          shippingCondition: 'Z2',
          froms: [
            {
              id: '0002000220',
              tos: [
                {
                  incoterms: [
                    {
                      incoterm: '',
                      id: 'BE11_001',
                      combination: {
                        palletIds: [
                          {
                            id: '000000000031000004',
                            name: 'EUROPALLET-9200 (batch)',
                            packingIds: [
                              {
                                id: '000000000021000002',
                                name: 'RTI-46-CONT',
                                packingStatusses: [
                                  {
                                    id: 'UN',
                                    name: 'Unsorted',
                                    logisticsVarietyPackings: [
                                      {
                                        id: 'I',
                                        name: 'Folded in',
                                        packingsPerPallets: [
                                          {
                                            id: '304',
                                            name: '304 LC'
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    id: 'SO',
                                    name: 'Sorted',
                                    logisticsVarietyPackings: [
                                      {
                                        id: 'I',
                                        name: 'Folded in',
                                        packingsPerPallets: [
                                          {
                                            id: '304',
                                            name: '304 LC'
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    id: '20',
                                    name: 'Conditioned 200',
                                    logisticsVarietyPackings: [
                                      {
                                        id: 'I',
                                        name: 'Folded in',
                                        packingsPerPallets: [
                                          {
                                            id: '200',
                                            name: '200 LC'
                                          },
                                          {
                                            id: '304',
                                            name: '304 LC'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            id: '000000000031000002',
                            name: 'POOLPALLET-9300',
                            packingIds: [
                              {
                                id: '000000000021000003',
                                name: 'RTI-11200....',
                                packingStatusses: [
                                  {
                                    id: 'SO',
                                    name: 'Sorted',
                                    logisticsVarietyPackings: [
                                      {
                                        id: 'R',
                                        name: 'Rigid',
                                        packingsPerPallets: [
                                          {
                                            id: '40',
                                            name: '40 LC'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            id: 'NO_LC',
                            name: null,
                            packingIds: [
                              {
                                id: '000000000031000004',
                                name: 'EUROPALLET-9200 (batch)',
                                packingStatusses: [
                                  {
                                    id: 'UC',
                                    name: 'Unchecked',
                                    logisticsVarietyPackings: [
                                      {
                                        id: 'S',
                                        name: 'Stacked',
                                        packingsPerPallets: [
                                          {
                                            id: '18',
                                            name: '18 PC'
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      packings: [
                        {
                          id: '000000000021000002',
                          name: 'RTI-46-CONT',
                          packingStatusses: [
                            {
                              id: 'SO',
                              name: 'Sorted',
                              logisticsVarietyPackings: [
                                {
                                  id: 'I',
                                  name: 'Folded in',
                                  packingsPerPallets: []
                                }
                              ]
                            }
                          ]
                        }
                      ],
                    }
                  ],
                  poNumber: {
                    required: true,
                    unique: false,
                    mask: '^PBN[0-9][0-9][0-9][0-9]$',
                    example: 'PBN1234'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  flowHandshakeTypes: [],
  flowTypes: [
    {
      id: 'CUS-CUS-MOV',
      name: 'Movement FLOW for EPS',
      shippingConditions: [
        {
          shippingCondition: 'Z2',
          froms: [
            {
              id: '0002000220',
              tos: [
                {
                  id: '0002000221',
                  clearing: false,
                  frequency: 'T',
                  wholesaler: {
                    mandatory: true,
                    wholesalers: [
                      {
                        id: 'WHOLESALE 1'
                      },
                      {
                        id: 'WHOLESALE 2'
                      },
                      {
                        id: 'WHOLESALE 3'
                      }
                    ]
                  },
                  poNumber: {
                    required: true,
                    unique: false,
                    mask: '^PO[0-9][0-9][0-9][0-9][0-9][0-9]$',
                    example: 'PO123456'
                  },
                  incoterms: [
                    {
                      incoterm: '',
                      packings: [
                        {
                          id: '000000000021000002',
                          name: 'RTI-46-CONT'
                        },
                        {
                          id: '000000000021000003',
                          name: 'RTI-11200....'
                        },
                        {
                          id: '000000000021000012',
                          name: 'RTI-24603'
                        },
                        {
                          id: '000000000031000004',
                          name: 'EUROPALLET-9200 (batch)'
                        }
                      ],
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  handshakes: {},
  locations: {
    BE11_001: {
      id: 'BE11_001',
      type: 'Depot',
      name: 'Katelijne',
      address: {
        street: 'Kempenarestraat 53',
        houseNo: '53, bus 1',
        postcode: 2860,
        city: 'SINT-KATELIJNE-WAVER',
        country: 'BE'
      },
      openingHours: [
        {
          Day: {
            weekday: 'MI',
            Afternoon: {
              from: '15:00:00',
              to: '17:00:00'
            }
          }
        }
      ],
      default: true
    },
    '0002000220': {
      id: '0002000220',
      type: 'Location',
      name: 'Aardappelhandel De Rop N.V.',
      address: {
        street: 'Wilgenweg',
        houseNo: '46',
        postcode: 2890,
        city: 'SINT-AMANDS',
        state: '01',
        country: 'BE'
      },
      openingHours: []
    },
    '0002000221': {
      id: '0002000221',
      type: 'Location',
      name: 'Aldi Erpe-Mere',
      address: {
        postcode: 3900,
        city: 'Erpe-Mere',
        country: 'BE'
      },
      openingHours: []
    }
  },
  authorizationMatrix: {
    ACCESS: {
      ORDERS: true,
      FLOWS: true,
      CALENDAR: true,
      INVOICES: true,
      STOCK: true,
      BLANK_RECEIPT: true,
      REPORTS: false,
    },
    FLOW: {
      QUERY: true,
      GET: true,
      CREATE: true,
      UPDATE: true,
      ACCEPT: true,
      OVERRULE_MAX: true
    },
    INVOICES: {
      ACCESS: true,
      QUERY: true,
      LIST_INVOICES_AS_DOCUMENT: true,
      GET_INVOICE_DOCUMENT: true
    },
    ORDER: {
      QUERY: true,
      GET: true,
      CREATE: true,
      UPDATE: true,
      CANCEL: true,
      ACCEPT: true,
      QUERY_TEMPLATE: true,
      GET_TEMPLATE: true,
      CREATE_TEMPLATE: true,
      DELETE_TEMPLATE: true,
      GET_DELIVERY_DATES: true,
      CHECK_PALLET_FLOOR_QUANTITY: true,
      LIST_ORDERS_AS_DOCUMENT: true,
      OVERRULE_MAX: true
    },
    STOCK: {
      GET_CURRENT_STOCK_LIST: true
    }
  },
  customerSummary: {
    shipTos: {},
    salesOrganisation: {
      id: 'BE10',
      phoneNumber: '+3215322868',
      emailAddress: 'info.be@europoolsystem.com'
    },
    latestOrders: [
      {
        EtmOrderNumber: '0100004265',
        SalesOrderNumber: '0200001352',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004264',
        SalesOrderNumber: '0200001349',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004263',
        SalesOrderNumber: '0200001351',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004262',
        SalesOrderNumber: '0200001350',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004261',
        SalesOrderNumber: '0200001348',
        DeliveryNumber: null,
        ShipmentNumber: null
      }
    ],
    latestFlows: [
      {
        EtmOrderNumber: '0100004196',
        SalesOrderNumber: '',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004081',
        SalesOrderNumber: '',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004266',
        SalesOrderNumber: '',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004158',
        SalesOrderNumber: '',
        DeliveryNumber: null,
        ShipmentNumber: null
      },
      {
        EtmOrderNumber: '0100004169',
        SalesOrderNumber: '',
        DeliveryNumber: null,
        ShipmentNumber: null
      }
    ],
    openHandshakes: {
      OpenHandshakeTotal: 106,
      OpenHandshakes: [
        {
          EtmOrderNumber: '0100003977',
          SalesOrderNumber: '',
          DeliveryNumber: null,
          ShipmentNumber: null
        },
        {
          EtmOrderNumber: '0100003992',
          SalesOrderNumber: '',
          DeliveryNumber: null,
          ShipmentNumber: null
        },
        {
          EtmOrderNumber: '0100003991',
          SalesOrderNumber: '',
          DeliveryNumber: null,
          ShipmentNumber: null
        },
        {
          EtmOrderNumber: '0100003879',
          SalesOrderNumber: '',
          DeliveryNumber: null,
          ShipmentNumber: null
        },
        {
          EtmOrderNumber: '0100003357',
          SalesOrderNumber: '',
          DeliveryNumber: null,
          ShipmentNumber: null
        }
      ]
    },
    stockOverview: {
      PackingAmount: 0,
      PalletAmount: 0
    }
  }
} as ContractDetailsTO;
