# uuBookKit-ext
It will add useful links into page.
- page title is link to Knowledge Base
- pencil icon for edit document structure is added (if used has permissions)
- MD link for edit document in [uuDockitHelper](https://github.com/jiridudekusy/uuDockitHelper) is added (if used has permissions)
- pencil icon for edit each section is added (if user has permission)

# Install as a User Script - Tampermonkey
1. Add https://tampermonkey.net/ into your browser
2. Install User script from this URL: [uubookkit-ext.user.js](https://github.com/PetrHavelka/uubookkit-ext/raw/master/uubookkit-ext.user.js)

# Configuration
- In case of [uuDockitHelper](https://github.com/jiridudekusy/uuDockitHelper) is executed on different IP or port than http://localhost:4323/vendor-app-subapp/0-0/editor please edit the `mdUrl` in script. 

# Chrome extension for uuBookKit - depricated

## Installation as developer
1. Download this repo.
2. Open Chrome and navigate to [chrome://extensions/](chrome://extensions/)
3. Enable developer mode
4. Load Unpacked extension - select uubookkit-ext folder from repo

## Install from package
Unfortunatelly this it not working because this extensions is not on published on Chrome Web Store yet. $5 payment is required.

Download [uubookkit-ext.crx](uubookkit-ext.crx) and drag-and-drop it into Chrome and confim plugin installation.


