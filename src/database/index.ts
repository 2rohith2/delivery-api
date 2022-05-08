import { Parcel, ParcelStatus, User } from '../types';

const users: User[] = [
  {
    'id': 1,
    'first_name': 'Erek',
    'last_name': 'Sanzio',
    'email': 'user1@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'm'
  },
  {
    'id': 2,
    'first_name': 'Lawrence',
    'last_name': 'Fleeman',
    'email': 'user2@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'm'
  },
  {
    'id': 3,
    'first_name': 'Elonore',
    'last_name': 'Beacroft',
    'email': 'user3@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'f'
  },
  {
    'id': 4,
    'first_name': 'Nels',
    'last_name': 'Marvelley',
    'email': 'user4@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'm'
  },
  {
    'id': 5,
    'first_name': 'Gwen',
    'last_name': 'Bragge',
    'email': 'user5@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'f'
  },
  {
    'id': 6,
    'first_name': 'Whit',
    'last_name': 'Milius',
    'email': 'user6@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'm'
  },
  {
    'id': 7,
    'first_name': 'Markos',
    'last_name': 'Yeliashev',
    'email': 'user7@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'm'
  },
  {
    'id': 8,
    'first_name': 'Mendel',
    'last_name': 'Pashe',
    'email': 'user8@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'm'
  },
  {
    'id': 9,
    'first_name': 'Ellery',
    'last_name': 'Beddoe',
    'email': 'user9@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'm'
  },
  {
    'id': 10,
    'first_name': 'Dorice',
    'last_name': 'Robertot',
    'email': 'user10@domain.com',
    'password': 'password',
    'role': 'sender',
    'gender': 'f'
  },
  {
    'id': 11,
    'first_name': 'Hendrik',
    'last_name': 'Reedy',
    'email': 'biker1@domain.com',
    'password': 'password',
    'role': 'biker',
    'gender': 'm'
  },
  {
    'id': 12,
    'first_name': 'Arin',
    'last_name': 'Jenne',
    'email': 'biker2@domain.com',
    'password': 'password',
    'role': 'biker',
    'gender': 'm'
  },
  {
    'id': 13,
    'first_name': 'Ashleigh',
    'last_name': 'Aldred',
    'email': 'biker3@domain.com',
    'password': 'password',
    'role': 'biker',
    'gender': 'f'
  },
  {
    'id': 14,
    'first_name': 'Jerrine',
    'last_name': 'Scamadin',
    'email': 'biker4@domain.com',
    'password': 'password',
    'role': 'biker',
    'gender': 'f'
  },
  {
    'id': 15,
    'first_name': 'Levin',
    'last_name': 'Sodeau',
    'email': 'biker5@domain.com',
    'password': 'password',
    'role': 'biker',
    'gender': 'm'
  }
];

const parcels: Parcel[] = [];

export function getUserByEmail (email: string): User {
  return users.filter(user => user.email === email)[0];
}

export function getUserDetailsByEmail (email: string): User {
  return users.filter(user => user.email === email)[0];
}

export function addParcel (parcel: Parcel) {
  parcels.push(parcel);
  return parcel;
}

export function getSenderParcelById (parcelId: string, senderId: number) {
  return parcels.filter(parcel => parcel.id === parcelId && parcel.sender_id === senderId)[0];
}

export function getBikerParcelById (parcelId: string, bikerId: number) {
  return parcels.filter(parcel => parcel.id === parcelId && parcel.biker_id === bikerId)[0];
}

export function deleteSenderParcelById (parcelId: string, senderId: number) {
  let foundParcelIndex = -1;
  parcels.find((aParcel, index) => {
    if (aParcel.id === parcelId && aParcel.sender_id === senderId) {
      foundParcelIndex = index;
    }
  });

  const parcel = parcels[foundParcelIndex];
  parcel.status = ParcelStatus.InActive;
  parcels[foundParcelIndex] = parcel;
}

export function getSenderParcelsByStatus (status: ParcelStatus, senderId: number): Parcel[] {
  return parcels.filter(aParcel => aParcel.status === status && aParcel.sender_id === senderId);
}

export function getBikerParcelsByStatus (status: ParcelStatus, bikerId: number): Parcel[] {
  if (status === ParcelStatus.New) {
    return parcels.filter(aParcel => aParcel.status === status);
  } else {
    return parcels.filter(aParcel => aParcel.status === status && aParcel.biker_id === bikerId);
  }
}

export function getParcelById (parcelId: string): Parcel {
  return parcels.filter(parcel => parcel.id === parcelId)[0];
}

export function updateParcel (parcel: Parcel) {
  let foundParcelIndex = -1;
  parcels.find((aParcel, index) => {
    if (aParcel.id === parcel.id) {
      foundParcelIndex = index;
    }
  });

  if (foundParcelIndex > -1) {
    parcels[foundParcelIndex] = parcel;
    return parcels[foundParcelIndex];
  } else {
    throw Error('Invalid Parcel Id');
  }
}