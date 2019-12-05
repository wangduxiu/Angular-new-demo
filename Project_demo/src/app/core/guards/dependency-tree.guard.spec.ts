import {Injector} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {DependencyTreeCanActivate, DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';

class HierarchicalCanActivateForTest implements DependencyTreeCanActivate {
  static INDEX = 1;
  index: number = undefined;
  accessed = 0;
  timestamp = 0;
  routeDataWhenAccessed = null;

  constructor(public name, private dependencies: CanActivate[], private value: boolean, private timeout = 100, private routeData: any = null) {
  }

  getDependencies() {
    return this.dependencies;
  };

  getDependencyRouteData() {
    return this.routeData
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.of(this.value).do(() => {
      this.index = HierarchicalCanActivateForTest.INDEX++;
      this.accessed++;
      this.routeDataWhenAccessed = JSON.parse(JSON.stringify(route.data));
      this.timestamp = new Date().getTime();
    }).delay(this.timeout);
  };
}

class MockInjector implements Injector {
  get(token, notFoundValue?): any {
    return token;
  }
}

function createActivatedRouteSnapshot(...guards) {
  return {
    ...new ActivatedRouteSnapshot(),
    data: {
      guards,
      testData: 'A'
    }
  }
}

function testHierarchicalRouteGuard(...guards): Observable<boolean> {
  const hrg = new DependencyTreeGuard(null, new MockInjector());
  return hrg.canActivate(createActivatedRouteSnapshot(...guards), null);
}

describe('HierarchicalRouteGuard can handle all types of returns from canActivate', () => {

  describe('HierarchicalRouteGuard with sequential guards', () => {

    it('1 guard will succeed', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      testHierarchicalRouteGuard(g1).subscribe(result => {
        expect(result).toBe(true);
        expect(g1.accessed).toBe(1);
        done();
      });
    });

    it('2 guards depending on each other and both returning true are both inspected ', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      const g2 = new HierarchicalCanActivateForTest('G2', [g1], true);

      testHierarchicalRouteGuard(g2).subscribe(result => {
        expect(result).toBe(true);
        expect(g1.accessed).toBe(1);
        expect(g2.accessed).toBe(1);
        expect(g1.index).toBeLessThan(g2.index);
        done();
      });
    });

    it('2 guards depending on each other and first returns false, second is not inspected ', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], false);
      const g2 = new HierarchicalCanActivateForTest('G2', [g1], true);

      testHierarchicalRouteGuard(g2).subscribe(result => {
        expect(result).toBe(false);
        expect(g1.accessed).toBe(1);
        expect(g2.index).toBeUndefined();
        done();
      });
    });

    it('3 guards depending on each other and both returning true are both inspected ', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      const g2 = new HierarchicalCanActivateForTest('G2', [g1], true);
      const g3 = new HierarchicalCanActivateForTest('G3', [g2], true);

      testHierarchicalRouteGuard(g3).subscribe(result => {
        expect(result).toBe(true);
        expect(g1.accessed).toBe(1);
        expect(g2.accessed).toBe(1);
        expect(g3.accessed).toBe(1);
        expect(g1.index).toBeLessThan(g2.index);
        expect(g2.index).toBeLessThan(g3.index);
        done();
      });
    });

    it('2 guards depending on each other and first returns false, second & third are not inspected ', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], false);
      const g2 = new HierarchicalCanActivateForTest('G2', [g1], true);
      const g3 = new HierarchicalCanActivateForTest('G3', [g2], true);

      testHierarchicalRouteGuard(g3).subscribe(result => {
        expect(result).toBe(false);
        expect(g1.accessed).toBe(1);
        expect(g2.index).toBeUndefined();
        expect(g3.index).toBeUndefined();
        done();
      });
    });

    it('2 guards depending on each other and second returns false, third is not inspected ', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      const g2 = new HierarchicalCanActivateForTest('G2', [g1], false);
      const g3 = new HierarchicalCanActivateForTest('G3', [g2], true);

      testHierarchicalRouteGuard(g3).subscribe(result => {
        expect(result).toBe(false);
        expect(g1.accessed).toBe(1);
        expect(g2.accessed).toBe(1);
        expect(g3.index).toBeUndefined();
        expect(g1.index).toBeLessThan(g2.index);
        done();
      });
    });
  });

  describe('HierarchicalRouteGuard with parallel guards', () => {

    it('1 guard depending 2 other guards are all inspected', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      const g2 = new HierarchicalCanActivateForTest('G2', [], true);
      const g3 = new HierarchicalCanActivateForTest('G3', [g1, g2], true);

      testHierarchicalRouteGuard(g3).subscribe(result => {
        expect(result).toBe(true);
        expect(g1.accessed).toBe(1);
        expect(g2.accessed).toBe(1);
        expect(g3.accessed).toBe(1);
        expect(g1.index).toBeLessThan(g3.index);
        expect(g2.index).toBeLessThan(g3.index);
        done();
      });
    });

    it('1 guard depending 3 other guards are all inspected', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      const g2 = new HierarchicalCanActivateForTest('G2', [], true);
      const g3 = new HierarchicalCanActivateForTest('G3', [], true);
      const g4 = new HierarchicalCanActivateForTest('G4', [g1, g2, g3], true);

      testHierarchicalRouteGuard(g4).subscribe(result => {
        expect(result).toBe(true);
        expect(g1.accessed).toBe(1);
        expect(g2.accessed).toBe(1);
        expect(g3.accessed).toBe(1);
        expect(g4.accessed).toBe(1);
        expect(g1.index).toBeLessThan(g4.index);
        expect(g2.index).toBeLessThan(g4.index);
        expect(g3.index).toBeLessThan(g4.index);
        done();
      });
    });

  });

  describe('HierarchicalRouteGuard with guards used more than once', () => {

    it('1 guard depending 3 other guards, some guards in dependency of others, are all inspected only once', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      const g2 = new HierarchicalCanActivateForTest('G2', [g1], true);
      const g3 = new HierarchicalCanActivateForTest('G3', [g1, g2], true);
      const g4 = new HierarchicalCanActivateForTest('G4', [g1, g2, g3], true);

      testHierarchicalRouteGuard(g4).subscribe(result => {
        expect(result).toBe(true);
        expect(g1.accessed).toBe(1);
        expect(g2.accessed).toBe(1);
        expect(g3.accessed).toBe(1);
        expect(g4.accessed).toBe(1);
        expect(g1.index).toBeLessThan(g4.index);
        expect(g2.index).toBeLessThan(g4.index);
        expect(g3.index).toBeLessThan(g4.index);
        done();
      });
    });

    it('3 guard with a circular dependency', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true);
      const g2 = new HierarchicalCanActivateForTest('G2', [g1], true);
      const g3 = new HierarchicalCanActivateForTest('G3', [g2], true);
      g1['dependencies'] = [g3];

      try {
        testHierarchicalRouteGuard(g3).subscribe(result => {
          expect(false).toBeTruthy();
          done();
        });
      } catch (error) {
        expect(error).toBe('CIRCULAR DEPENDENCY');
        done();
      }
    });

  });

  describe('HierarchicalRouteGuard with parallel guards run in parallel', () => {

    it('1 guard depending 3 other guards, some guards in dependency of others, are all inspected only once', (done) => {
      const g1 = new HierarchicalCanActivateForTest('G1', [], true, 100);
      const g2 = new HierarchicalCanActivateForTest('G2', [], true, 100);
      const g3 = new HierarchicalCanActivateForTest('G3', [g1, g2], true, 100);

      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(g3).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(true);
        expect(g1.accessed).toBe(1);
        expect(g2.accessed).toBe(1);
        expect(g3.accessed).toBe(1);
        expect(g1.index).toBeLessThan(g3.index);
        expect(g2.index).toBeLessThan(g3.index);
        expect(endTime - startTime).toBeLessThan(250);
        done();
      });
    });
  });

  /*
  A        100
    B      200
      D    100
    C      100
      E    100
        D  100
        B  200
    F      200

    =>  D  ->  B  ->  E  ->  C & F  ->  A
       100 + 200  + 100  +   200    + 100 = 700
   */
  describe('HierarchicalRouteGuard with complex structure', () => {

    it('Nested guards with recurring dependencies are investigated only once and in the right order', (done) => {
      const f = new HierarchicalCanActivateForTest('f', [], true, 200);
      const d = new HierarchicalCanActivateForTest('d', [], true, 200);
      const b = new HierarchicalCanActivateForTest('b', [d], true, 100);
      const e = new HierarchicalCanActivateForTest('e', [d, b], true, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], true, 100);
      const a = new HierarchicalCanActivateForTest('a', [b, c, f], true, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(true);
        expect(a.accessed).toBe(1);
        expect(b.accessed).toBe(1);
        expect(c.accessed).toBe(1);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(1);
        expect(f.accessed).toBe(1);
        expect(d.index).toBeLessThan(b.index);
        expect(b.index).toBeLessThan(e.index);
        expect(e.index).toBeLessThan(c.index);
        expect(e.index).toBeLessThan(f.index);
        expect(c.index).toBeLessThan(a.index);
        expect(f.index).toBeLessThan(a.index);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(800);
        done();
      });
    });

    it('if the first one fails, the next guards are not investigated', (done) => {
//  D  ->  B  ->  E  ->  C & F  ->  A
      const f = new HierarchicalCanActivateForTest('f', [], true, 200);
      const d = new HierarchicalCanActivateForTest('d', [], false, 200);
      const b = new HierarchicalCanActivateForTest('b', [d], true, 100);
      const e = new HierarchicalCanActivateForTest('e', [d, b], true, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], true, 100);
      const a = new HierarchicalCanActivateForTest('a', [b, c, f], true, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(false);
        expect(a.accessed).toBe(0);
        expect(b.accessed).toBe(0);
        expect(c.accessed).toBe(0);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(0);
        expect(f.accessed).toBe(0);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(300);
        done();
      });
    });

    it('if the second one fails, the next guards are not investigated', (done) => {
//  D  ->  B  ->  E  ->  C & F  ->  A
      const f = new HierarchicalCanActivateForTest('f', [], true, 200);
      const d = new HierarchicalCanActivateForTest('d', [], true, 200);
      const b = new HierarchicalCanActivateForTest('b', [d], false, 100);
      const e = new HierarchicalCanActivateForTest('e', [d, b], true, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], true, 100);
      const a = new HierarchicalCanActivateForTest('a', [b, c, f], true, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(false);
        expect(a.accessed).toBe(0);
        expect(b.accessed).toBe(1);
        expect(c.accessed).toBe(0);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(0);
        expect(f.accessed).toBe(0);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(400);
        done();
      });
    });

    it('if the third one fails, the next guards are not investigated', (done) => {
//  D  ->  B  ->  E  ->  C & F  ->  A
      const f = new HierarchicalCanActivateForTest('f', [], true, 200);
      const d = new HierarchicalCanActivateForTest('d', [], true, 200);
      const b = new HierarchicalCanActivateForTest('b', [d], true, 100);
      const e = new HierarchicalCanActivateForTest('e', [d, b], false, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], true, 100);
      const a = new HierarchicalCanActivateForTest('a', [b, c, f], true, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(false);
        expect(a.accessed).toBe(0);
        expect(b.accessed).toBe(1);
        expect(c.accessed).toBe(0);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(1);
        expect(f.accessed).toBe(0);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(500);
        done();
      });
    });

    it('if the fourth one fails, the next guards are not investigated', (done) => {
//  D  ->  B  ->  E  ->  C & F  ->  A
      const f = new HierarchicalCanActivateForTest('f', [], true, 200);
      const d = new HierarchicalCanActivateForTest('d', [], true, 200);
      const b = new HierarchicalCanActivateForTest('b', [d], true, 100);
      const e = new HierarchicalCanActivateForTest('e', [d, b], true, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], false, 100);
      const a = new HierarchicalCanActivateForTest('a', [b, c, f], true, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(false);
        expect(a.accessed).toBe(0);
        expect(b.accessed).toBe(1);
        expect(c.accessed).toBe(1);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(1);
        expect(f.accessed).toBe(1);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(700);
        done();
      });
    });

    it('if the fifth one fails, the next guards are not investigated', (done) => {
//  D  ->  B  ->  E  ->  C & F  ->  A
      const f = new HierarchicalCanActivateForTest('f', [], false, 200);
      const d = new HierarchicalCanActivateForTest('d', [], true, 200);
      const b = new HierarchicalCanActivateForTest('b', [d], true, 100);
      const e = new HierarchicalCanActivateForTest('e', [d, b], true, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], true, 100);
      const a = new HierarchicalCanActivateForTest('a', [b, c, f], true, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(false);
        expect(a.accessed).toBe(0);
        expect(b.accessed).toBe(1);
        expect(c.accessed).toBe(1);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(1);
        expect(f.accessed).toBe(1);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(700);
        done();
      });
    });

    it('if the last one fails, the next guards are not investigated', (done) => {
//  D  ->  B  ->  E  ->  C & F  ->  A
      const f = new HierarchicalCanActivateForTest('f', [], true, 200);
      const d = new HierarchicalCanActivateForTest('d', [], true, 200);
      const b = new HierarchicalCanActivateForTest('b', [d], true, 100);
      const e = new HierarchicalCanActivateForTest('e', [d, b], true, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], true, 100);
      const a = new HierarchicalCanActivateForTest('a', [b, c, f], false, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(false);
        expect(a.accessed).toBe(1);
        expect(b.accessed).toBe(1);
        expect(c.accessed).toBe(1);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(1);
        expect(f.accessed).toBe(1);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(800);
        done();
      });
    });

  });

  /*
A        100
  B      200
  C      100
  D      200
    C    100
    E    100
      F  200

  =>  F  ->  C & E  ->  B & D  ->  A

 */
  describe('HierarchicalRouteGuard with another complex structure', () => {

    it('Nested guards with recurring dependencies are investigated only once and in the right order', (done) => {
      const f = new HierarchicalCanActivateForTest('f', [], true, 200);
      const b = new HierarchicalCanActivateForTest('b', [], true, 100);
      const e = new HierarchicalCanActivateForTest('e', [f], true, 100);
      const c = new HierarchicalCanActivateForTest('c', [e], true, 100);
      const d = new HierarchicalCanActivateForTest('d', [c, e], true, 200);
      const a = new HierarchicalCanActivateForTest('a', [b, c, d], true, 100);
      const startTime = new Date().getTime();
      testHierarchicalRouteGuard(a).subscribe(result => {
        const endTime = new Date().getTime();
        expect(result).toBe(true);
        expect(a.accessed).toBe(1);
        expect(b.accessed).toBe(1);
        expect(c.accessed).toBe(1);
        expect(d.accessed).toBe(1);
        expect(e.accessed).toBe(1);
        expect(f.accessed).toBe(1);
        expect(f.timestamp).toBeLessThan(c.timestamp);
        expect(f.timestamp).toBeLessThan(e.timestamp);
        expect(e.timestamp).toBeLessThan(b.timestamp);
        expect(e.timestamp).toBeLessThan(d.timestamp);
        expect(c.timestamp).toBeLessThan(b.timestamp);
        expect(c.timestamp).toBeLessThan(d.timestamp);
        expect(b.timestamp).toBeLessThan(a.timestamp);
        expect(d.timestamp).toBeLessThan(a.timestamp);
        let duration = endTime - startTime;
        expect(duration).toBeLessThan(800);
        done();
      });
    });
  });


    describe('HierarchicalRouteGuard routeData is different', () => {

    it('It supports a guard that returns a boolean', (done) => {
      const guard = new (class implements CanActivate {
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          return true;
        }
      })();
      testHierarchicalRouteGuard(guard).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('It supports a guard that returns an async Observable<boolean°', (done) => {
      const guard = new (class implements CanActivate {
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          return Observable.of(true).delay(0);
        }
      })();
      testHierarchicalRouteGuard(guard).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('It supports a guard that returns an async Promise<boolean>', (done) => {
      const guard = new (class implements CanActivate {
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(true);
            });
          });
        }
      })();
      testHierarchicalRouteGuard(guard).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('It supports a guard that returns an sync Observable<boolean°', (done) => {
      const guard = new (class implements CanActivate {
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          return Observable.of(true);
        }
      })();
      testHierarchicalRouteGuard(guard).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('It supports a guard that returns an sync Promise<boolean°', (done) => {
      const guard = new (class implements CanActivate {
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        }
      })();
      testHierarchicalRouteGuard(guard).subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  it('1 guard depending 3 other guards, with no added route-data have the same routedata', (done) => {
    const g1 = new HierarchicalCanActivateForTest('G1', [], true);
    const g2 = new HierarchicalCanActivateForTest('G2', [g1], true);
    const g3 = new HierarchicalCanActivateForTest('G3', [g2], true);

    testHierarchicalRouteGuard(g3).subscribe(result => {
      expect(result).toBe(true);
      expect(g1.accessed).toBe(1);
      expect(g2.accessed).toBe(1);
      expect(g3.accessed).toBe(1);
      expect(g1.routeDataWhenAccessed.testData).toBe('A');
      expect(g2.routeDataWhenAccessed.testData).toBe('A');
      expect(g3.routeDataWhenAccessed.testData).toBe('A');
      done();
    });
  });

  it('1 guard depending 3 other guards, with empty added route-data have the same routedata', (done) => {
    const g1 = new HierarchicalCanActivateForTest('G1', [], true, undefined, {});
    const g2 = new HierarchicalCanActivateForTest('G2', [g1], true, undefined, {});
    const g3 = new HierarchicalCanActivateForTest('G3', [g2], true, undefined, {});

    testHierarchicalRouteGuard(g3).subscribe(result => {
      expect(result).toBe(true);
      expect(g1.accessed).toBe(1);
      expect(g2.accessed).toBe(1);
      expect(g3.accessed).toBe(1);
      expect(g1.routeDataWhenAccessed.testData).toBe('A');
      expect(g2.routeDataWhenAccessed.testData).toBe('A');
      expect(g3.routeDataWhenAccessed.testData).toBe('A');
      done();
    });
  });

  it('1 guard depending 3 other guards, middle guard has different data', (done) => {
    const g1 = new HierarchicalCanActivateForTest('G1', [], true);
    const g2 = new HierarchicalCanActivateForTest('G2', [g1], true, 100, { testData: 'B' });
    const g3 = new HierarchicalCanActivateForTest('G3', [g2], true);

    testHierarchicalRouteGuard(g3).subscribe(result => {
      expect(result).toBe(true);
      expect(g1.accessed).toBe(1);
      expect(g2.accessed).toBe(1);
      expect(g3.accessed).toBe(1);
      expect(g1.routeDataWhenAccessed.testData).toBe('B'); // Gets data from parent
      expect(g2.routeDataWhenAccessed.testData).toBe('B');
      expect(g3.routeDataWhenAccessed.testData).toBe('A');
      done();
    });
  });
});
