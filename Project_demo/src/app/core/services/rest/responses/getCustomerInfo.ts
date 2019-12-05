// tslint:disable
import {CustomerInfoTO} from 'app/core/store/customer-info/customer-info.interface';

export default {
  "authorizationMatrix": {
    "ACCESS": {
      "ORDERS": true,
      "FLOWS": true,
      "CALENDAR": true,
      "INVOICES": true,
      "STOCK": true,
      "BLANK_RECEIPT": true,
      "EMAIL_ACTORS": true,
      "REPORTS": true
    },
    "FLOW": {
      "QUERY": true,
      "GET": true,
      "CREATE": true,
      "UPDATE": true,
      "ACCEPT": true,
      "OVERRULE_MAX": true
    },
    "INVOICES": {
      "ACCESS": true,
      "QUERY": true,
      "LIST_INVOICES_AS_DOCUMENT": true,
      "GET_INVOICE_DOCUMENT": true
    },
    "ORDER": {
      "QUERY": true,
      "GET": true,
      "CREATE": true,
      "UPDATE": true,
      "CANCEL": true,
      "ACCEPT": true,
      "QUERY_TEMPLATE": true,
      "GET_TEMPLATE": true,
      "CREATE_TEMPLATE": true,
      "DELETE_TEMPLATE": true,
      "GET_DELIVERY_DATES": true,
      "CHECK_PALLET_FLOOR_QUANTITY": true,
      "LIST_ORDERS_AS_DOCUMENT": true,
      "OVERRULE_MAX": true
    },
    "STOCK": {
      "GET_CURRENT_STOCK_LIST": true
    }
  },
  "defaults": {
    "localCurrency": "EUR",
    "depot": {
      "id": "BE11_001",
      "type": "Depot",
      "address": "{\r\n  \"street\": \"Kempenarestraat 53\",\r\n  \"houseNo\": \"53, bus 1\",\r\n  \"postcode\": 2860,\r\n  \"city\": \"SINT-KATELIJNE-WAVER\",\r\n  \"country\": \"BE\"\r\n}",
      "name": "Katelijne",
      "openingHours": "[{\r\n  \"Day\": [\r\n    {\r\n      \"weekday\": \"MO\",\r\n      \"Morning\": {\r\n        \"from\": \"09:00:00\",\r\n        \"to\": \"18:00:00\"\r\n      }\r\n    },\r\n    {\r\n      \"weekday\": \"DI\",\r\n      \"Morning\": {\r\n        \"from\": \"09:00:00\",\r\n        \"to\": \"18:00:00\"\r\n      }\r\n    },\r\n    {\r\n      \"weekday\": \"MI\",\r\n      \"Morning\": {\r\n        \"from\": \"09:00:00\",\r\n        \"to\": \"18:00:00\"\r\n      }\r\n    },\r\n    {\r\n      \"weekday\": \"DO\",\r\n      \"Morning\": {\r\n        \"from\": \"09:00:00\",\r\n        \"to\": \"18:00:00\"\r\n      }\r\n    },\r\n    {\r\n      \"weekday\": \"FR\",\r\n      \"Morning\": {\r\n        \"from\": \"09:00:00\",\r\n        \"to\": \"18:00:00\"\r\n      }\r\n    },\r\n    {\r\n      \"weekday\": \"SA\",\r\n      \"Morning\": {\r\n        \"from\": \"09:00:00\",\r\n        \"to\": \"12:00:00\"\r\n      }\r\n    }\r\n  ]\r\n}]"
    }
  },
  "salesOrganisation": {
    "id": "BE10",
    "phoneNumber": "+32015322868",
    "emailAddress": "info.be@europoolsystem.com"
  },
  shipTos: {}
} as CustomerInfoTO
