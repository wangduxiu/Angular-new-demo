import { ContractInfoTO } from 'app/core/store/contract-info/contract-info.interface';

export default {
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
    }
  ],
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
  shiptos: {},
  handshakes: {},
} as ContractInfoTO;
