import { CDFlorderType, FlorderTypeTO } from 'app/core/store/contract-details/contract-details.interface';
import { Place } from 'app/core/store/florders/place.interface';
import { emptyPlace } from '../florders/place.model';

// export function mapFlorderTypes(types: FlorderTypeTO[], definitions: Definitions, shiptos: {[key: string]: PlaceTO})/*: CDFlorderType[]*/ {
export function mapFlorderTypes(types, definitions, locations: Place[]): CDFlorderType[] {
  const nameComparator = (a, b) => a.name.localeCompare(b.name);
  return types.map((florderType: FlorderTypeTO) => {
    return {
      ...florderType,
      id: florderType.id || '',
      shippingConditions: florderType.shippingConditions.map((shippingCondition) => {
        const def = shippingCondition.shippingCondition && definitions.transport.type.find(t => t.id === shippingCondition.shippingCondition);
        return {
          id: shippingCondition.shippingCondition || '-',
          name: def && def.name,
          froms: shippingCondition.froms.map((from, fromIndex) => {
            return {
              ...from,
              ...locations.find(l => l.id === from.id) || Object.assign({}, emptyPlace, { id: from.id, name: from.id }),
              isDefault: fromIndex === 0,
              tos: from.tos.map((to, toIndex) => {
                return {
                  ...to,
                  incoterms: to.incoterms.map((incoterm, incotermIndex) => {
                    const def = incoterm && definitions.order.incoterm.find(i => i.id === incoterm.incoterm);
                    return {
                      id: incoterm.incoterm || '-',
                      name: def && def.name,
                      isDefault: incotermIndex === 0,
                      combination: incoterm.combination || { palletIds: [] },
                      pallets: incoterm.pallets || [],
                      packings: incoterm.packings || [],
                    }
                  }),
                  ...locations.find(l => l.id === to.id) || Object.assign({}, emptyPlace, { id: to.id, name: to.id }),
                  isDefault: toIndex === 0,
                  wholesaler: Object.assign({}, to.wholesaler, {
                    wholesalers: to.wholesaler && to.wholesaler.wholesalers.map((ws) => {
                      return {
                        id: ws.id,
                        name: ws.id,
                      };
                    }).sort(nameComparator) || []
                  }),
                };
              }).sort(nameComparator),
            };
          }).sort(nameComparator),
        };
      }),
    };
  });
};
