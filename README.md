# uuBookKit-ext
It will add useful links into page.
- Page title is a link to Knowledge Base
- Pencil icon for editing a document structure is added (if user has permissions)
- MD link for edit document in [uuDockitHelper](https://github.com/jiridudekusy/uuDockitHelper) is added (if used has permissions)
- Pencil icon for editing each section is added (if user has the permission)
- ESC key will close edit window
- Menu
  - Long names in menu do not wrap (full name is displayed by moving cursor over a menu item)
  - Enable to drag'n'drop resize left navigation.
  - Specific menu items are colored (Business, uuSubApp, *Stores, uuCMD)
- Scenarios
  - Add option to copy HDS and alternative scenarios with ordering numbers as a program comments into clipboard.

# Install as a User Script - Tampermonkey
1. Add https://tampermonkey.net/ into your browser
2. Install User script from this URL: [uubookkit-ext.user.js](https://github.com/PetrHavelka/uubookkit-ext/raw/master/uubookkit-ext.user.js)

# Configuration
- In case of [uuDockitHelper](https://github.com/jiridudekusy/uuDockitHelper) is executed on different IP or port than http://localhost:4323/vendor-app-subapp/0-0/editor (the default port could be 1234) please edit the `mdUrl` in script. 
