v1.1.13
- RFC351 - Webportal - autocomplete function for order creation page
- RFC409 - multiple currencies
- RFC426 - Stock tile on landing page to be removed
- RFC389 - Webportal - change when clicking on a day in the calendar
- RFC-425/incident? - copy flows bug

v1.1.12
- EPS-1620: bad gateway error
- display email when authentication fails
- RFC350 - Webportal - Cancelled orders & movements should be shown in red
- RFC352 - Webportal - NO_LC mention as pallet type during order creation is confusing
- RFC329 - Webportal: caption to be shown in case of DL40 orders
- Issue related to Ellen (Edge case caching)

v1.1.11
- EPS-1578: Web portal calendar problem - orders shown per day
- EPS-1579: bulk upload fix

v1.1.10
- RFC215: create relocation: select batch or loose pallet
- EPS-1537: packings / pallets with same type but differen status or lvp is now allowed

v1.1.9
- bugfix calendar for relocations

v1.1.8
- fix getDeliveryDates bug
- calendar scroll fix for firefox
- EPS-1317: copy order
- fix bug 2361 - Multiple buttons active when creating CCR
- RFC176: EPS user can select depot

v1.1.7
- fix jira 
- fail safe reducer for orders query (missing locations). Was a workaround for another issue that made the webapp crash
- RFC152: optimized queries for calendars (orders & relocations)
- RFC152: visualization of truck load
- 2656: article line references in flows
- autocomplete2 fixes / changes
  - missing values when only 1 value
  - when only 1 value: auto select that value & disable
  - when deselect: apply sorting again

v1.1.6
- Show sales order number in result of filtering on orders & relocations
- fix 'edit orders' (accept/reject I assume) in orders-list since etmOrderNumber is not an unique ID for order, but combination of etmOrderNr & salesOrderNr

v1.1.5
- CR126: cookie consent
- CR126: calendar popup now shows all details of order / relocation
- CR126: prepare for multi select filters for orders & flows, changed orderStatus filter to multiselect
- CR126: email actors is boolean in client user profile, only these users will be able to manage email actors and send emails after order create.
- CR127:  isTransporter & select on multiple customers

v1.1.4
- UAT 1329: create CCR: seal nr only required when set in backend
- refactored guards (fixing refresh page issues) 
- fixed issue with 'create CCR' & changed depot in contract: invalid contract (fruitveiling)
- redirect bookmarks for email-actors to the dashboard
- Fixed jira EPS-732: receiver ref async validation pending issue

v1.1.3
- Reload filter-values when loading contract and missing locations in filter-values (for orders & flows)
- remove receiver ref nr validation on CCR
- copy feedback
- fix date format in ccr creation
NEW (CR126)
- paging: change items per page on query orders, flows, relocations, eps users, client users, invoices
- menu header changes
  - 'MORE...' instead of 3 dots
  - increased readability
- Go directly to dashboard if only 1 customer assigned to client user
- Go directly to customers if only 1 sales organisation assigned to EPS user
- Show selected sales organisation on top when scrolling through customers on 'customer select' page
- calendar scrolling
Fixes after testing:
- select sales org when returning after switching customer
- hide more... menu when not logged in

v1.1.2
- UAT 2598: When transport by EPS: from or to also contains locations that are only for 'transport by customer'
- UAT 2638: edit materials of relocations loaded the wrong values
- UAT 2641: email actor page removed from menu (temporal solution)
- Fix 'create CCR' for Z2
- added 'copy-to-clipboard' button for email on detail user screen
- added 'copy-to-clipboard' button for password on dialog window after resetting password or creating a user
- added progress bars for accessing users screens

v1.1.1
- UAT 2176: incoterms - show only ID's
- UAT 2422: show validation errors or warnings on customer ref nr when copying a flow or order
- UAT 2474: filter screen - blank value on top of list
- UAT 2079: calendar unavailable in the portal after an error
- UAT 2554: Edit client user: select soldTo issue
- UAT 2602: show error when loading contract (materials part) fails due to selected invalid part 1 of contract
- UAT 2603: fix sorting in orders create
- UAT 2605: fix issue with users with read-only role not being able to access orders
- UAT 2634: bugfix edit materials during create orders / flows / relocations
- CR 125: Search on sales order number and show in details for orders, flows & relocations
- CR: hide reports page for now
- CR: informational messages for truck load shown as notification instead of modals
- fixed issue with removing materials during create order
- version number visible for client users too

v1.1.0
-> production Sunday 24/03 for BE/NL

- resolve eps-247 - web portal - double click create double movement
- add_translations_roles 
   - add roles in translations
	 - client user -> customers -> role -> use roles in translations
	 - place roles of translations in store instead of roles from REST call
- add environment label next to logo to see difference on the client

v1.0.1

* Bugfixes
  - Show error message from backend when an error occurs during downloading of a PDF
  - Extend the 'same material' check when adding the same combination but with different 'packings per pallet' value
  - fix flow accept issues:
     - wrong quantity when original quantity (sender quantity) is edited and accept pressed in list
     - wrong edit mode when choosing 'update flow' in flow list and being forwarded to edit page, when from/to combination is not in handshakeTypes in contract.  Now take 'executeHandshake' boolean of list.
  - Updating the roles & shipTos of an existing user: select box is now correctly filled in when editing a line
  - Use level & message of error coming from middleware
  - show alternate mail for created users
  - log messages in App Insights cloud environment
  - Restrict access to relocation (authorization)
  - Enable creation of relocations when no customer is selected
  - Change the message shown when a user is created
  - Fix 'optional' marker on PO Ref Nr and follow the rules that are set in the backend
  - When contract changed, make it possible to show orders that are not supported anymore by the contract
  - Show correct opening hours (of TO or of FROM) in planning part of order creation

* Change requests  
  - restrict nr of sold-to roles to 1 when creating a new user
  - flows: late handshake (registrar & canHandshake): edit nothing
  - disable edit delivery values during handshake (or late handshake)

v0.5.0
- Edit first and last name for eps & client users 
- when ENTER pressed on certain forms, default button behaviour is triggered
- Filter flows: checked & difference filter removed
- edit flow handshakes
- edit flows
- Ship to / sold to
  - Changed invite & edit client user
  - Can now filter on ship-tos when querying for orders / flows
- Transport by EPS: contracts are merged for creating a new order. From or To is empty in that case. SAP will define correct from / to.  
- Button to download document when successfully created Flow
- Added Relocations module
- Extended Report module with Power BI and Stock
- Various bug fixes

v0.1.7
- Edit flow
- Cancel flow
- Edit template
- Various bug fixes
- Recurrence for orders
- Sold-to / ship to
- When creating / inviting / editing a client user, ship to's must be selected.

v0.1.6 QAS: 13/12/2017
- Translations page are now smarter: showing spinners & also the default values
