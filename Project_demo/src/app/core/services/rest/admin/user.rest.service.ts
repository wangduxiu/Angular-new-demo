import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { UsersFilter } from '../../../store/admin/users/users-filter.interface';
import { ClientUser, EpsUser, PasswordResetResponse, User } from '../../../store/admin/users/users.interface';
import { util } from '../../../util/util';
import { RestService } from '../rest.service';
import { UserTO } from './user.rest.interface';

@Injectable()
export class UserRestService {
  private isTest = false;
  private isTestAlerted = false;

  constructor(
    private restService: RestService,
    private translate: TranslateService
  ) {
  }

  /**
   * Get client user
   * @param id ID of user to get
   * @returns observable containing the client user
   */
  getClientUser(id: string): Observable<ClientUser> {
    const users$: Observable<{
      totalItems: number;
      items: User[];
    }> = this.getUsers(
      { id, type: 'ClientUser' },
      null,
      null,
      null,
      null,
      this.clientUserMapper.bind(this)
    );
    return users$
      .take(1)
      .map(
        users =>
          users.totalItems === 1 ? (users.items[0] as ClientUser) : null
      );
  }

  /**
   * Get eps user
   * @param id ID of user to get
   * @returns observable containing the eps user
   */
  getEpsUser(id: string): Observable<EpsUser> {
    const users$: Observable<{
      totalItems: number;
      items: User[];
    }> = this.getUsers(
      { id, type: 'EpsUser' },
      null,
      null,
      null,
      null,
      this.epsUserMapper.bind(this)
    );
    return users$
      .take(1)
      .map(
        users => (users.totalItems === 1 ? (users.items[0] as EpsUser) : null)
      );
  }

  /**
   * Get client users
   * @param filter filter to use.  Filter on ClientUser is added automatically
   * @param pageSize how many users per page
   * @param pageNr which page nr to fetch (starts at 1)
   * @param sortField sort on field
   * @param sortAscending sort asc or desc
   * @returns Object containing the users for that page + totalItems & timestamp of snapshot in MW that is used to query on.
   */
  getClientUsers(
    filter: UsersFilter,
    pageSize: number,
    pageNr: number,
    sortField: string,
    sortAscending: boolean
  ): Observable<{ totalItems: number; items: User[] }> {
    return this.getUsers(
      { ...filter, type: 'ClientUser' },
      pageSize,
      pageNr,
      sortField,
      sortAscending,
      this.clientUserMapper.bind(this)
    );
  }

  /**
   * Get eps users
   * @param filter filter to use.  filter on EpsUser is added automatically
   * @param pageSize how many users per page
   * @param pageNr which page nr to fetch (starts at 1)
   * @param sortField sort on field
   * @param sortAscending sort asc or desc
   * @returns Object containing the users for that page + totalItems & timestamp of snapshot in MW that is used to query on.
   */
  getEpsUsers(
    filter: UsersFilter,
    pageSize: number,
    pageNr: number,
    sortField: string,
    sortAscending: boolean
  ): Observable<{ totalItems: number; items: User[] }> {
    return this.getUsers(
      { ...filter, type: 'EpsUser' },
      pageSize,
      pageNr,
      sortField,
      sortAscending,
      this.epsUserMapper.bind(this)
    );
  }

  /**
   * Refresh cached users in MW with users in Active Directory.  Needed to see latest changes in AD in our portal app
   * @returns true (or throws an exception)
   */
  syncWithAD(): Observable<boolean> {
    return this.restService
      .get<{ Users: any[] }>(`/User/triggerAzureActiveDirectorySync`)
      .map(response => {
        return true;
      });
  }

