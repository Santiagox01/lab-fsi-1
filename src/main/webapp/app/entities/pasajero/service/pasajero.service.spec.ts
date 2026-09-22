import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config';
import { IPasajero } from '../pasajero.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../pasajero.test-samples';

import { PasajeroService, RestPasajero } from './pasajero.service';

const requireRestSample: RestPasajero = {
  ...sampleWithRequiredData,
  fechaNacimiento: sampleWithRequiredData.fechaNacimiento?.format(DATE_FORMAT),
};

describe('Pasajero Service', () => {
  let service: PasajeroService;
  let httpMock: HttpTestingController;
  let expectedResult: IPasajero | IPasajero[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PasajeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Pasajero', () => {
      const pasajero = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pasajero).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pasajero', () => {
      const pasajero = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pasajero).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pasajero', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pasajero', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pasajero', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests).toHaveLength(1);
    });

    describe('addPasajeroToCollectionIfMissing', () => {
      it('should add a Pasajero to an empty array', () => {
        const pasajero: IPasajero = sampleWithRequiredData;
        expectedResult = service.addPasajeroToCollectionIfMissing([], pasajero);
        expect(expectedResult).toEqual([pasajero]);
      });

      it('should not add a Pasajero to an array that contains it', () => {
        const pasajero: IPasajero = sampleWithRequiredData;
        const pasajeroCollection: IPasajero[] = [
          {
            ...pasajero,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPasajeroToCollectionIfMissing(pasajeroCollection, pasajero);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pasajero to an array that doesn't contain it", () => {
        const pasajero: IPasajero = sampleWithRequiredData;
        const pasajeroCollection: IPasajero[] = [sampleWithPartialData];
        expectedResult = service.addPasajeroToCollectionIfMissing(pasajeroCollection, pasajero);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pasajero);
      });

      it('should add only unique Pasajero to an array', () => {
        const pasajeroArray: IPasajero[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pasajeroCollection: IPasajero[] = [sampleWithRequiredData];
        expectedResult = service.addPasajeroToCollectionIfMissing(pasajeroCollection, ...pasajeroArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pasajero: IPasajero = sampleWithRequiredData;
        const pasajero2: IPasajero = sampleWithPartialData;
        expectedResult = service.addPasajeroToCollectionIfMissing([], pasajero, pasajero2);
        expect(expectedResult).toEqual([pasajero, pasajero2]);
      });

      it('should accept null and undefined values', () => {
        const pasajero: IPasajero = sampleWithRequiredData;
        expectedResult = service.addPasajeroToCollectionIfMissing([], null, pasajero, undefined);
        expect(expectedResult).toEqual([pasajero]);
      });

      it('should return initial array if no Pasajero is added', () => {
        const pasajeroCollection: IPasajero[] = [sampleWithRequiredData];
        expectedResult = service.addPasajeroToCollectionIfMissing(pasajeroCollection, undefined, null);
        expect(expectedResult).toEqual(pasajeroCollection);
      });
    });

    describe('comparePasajero', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePasajero(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 4758 };
        const entity2 = null;

        const compareResult1 = service.comparePasajero(entity1, entity2);
        const compareResult2 = service.comparePasajero(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 4758 };
        const entity2 = { id: 13619 };

        const compareResult1 = service.comparePasajero(entity1, entity2);
        const compareResult2 = service.comparePasajero(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return true if primaryKey matches', () => {
        const entity1 = { id: 4758 };
        const entity2 = { id: 4758 };

        const compareResult1 = service.comparePasajero(entity1, entity2);
        const compareResult2 = service.comparePasajero(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
