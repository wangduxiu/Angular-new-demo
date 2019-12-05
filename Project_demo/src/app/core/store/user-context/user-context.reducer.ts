import * as actions from './user-context.actions';
import { CustomersTO, UserContext, UserContextTO } from './user-context.interface';
import { initialUserContext } from './user-context.model';

export function reducer(state = initialUserContext, action: actions.Actions): UserContext {

  switch (action.type) {
    case actions.USERCONTEXT_LOAD:
      return Object.assign({}, state, {
        contextLoading: true,
        contextLoaded: false,
      });
    case actions.USERCONTEXT_LOAD_SUCCESS:
      // alert("Change isAdmin to isAgent in user-context.reducer.ts");
      const userContextTO: UserContextTO = action.payload;
      const customersMapper = customers => customers && Object.keys(customers).map(id => Object.assign({id}, customers[id]));
      const salesOrganisationsMapper = salesOrganisations => salesOrganisations && Object.keys(salesOrganisations).map((id) => {
        return {
          id,
          name: salesOrganisations[id],
        };
      });

      return Object.assign({}, state, {
        contextLoaded: true,
        contextLoading: false,
        authorized: true,
        id: userContextTO.id,
        email: userContextTO.userId,
        firstName: userContextTO.firstName,
        lastName: userContextTO.lastName,
        initials: userContextTO.initials,
        language: userContextTO.language,
        customers: userContextTO.userType === 'ClientUser' ? customersMapper(userContextTO.customers) : null,
        salesOrganisations: userContextTO.userType === 'EpsUser' ? salesOrganisationsMapper(userContextTO.salesOrganisations) : null,
        isAdmin: !!userContextTO.isAdmin,
        isAgent: !!userContextTO.isAgent,
        isEpsUser: userContextTO.userType === 'EpsUser',
        canRelocate: userContextTO.canRelocate,
        useEmailActors: userContextTO.useEmailActors,
        isTransporter: userContextTO.isTransporter,
        showTutorial: userContextTO.showTutorial,
        activeCustomer: userContextTO.activeCustomerId,
        adminRoles: {
          updateEpsUser: userContextTO.isAgent || userContextTO.adminRoles.updateEpsUser,
          updateClientUser: userContextTO.isAgent || userContextTO.adminRoles.updateClientUser,
          createClientUser: userContextTO.isAgent || userContextTO.adminRoles.createClientUser,
          reInvite: userContextTO.isAgent || userContextTO.adminRoles.reInvite,
          inviteClientUser: userContextTO.isAgent || userContextTO.adminRoles.inviteClientUser,
          inviteEpsUser: userContextTO.isAgent || userContextTO.adminRoles.inviteEpsUser,
          resetPassword: userContextTO.isAgent || userContextTO.adminRoles.resetPassword,
        },
      });

    case actions.USERCONTEXT_LOAD_FAIL:
      return {
        ...initialUserContext,
        authorized: false,
        contextLoaded: false,
        contextLoading: false,
      };

    case actions.USERCONTEXT_UPDATE_TUTORIAL:
      return Object.assign({}, state, {
        ...state,
        showTutorial: false,
      });

    case actions.CUSTOMERS_CLEAR:
      return Object.assign({}, state, {
        customers: null,
        customersLoaded: false,
        customersLoading: false,
      });

    case actions.CUSTOMERS_LOAD:
      return Object.assign({}, state, {
        customersLoaded: false,
        customersLoading: true,
      });
    case actions.CUSTOMERS_LOAD_SUCCESS:
      const customersTO: CustomersTO = action.payload;
      return Object.assign({}, state, {
        customersLoaded: true,
        customersLoading: false,
        customers: customersTO.items.map(c => {return {id: c.customerNumber, name: c.customerName, salesOrganization: c.salesOrganization}}),
      });


    case actions.CUSTOMERS_LOAD_FAIL:
      return Object.assign({}, state, {
        customersLoaded: false,
        customersLoading: false,
        customers: null,
      });

    default:
      return state;

  }
}