  /**
   * Update eps user
   * @param user the complete user.  id is used as reference to MW, only editable fields are sent in request
   * @returns boolean if it succeeds
   */
  updateEpsUser(user: EpsUser): Observable<boolean> {
    const cleanValue = val => (val && val.trim() ? val.trim() : undefined);
    const body = {
      id: user.id,
      language: cleanValue(user.language),
      salesOrganisations: user.salesOrganisations.reduce((res, so) => {
        return { ...res, [so.id]: so.name };
      }, {}),
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: !!user.isAdmin,
      isActive: !!user.isActive,
      canRelocate: !!user.canRelocate,
      adminRoles: {
        updateEpsUser: !!user.updateEpsUser,
        inviteEpsUser: !!user.inviteEpsUser,
        createClientUser: !!user.createClientUser,
        updateClientUser: !!user.updateClientUser,
        inviteClientUser: !!user.inviteClientUser,
        resetPassword: !!user.resetPassword,
        reInvite: !!user.reInvite,
      },
      delayToGoLive: !!user.isDelayed,
    };
    return this.restService.post<any>('/User/updateUser', body);
  }

  /**
   * invite eps user
   * @param user the complete user
   * @returns boolean if it succeeds
   */
  inviteEpsUser(user: EpsUser): Observable<boolean> {
    return this.createOrInviteEpsUser(user, 'inviteUser', resp => resp);
  }

  /**
   * create eps user
   * @param user the complete user
   * @returns boolean if it succeeds
   */
  createEpsUser(user: EpsUser): Observable<boolean> {
    return this.createOrInviteEpsUser(user, 'createUser', resp => JSON.parse(resp._body));
  }

  private createOrInviteEpsUser(user: EpsUser, action: String, responseMapper: (any) => any): Observable<any> {

    if (this.isTest) {
      if (!this.isTestAlerted) {
        alert('TEST MODE ON !!!');
        this.isTestAlerted = true;
      }
      const response = {
        '_body': '{"mail":"sdf.sdf@epswebportal.onmicrosoft.com","password":"uhQG03UbKR"}',
        'status': 200,
        'ok': true,
        'statusText': 'OK',
        'headers': { 'date': ['Mon', ' 18 Jun 2018 12:32:48 GMT'], 'content-encoding': ['gzip'], 'server': ['Kestrel'], 'x-powered-by': ['ASP.NET'], 'vary': ['Accept-Encoding'], 'content-type': ['application/json; charset=utf-8'], 'access-control-allow-origin': ['*'], 'transfer-encoding': ['chunked'], 'connection': ['close'], 'request-context': ['appId=cid-v1:c85b2eef-092b-435b-9050-1f4a9c11a311'] },
        'type': 2,
        'url': 'http://localhost:4200/api/User/createUser'
      };
      return Observable.of(JSON.parse(response._body)).debounceTime(2000);
    }

    const cleanValue = val => (val && val.trim() ? val.trim() : undefined);
    const body = {
      language: cleanValue(user.language),
      salesOrganisations: user.salesOrganisations.reduce((res, so) => {
        return { ...res, [so.id]: so.name };
      }, {}),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: 'EpsUser',
      isAdmin: !!user.isAdmin,
      isActive: !!user.isActive,
      canRelocate: !!user.canRelocate,
      adminRoles: {
        updateEpsUser: !!user.updateEpsUser,
        inviteEpsUser: !!user.inviteEpsUser,
        createClientUser: !!user.createClientUser,
        updateClientUser: !!user.updateClientUser,
        inviteClientUser: !!user.inviteClientUser,
        resetPassword: !!user.resetPassword,
        reInvite: !!user.reInvite,
      },
      delayToGoLive: !!user.isDelayed
    };
    return this.restService.post<any>('/User/' + action, body).map(responseMapper);

  }

  /**
   * Update client user
   * @param user the complete user.  id is used as reference to MW, only editable fields are sent in request
   * @returns boolean if it succeeds
   */
  updateClientUser(user: ClientUser): Observable<boolean> {
    const cleanValue = val => (val && val.trim() ? val.trim() : undefined);
    const body = {
      id: user.id,
      language: cleanValue(user.language),
      firstName: user.firstName,
      lastName: user.lastName,
      alternativeMail: user.alternateEmail,
      customers: user.customers.reduce((res, c) => {
        return {
          ...res,
          [c.soldTo.id]: {
            name: c.soldTo.name,
            roleId: c.role.id,
            shipTos:
              (c.shipTos &&
                c.shipTos.length &&
                c.shipTos.reduce((st, s) => {
                  return { ...st, [s.id]: s.name };
                }, {})) ||
              null
          }
        };
      }, {}),
      isActive: !!user.isActive,
      useEmailActors: !!user.useEmailActors,
      isTransporter: !!user.isTransporter,
      delayToGoLive: !!user.isDelayed
    };
    return this.restService.post<any>('/User/updateUser', body);
  }

