# uuBookKit-ext
It will add useful links into page.
- page title is link to Knowledge Base
- pencil icon for edit document structure is added (if used has permissions)
- MD link for edit document in [uuDockitHelper](https://github.com/jiridudekusy/uuDockitHelper) is added (if used has permissions)
- pencil icon for edit each section is added (if user has permission)
- ESC key will close edit window
- Menu
  - Long names in menu do not wrap
  - On mose hover is full name visible (overflow)
  - Specified menu items are colored (Business, uuSubApp, *Stores, uuCMD) 

# Install as a User Script - Tampermonkey
1. Add https://tampermonkey.net/ into your browser
2. Install User script from this URL: [uubookkit-ext.user.js](https://github.com/PetrHavelka/uubookkit-ext/raw/master/uubookkit-ext.user.js)

# Configuration
- In case of [uuDockitHelper](https://github.com/jiridudekusy/uuDockitHelper) is executed on different IP or port than http://localhost:4323/vendor-app-subapp/0-0/editor please edit the `mdUrl` in script. 
