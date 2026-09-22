import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IVuelo } from '../vuelo.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../vuelo.test-samples';

import { RestVuelo, VueloService } from './vuelo.service';

const requireRestSample: RestVuelo = {
  ...sampleWithRequiredData,
  fechaSalida: sampleWithRequiredData.fechaSalida?.toJSON(),
  fechaLlegada: sampleWithRequiredData.fechaLlegada?.toJSON(),
};

describe('Vuelo Service', () => {
  let service: VueloService;
  let httpMock: HttpTestingController;
  let expectedResult: IVuelo | IVuelo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VueloService);
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

    it('should create a Vuelo', () => {
      const vuelo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vuelo).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vuelo', () => {
      const vuelo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vuelo).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vuelo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vuelo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vuelo', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests).toHaveLength(1);
    });

    describe('addVueloToCollectionIfMissing', () => {
      it('should add a Vuelo to an empty array', () => {
        const vuelo: IVuelo = sampleWithRequiredData;
        expectedResult = service.addVueloToCollectionIfMissing([], vuelo);
        expect(expectedResult).toEqual([vuelo]);
      });

      it('should not add a Vuelo to an array that contains it', () => {
        const vuelo: IVuelo = sampleWithRequiredData;
        const vueloCollection: IVuelo[] = [
          {
            ...vuelo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVueloToCollectionIfMissing(vueloCollection, vuelo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vuelo to an array that doesn't contain it", () => {
        const vuelo: IVuelo = sampleWithRequiredData;
        const vueloCollection: IVuelo[] = [sampleWithPartialData];
        expectedResult = service.addVueloToCollectionIfMissing(vueloCollection, vuelo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vuelo);
      });

      it('should add only unique Vuelo to an array', () => {
        const vueloArray: IVuelo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vueloCollection: IVuelo[] = [sampleWithRequiredData];
        expectedResult = service.addVueloToCollectionIfMissing(vueloCollection, ...vueloArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vuelo: IVuelo = sampleWithRequiredData;
        const vuelo2: IVuelo = sampleWithPartialData;
        expectedResult = service.addVueloToCollectionIfMissing([], vuelo, vuelo2);
        expect(expectedResult).toEqual([vuelo, vuelo2]);
      });

      it('should accept null and undefined values', () => {
        const vuelo: IVuelo = sampleWithRequiredData;
        expectedResult = service.addVueloToCollectionIfMissing([], null, vuelo, undefined);
        expect(expectedResult).toEqual([vuelo]);
      });

      it('should return initial array if no Vuelo is added', () => {
        const vueloCollection: IVuelo[] = [sampleWithRequiredData];
        expectedResult = service.addVueloToCollectionIfMissing(vueloCollection, undefined, null);
        expect(expectedResult).toEqual(vueloCollection);
      });
    });

    describe('compareVuelo', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVuelo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 469 };
        const entity2 = null;

        const compareResult1 = service.compareVuelo(entity1, entity2);
        const compareResult2 = service.compareVuelo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 469 };
        const entity2 = { id: 26877 };

        const compareResult1 = service.compareVuelo(entity1, entity2);
        const compareResult2 = service.compareVuelo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return true if primaryKey matches', () => {
        const entity1 = { id: 469 };
        const entity2 = { id: 469 };

        const compareResult1 = service.compareVuelo(entity1, entity2);
        const compareResult2 = service.compareVuelo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