  /**
   * Create new client user
   * @param user the complete user.  id is null, complete user is sent.  MW will do some validation (like uniqueness of email-address)
   * @returns boolean if it succeeds or throws an exception if it fails or request is invalid
   */
  createClientUser(user: ClientUser): Observable<boolean> {
    return this.createOrInviteClientUser(user, 'createUser', resp => JSON.parse(resp._body)); // RESPONSE: {"mail":"pierke.pierlala@epswebportal.onmicrosoft.com","password":"EuroPool2018"}
  }

  /**
   * Invite new client user
   * @param user the complete user.  id is null, complete user is sent.  MW will do some validation (like uniqueness of email-address)
   * @returns boolean if it succeeds or throws an exception if it fails or request is invalid
   */
  inviteClientUser(user: ClientUser): Observable<boolean> {
    return this.createOrInviteClientUser(user, 'inviteUser', resp => resp);
  }

  createInviteBulkClientUsersSheetUpload(formData: FormData): Observable<Response> {
    return this.restService.upload('/User/uploadUserSheet', formData);
  }

  downloadExampleBulkClientUsersSheet(): Observable<Response> {
    return this.restService.getBlobData('/User/downloadUserSheetExample');
  }

  private createOrInviteClientUser(user: ClientUser, action: String, responseMapper: (any) => any): Observable<boolean> {
    const cleanValue = val => (val && val.trim() ? val.trim() : undefined);
    const body = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      language: cleanValue(user.language),
      userType: 'ClientUser',
      customers: user.customers.reduce((res, c) => {
        return {
          ...res,
          [c.soldTo.id]: {
            name: c.soldTo.name,
            roleId: c.role.id,
            shipTos:
              (c.shipTos &&
                c.shipTos.length &&
                c.shipTos.reduce((st, s) => {
                  return { ...st, [s.id]: s.name };
                }, {})) ||
              null
          }
        };
      }, {}),
      isActive: !!user.isActive,
      useEmailActors: !!user.useEmailActors,
      isTransporter: !!user.isTransporter,
      delayToGoLive: !!user.isDelayed
    };

