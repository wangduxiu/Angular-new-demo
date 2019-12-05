import { MaterialTypes } from 'app/core/store/contract-details/contract-details.interface';

const response: MaterialTypes = {
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
};

export default response;
