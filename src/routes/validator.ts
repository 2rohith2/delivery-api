import { Parcel } from '../types';

export function parcelObjecValidator (parcel: Parcel): boolean {
  const from_address = parcel.from_address;
  const to_address = parcel.to_address;
  const fromAddressRegex = new RegExp('^[a-zA-Z0-9, ]{5,50}$');
  const toAddressRegex = new RegExp('^[a-zA-Z0-9, ]{5,50}$');

  if (!from_address) throw Error('Invalid from address');
  if (!fromAddressRegex.test(from_address)) throw Error('From address must have 5 to 50 characters');

  if (!to_address) throw Error('Invalid to address');
  if (!toAddressRegex.test(to_address)) throw Error('To address must have 5 to 50 characters');

  return true;
}

export function parcelIdValidator (id: string): boolean {
  const uuidV4Regex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

  if (!uuidV4Regex.test(id)) throw Error('Invalid to parcel id');
  return true;
}