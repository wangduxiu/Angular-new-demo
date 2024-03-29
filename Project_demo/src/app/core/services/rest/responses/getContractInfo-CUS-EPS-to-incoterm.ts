import { ContractInfoTO } from 'app/core/store/contract-info/contract-info.interface';

export default {
  orderTypes: [
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
                  id: 'BE11_001',
                  incoterms: [
                    {
                      incoterm: '',
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
