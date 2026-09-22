import dayjs from 'dayjs/esm';

import { IUserManagement, NewUserManagement } from './user-management.model';

export const sampleWithRequiredData: IUserManagement = {
  login: 'Randall.Sauer',
  email: 'Lucienne5@hotmail.com',
};

export const sampleWithPartialData: IUserManagement = {
  id: 18824,
  login: 'Sasha.McCullough4',
  firstName: 'Parker',
  lastName: 'Dietrich',
  email: 'Janessa44@hotmail.com',
  activated: false,
  langKey: 'en',
  lastModifiedBy: 'schematise hm',
  lastModifiedDate: dayjs('2023-12-06T10:12'),
};

export const sampleWithFullData: IUserManagement = {
  id: 26558,
  login: 'Brisa72',
  firstName: 'Lorena',
  lastName: 'Bode',
  email: 'Rylan_Altenwerth65@hotmail.com',
  activated: false,
  langKey: 'en',
  imageUrl: 'as vastly than',
  createdBy: 'out absentmindedly',
  createdDate: dayjs('2023-12-06T14:26'),
  lastModifiedBy: 'but sour sympathetically',
  lastModifiedDate: dayjs('2023-12-06T10:20'),
};

export const sampleWithNewData: NewUserManagement = {
  email: 'Jasen82@yahoo.com',
  login: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
