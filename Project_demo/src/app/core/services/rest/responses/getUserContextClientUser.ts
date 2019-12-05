// tslint:disable
import { UserContextTO } from '../../../store/user-context/user-context.interface';

export default {
  "id":"a71da0d2-883e-46a3-8871-923d55896381",
  "userId":"Rens.Bonnez@europoolsystem.com",
  "displayName":"Bonnez, Rens (Delaware)",
  "language":"en",
  "firstName": "Rens",
  "lastName":"Bonnez",
  "initials":"RB",
  "activeCustomerId":null,
  "activeCustomerName":null,
  "activeRole":null,
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
  "customerRoleMapping":{
    "0001000140":{
      "name":"Aardappelhandel De Rop N.V.",
      "roleId":"OWNER"
    }
  },
  "userType":"ClientUser"
} as UserContextTO