    if (this.isTest) {
      if (!this.isTestAlerted) {
        alert('TEST MODE ON !!!');
        this.isTestAlerted = true;
      }
      return Observable.create(observer => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            observer.error('FOUT');
          } else {
            const response = {
              '_body': '{"mail":"sdf.sdf@epswebportal.onmicrosoft.com","password":"uhQG03UbKR"}',
              'status': 200,
              'ok': true,
              'statusText': 'OK',
              'headers': { 'date': ['Mon', ' 18 Jun 2018 12:32:48 GMT'], 'content-encoding': ['gzip'], 'server': ['Kestrel'], 'x-powered-by': ['ASP.NET'], 'vary': ['Accept-Encoding'], 'content-type': ['application/json; charset=utf-8'], 'access-control-allow-origin': ['*'], 'transfer-encoding': ['chunked'], 'connection': ['close'], 'request-context': ['appId=cid-v1:c85b2eef-092b-435b-9050-1f4a9c11a311'] },
              'type': 2,
              'url': 'http://localhost:4200/api/User/createUser'
            };
            observer.next(JSON.parse(response._body));
          }
          observer.complete();
        }, Math.random() * 2000);
      });
    }

    return this.restService.post<any>('/User/' + action, body).map(responseMapper);
  }

  /**
   * Get users: helper method used by public rest methods
   * @param filter filter.  must contain type: ClientUser or EpsUser
   * @param pageSize how many users per page
   * @param pageNr which page nr to fetch (starts at 1)
   * @param sortField sort on field
   * @param sortAscending sort asc or desc
   * @param mapper that maps the generic user from MW to a specific user (ClientUser or EpsUser) used in front-end
   * @returns Object containing the users for that page + totalItems & timestamp of snapshot in MW that is used to query on.
   */
  private getUsers(
    filter: UsersFilter,
    pageSize: number,
    pageNr: number,
    sortField: string,
    sortAscending: boolean,
    mapper: (any) => any
  ): Observable<{ totalItems: number; items: User[] }> {
    const newParamsObject = {
      id: filter.id,
      userType: filter.type,
      lastname: filter.lastName,
      firstName: filter.firstName,
      email: filter.email,
      assigned:
        (filter.isAssigned && filter.isNotAssigned) ||
        (!filter.isAssigned && !filter.isNotAssigned)
          ? undefined
          : !!filter.isAssigned,
      IsActive:
        (filter.isActive && filter.isNotActive) ||
        (!filter.isActive && !filter.isNotActive)
          ? undefined
          : !!filter.isActive,
      IsAdmin:
        (filter.isAdmin && filter.isNotAdmin) ||
        (!filter.isAdmin && !filter.isNotAdmin)
          ? undefined
          : !!filter.isAdmin,
      pageNumber: pageNr,
      pageSize, // tslint:disable-line object-shorthand-properties-first
      sortingColumn: sortField,
      sortingType: sortAscending ? 'asc' : 'desc'
    };
    const params = util.serializeObjectToParams(newParamsObject);
    return this.restService
      .get<{
        items: any[];
        totalItems: number;
        lastAzureActiveDirectorySync: number;
      }>(`/User/queryUsers?${params}`)
      .map(response => {
        return {
          totalItems: response.totalItems,
          items: response.items.map(mapper),
          snapshotTimestamp: response.lastAzureActiveDirectorySync
        };
      });
  }

  private userMapper(user: UserTO): User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      alternateEmail: user.alternateMail,
      language: user.language,
      status: user.status, // creating or inAD or something like that
      isAssigned: user.isAssigned,
      isActive: user.isActive,
      userType: user.userType,
      isDelayed: user.invitationStatus === 'DELAYED',
      invitationAccepted: user.invitationAccepted,
    };
  }

  private clientUserMapper(user: UserTO): ClientUser {
    return {
      ...this.userMapper(user),
      useEmailActors: user.useEmailActors,
      isTransporter: user.isTransporter,
      customers: Object.keys(user.customers)
        .map(id => {
          return { id, ...user.customers[id] };
        })
        .map(customer => {
          const shipTos =
            (customer.shipTos &&
              Object.keys(customer.shipTos).map(key => {
                return { id: key, name: customer.shipTos[key] };
              })) ||
            [];
          const shipToNames =
            shipTos.map(shipTo => shipTo.name).join(' | ') || null;
          return {
            soldTo: { id: customer.id, name: customer.name },
            role: { id: customer.roleId },
            shipTos,
            shipToNames
          };
        })
    };
  }

  private epsUserMapper(user: UserTO): EpsUser {
    return {
      ...this.userMapper(user),
      salesOrganisations:
        (user.salesOrganisations &&
          Object.keys(user.salesOrganisations).map(soId => {
            return { id: soId, name: user.salesOrganisations[soId] };
          })) ||
        [],
      isAdmin: user.isAdmin,
      isAgent: user.isAgent,
      canRelocate: user.canRelocate,
      updateEpsUser: user.isAgent || user.updateEpsUser,
      inviteEpsUser: user.isAgent || user.inviteEpsUser,
      createClientUser: user.isAgent || user.createClientUser,
      updateClientUser: user.isAgent || user.updateClientUser,
      inviteClientUser: user.isAgent || user.inviteClientUser,
      resetPassword: user.isAgent || user.resetPassword,
      reInvite: user.isAgent || user.reInvite,
    };
  }

  reInviteUser(id: string): Observable<void> {
    return this.restService.post<any>(`/User/reInvite?id=${id}`, null);
  }

  resetPasswordUser(id: string): Observable<PasswordResetResponse> {
    return this.restService.post<any>(`/User/resetPassword?id=${id}`, null)
      .map(response => {
        return JSON.parse(response._body);
      });
  }
}
