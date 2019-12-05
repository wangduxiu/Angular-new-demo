// tslint:disable
import { UserContextTO } from '../../../store/user-context/user-context.interface';

export default {
  "id":"a71da0d2-883e-46a3-8871-923d55896381",
  "userId":"Rens.Bonnez@europoolsystem.com",
  "email":"Rens.Bonnez@EuroPoolSystem.com",
  "displayName":"Bonnez, Rens (Delaware)",
  "firstName": "Rens",
  "lastName":"Bonnez",
  "initials":"RB",
  "language":"NL",
  "activeCustomerId":"0001000140",
  "activeCustomerName":"Aardappelhandel",
  "activeRole":"OWNER",
  "activeDirectoryGroups":{

  },
  adminRoles: {
    updateEpsUser: false,
    inviteEpsUser: false,
    createClientUser: false,
    updateClientUser: false,
    inviteClientUser: false,
    resetPassword: false,
    reInvite: false,
  },
  "isAdmin":true,
  "customerRoleMapping":{
    "0001000140":{
      "name":"Aardappelhandel De Rop N.V.",
      "roleId":"OWNER"
    }
  },
  "salesOrganisations":{
    "0001":"Sales Org. 001"
  },
  "userType":"EpsUser"
} as UserContextTO
