import { Address, Place } from './place.interface';

export const emptyAddress: Address = {
  country: '',
  street:'',
  postcode:'',
  city:''
}

export const emptyPlace: Place = {
  id: '',
  name: '',
  address: emptyAddress,
  openingHours: [],
};
