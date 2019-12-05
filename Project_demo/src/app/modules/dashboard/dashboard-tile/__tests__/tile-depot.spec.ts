import { DepotTile } from '../tile-depot';

/*
 Run test:
 jest --testRegex .*tile-depot.spec.*

 */
describe('TileDepot', () => {

  describe('1 opening hour', () => {
    const component1: DepotTile = new DepotTile(null);
    component1.depots = [{
      id: 'BE11_001', name: 'Katelijne',
      address: { street: 'Kempenarestraat 53', postcode: '2860', city: 'SINT-KATELIJNE-WAVER', country: 'BE' },
      openingHours: [
        { weekday: 'DO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] }
      ]
    }];
    component1.initOpeningHoursWeeks();
    it('should create 1 line', () => {
      expect(component1.openingHoursWeek.length).toBe(1);
      expect(component1.openingHoursWeek[0].daysDescription).toBe('THURSDAY');
    });
  });


  describe('2 adjacent opening hours', () => {
    const component2: DepotTile = new DepotTile(null);
    component2.openingHoursWeek = [];
    component2.depots = [{
      id: 'BE11_001', name: 'Katelijne',
      address: { street: 'Kempenarestraat 53', postcode: '2860', city: 'SINT-KATELIJNE-WAVER', country: 'BE' },
      openingHours: [
        { weekday: 'DO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'MI', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] }
      ]
    }];
    component2.initOpeningHoursWeeks();
    it('should create 1 line', () => {
      expect(component2.openingHoursWeek.length).toBe(1);
      expect(component2.openingHoursWeek[0].daysDescription).toBe('WEDNESDAY UNTIL THURSDAY');
    });
  });

  describe('Sunday & Saturday opening hours', () => {
    const component3: DepotTile = new DepotTile(null);
    component3.openingHoursWeek = [];
    component3.depots = [{
      id: 'BE11_001', name: 'Katelijne',
      address: { street: 'Kempenarestraat 53', postcode: '2860', city: 'SINT-KATELIJNE-WAVER', country: 'BE' },
      openingHours: [
        { weekday: 'SO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'SA', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] }
      ]
    }];
    component3.initOpeningHoursWeeks();
    it('should create 1 line', () => {
      expect(component3.openingHoursWeek.length).toBe(1);
      expect(component3.openingHoursWeek[0].daysDescription).toBe('SATURDAY UNTIL SUNDAY');
    });
  });

  describe('Saturday & Sunday opening hours', () => {
    const component4: DepotTile = new DepotTile(null);
    component4.openingHoursWeek = [];
    component4.depots = [{
      id: 'BE11_001', name: 'Katelijne',
      address: { street: 'Kempenarestraat 53', postcode: '2860', city: 'SINT-KATELIJNE-WAVER', country: 'BE' },
      openingHours: [
        { weekday: 'SA', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'SO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] }
      ]
    }];
    component4.initOpeningHoursWeeks();
    it('should create 1 line', () => {
      expect(component4.openingHoursWeek.length).toBe(1);
      expect(component4.openingHoursWeek[0].daysDescription).toBe('SATURDAY UNTIL SUNDAY');
    });
  });

  describe('Friday, Saturday & Sunday opening hours', () => {
    const component5: DepotTile = new DepotTile(null);
    component5.openingHoursWeek = [];
    component5.depots = [{
      id: 'BE11_001', name: 'Katelijne',
      address: { street: 'Kempenarestraat 53', postcode: '2860', city: 'SINT-KATELIJNE-WAVER', country: 'BE' },
      openingHours: [
        { weekday: 'FR', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'SA', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'SO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] }
      ]
    }];
    component5.initOpeningHoursWeeks();
    it('should create 1 line', () => {
      expect(component5.openingHoursWeek.length).toBe(1);
      expect(component5.openingHoursWeek[0].daysDescription).toBe('FRIDAY UNTIL SUNDAY');
    });
  });

  describe('Friday, Saturday, Sunday & Monday opening hours', () => {
    const component6: DepotTile = new DepotTile(null);
    component6.openingHoursWeek = [];
    component6.depots = [{
      id: 'BE11_001', name: 'Katelijne',
      address: { street: 'Kempenarestraat 53', postcode: '2860', city: 'SINT-KATELIJNE-WAVER', country: 'BE' },
      openingHours: [
        { weekday: 'FR', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'SA', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'SO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'MO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] }
      ]
    }];
    component6.initOpeningHoursWeeks();
    it('should create 1 line', () => {
      expect(component6.openingHoursWeek.length).toBe(1);
      expect(component6.openingHoursWeek[0].daysDescription).toBe('FRIDAY UNTIL MONDAY');
    });
  });


  describe('Friday, Saturday, Sunday & Monday opening hours', () => {
    const component7: DepotTile = new DepotTile(null);
    component7.openingHoursWeek = [];
    component7.depots = [{
      id: 'BE11_001', name: 'Katelijne',
      address: { street: 'Kempenarestraat 53', postcode: '2860', city: 'SINT-KATELIJNE-WAVER', country: 'BE' },
      openingHours: [
        { weekday: 'FR', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'SA', weekdayNr: 3, slots: [{ from: '15:00:00', to: '18:00:00' }] },
        { weekday: 'SO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] },
        { weekday: 'MO', weekdayNr: 3, slots: [{ from: '15:00:00', to: '17:00:00' }] }
      ]
    }];
    component7.initOpeningHoursWeeks();
    it('should create 1 line', () => {
      expect(component7.openingHoursWeek.length).toBe(2);
      expect(component7.openingHoursWeek[0].daysDescription).toBe('SUNDAY UNTIL MONDAY, FRIDAY');
      expect(component7.openingHoursWeek[1].daysDescription).toBe('SATURDAY');
    });
  });


})
;
