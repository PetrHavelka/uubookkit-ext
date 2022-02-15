// ==UserScript==
// @name         uuBookKit-ext
// @namespace    https://github.com/PetrHavelka/uubookkit-ext
// @version      0.13.2
// @description  Multiple Bookkit usability improvements
// @author       Petr Havelka, Josef Jetmar, Ales Holy
// @match        https://uuos9.plus4u.net/uu-dockitg01-main/*
// @match        https://uuos9.plus4u.net/uu-bookkitg01-main/*
// @match        https://uuapp.plus4u.net/uu-bookkit-maing01/*
// @match        https://docs.plus4u.net/book*
// @match        https://docs.plus4u.net/uaf/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @resource     jqueryUiCss https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @grant        GM_getResourceText
// ==/UserScript==

var jqueryUiCssText = GM_getResourceText ("jqueryUiCss");
GM_addStyle (jqueryUiCssText);
// ==/UserScript==

let mdUrl = 'http://localhost:4323/vendor-app-subapp/0-0/editor';

GM_addStyle(`
.bookkit-ext-edit,
.bookkit-ext-refresh,
.bookkit-ext-toc,
.bookkit-ext-page-reload {
  margin-left: 0.5em;
  font-size: 24px;
  cursor: pointer;
}
.bookkit-ext-refresh,
 bookkit-ext-top {
  font-size: 22px;
}
.bookkit-ext-page-reload {
  font-size: 24px;
}
.uu-bookkit-book-top-text {
  cursor: pointer;
}
#autocomplete {
  margin-left: auto;
  margin-right: auto;
  min-width: 400px;
}
#autocomplete-input {
  width: 100%;
}
#autocomplete-list {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
}
#autocomplete-list div {
  padding: 5px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
  margin-left: auto;
  margin-right: auto;
  color: black;
  font-size: 0.85em;
  min-width: 400px;
}
#autocomplete-list div span {
  display: block;
  font-size: 0.75em;
  color: gray;
}

#autocomplete-list div:hover {
  /*when hovering an item:*/
  background-color: #e9e9e9;
}

#autocomplete-list .autocomplete-active {
  /*when navigating through the items using the arrow keys:*/
  background-color: DodgerBlue !important;
  color: #ffffff;
}
#autocomplete-list .autocomplete-active span {
  color: #cccccc;
}
.bookkit-ext-md {
  color: black;
  text-decoration: none;
  font-size: 19px;
  margin-left: 0.8em;
}
.bookkit-ext-copy-jira-link,
.bookkit-ext-copy-md-link {
  color: black;
  text-decoration: none;
  font-size: 19px;
  margin-left: 0.8em;
  cursor: pointer;
}
.bookkit-ext-uusubapp {
  background-color: #EFFDD6;
}
.bookkit-ext-business {
  background-color: #DFF5FF;
}
.bookkit-ext-cmd {
  background-color: #fffadf;
}
.bookkit-ext-store {
  background-color: #ffeadf;
}
.plus4u5-app-page-left-wrapper {
  overflow: hidden !important;
}
.plus4u5-app-page-left-wrapper .ui-resizable-e {
  width: 7px;
  background: lightgray;
}
.uu5-bricks-page-column:hover .uu5-bricks-link {
  background-color: inherit;
}
.uu5-bricks-page-column:hover .plus4u5-app-menu-link .plus4u5-app-go-to-page-link {
  min-width: 100%;
  z-index: 0;
}
.plus4u5-app-go-to-page-link {
  white-space: nowrap;
}
/* Full step number */
.uu5-bricks-section ol.uu5-bricks-ol {
  counter-reset: item;
  list-style: none;
}
.uu5-bricks-section ol.uu5-bricks-ol > li:before {
  content: counters(item, ".") ".";
  counter-increment: item;
  padding-right: .75em;
  float: left;
}
.uu5-bricks-section > ol > li:before {
  display:run-in;
}
ol.uu5-bricks-ol ul.uu5-bricks-ul {
  padding-left: 3em;
}
.bookkit-ext-copy-links {
  position: absolute;
  right: 1em;
  padding-right: 0.5em;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  background-color: white;
  border: solid 1px black;
}
.bookkit-ext-copy-links span {
  margin-left: 0.5em;
  cursor: pointer;
  font-weight: 700;
  color: black;
}
.bookkit-ext-page-state {
  position: absolute;
  right: 1.5em;
  color: white;
}
.bookkit-ext-page-state.uu-bookkit-badge {
  min-height: 18px;
  min-width: 18px;
  font-size: 9px;
}
.bookkit-ext-page-state-test {
  background-color: rgb(0, 93, 167);
}
.bookkit-ext-page-state-underConstruction {
  background-color: rgb(245, 166, 35);
  color: black;
}
.bookkit-ext-page-state-closed {
  background-color: rgb(26, 35, 126);
}
.uu5-bricks-section a[href ^= "http"].uu5-bricks-link:not(.uu-bookkit-go-to-page-link):after {
  content: " " url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=);
}
.uu5-bricks-section .uu5-bricks-link.bookkit-ext-invalid-link {
  color: red;
}

div.toc ol a {
  color: #1976d2;
  cursor: pointer;
}

div.toc li {
  display: block;
}

`);

const LS_TOC_KEY = "BOOKIT_EXT_TOC";


(function () {
  'use strict';

  console.log("uuBookKit-ext starting...");

  let currentBook = {};
  let currentPageData = {};
  let currentBookStructure = {};
  let menuIndex = {};
  let ctrlKey = false;
  let ctrlKeyTimeout = null;
  let copyMenuVisible = false;
  let supportedSubSectionTypes2 = [ "uu5-richtext-block", "uu-uuapp-designkit-business-use-case-list", "uucontentkit-table", "uu-uuapp-designkit-embedded-text"];
  let supportedSubSectionTypes1 = [ "uu5-bricks-section" ];

  /** Returns an instance of the Update (or Edit) button */
  function getUpdateButton() {
    return $("div.uu-bookkit-book-top div.uu-bookkit-control-bar-executives > button");
  }

  /**
   * Open sub-sections. This does not work in 100% cases, because of lazy loading of some components.
   * Sub-sections are opened in 2 steps - in first step, only sub-sections from supportedSubSectionTypes1 are opened.
   * Then sub-sections from supportedSubSectionTypes2.
   */
  function openSubSections(counter, supportedSubSectionTypes) {
    let buttons = $("span.with-buttons > span.uudcc-bricks-component-wrapper-main-controls-div > button");
    let clicked = false;
    buttons.each((index, item) => {
      let componentTypeDiv = $(item).parent().parent().children("div");
      if (componentTypeDiv.length) {
        let cls = componentTypeDiv.attr("class");
        if (supportedSubSectionTypes.find(item => cls.includes(item))) {
          try {
            item.click();
          } catch (e) {} // Ignore any errors
          clicked = true;
        }
      }
    });

    if (counter < 2) { // Wait up to 2 times before continuing with next step
      setTimeout(() => openSubSections(clicked ? 0 : counter + 1, supportedSubSectionTypes), 1000);
    } else if (supportedSubSectionTypes === supportedSubSectionTypes1) {
      console.log("Opening of sub-sections step 1 finished");
      setTimeout(() => openSubSections(0, supportedSubSectionTypes2), 1000);
    } else {
      console.log("Opening of sub-sections step 2 finished");
    }
  }

  /** Waits for all the sections to be in edit mode and then starts edit mode for all sub-sections */
  function waitForSectionsEditMode(initialized) {
    let keys = Object.keys(initialized);
    let allInitialized = true;
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (!initialized[key]) {
        let element = $("#" + key + " > .color-schema-green");
        if (element.length) {
          while (!element.attr("class").includes("uudcc-bricks-basic-section")) element = element.parent();
          if (element.find("div.dcc-content-root-edit-mode").length && element.find("div.dcc-content-root-edit-mode > span > span > div.uu5-common-div").length &&
             element.find("div.dcc-content-root-edit-mode > span > span > span.uudcc-bricks-component-wrapper-main-controls-div > button").length) {
            initialized[key] = true;
          }
        } else {
          allInitialized = false;
          console.log("Waiting for initialization of " + key);
        }
      }
    }
    if (!allInitialized) {
      setTimeout(() => waitForSectionsEditMode(initialized), 1000);
    } else {
      setTimeout(() => openSubSections(0, supportedSubSectionTypes1), 1000);
    }
  }

  /** Waits for the edit mode to be started and then starts edit mode for all sections */
  function postStartEditMode(openSubsections) {
    if (!isInEditMode()) {
      setTimeout(() => postStartEditMode(openSubsections), 1000);
      return;
    }
    let initialized = {};
    let items = $("div.uudcc-bricks-toolbar-controls > button.color-schema-grey-rich").each((index, item) => {
      initialized[item.parentNode.id] = false;
      item.click();
    });
    if (openSubsections) {
      waitForSectionsEditMode(initialized);
    }
  }

  /** Starts edit mode and runs post-actions, which set edit mode for all sections and sub-sections */
  function startEditMode(openSubsections) {
    let activeElement = document.activeElement;
    if (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA") { // Do not start edit mode, when typing text
      getUpdateButton().click();
      postStartEditMode(openSubsections);
    }
  }

  /** Checks, if the edit mode is currently on */
  function isInEditMode() {
    return $(".uudcc-bricks-toolbar").length > 0;
  }

  /** Check, if modal window is open */
  function isModalOpen() {
    return $(".uu5-bricks-modal-overflow.uu5-bricks-modal-isfooter").length > 0;
  }

  /** Adds table of contents to the page */
  function addToc() {
    let minLevel = 6;
    let first = true;
    // Find minimum level
    $("h1, h2, h3, h4, h5, h6").each((index, item) => {
      if (first) first = false; else {
        let currentLevel = parseInt(item.tagName.substr(1));
        if (currentLevel < minLevel) minLevel = currentLevel;
      }
    });

    // Generate ToC
    first = true;
    let result = "<div class='toc'>";
    let currentLevel = minLevel - 1;
    let headerFound = false;
    let counters = [0, 0, 0, 0, 0, 0];

    $("h1, h2, h3, h4, h5, h6").each((index, item) => {
      if (first) first = false; else {
        let parsedLevel = parseInt(item.tagName.substr(1));
        while (currentLevel > parsedLevel) {
          result += "</li></ol>";
          currentLevel--;
        }
        if (currentLevel == parsedLevel) result += "</li>";

        while (currentLevel < parsedLevel - 1) {
          result += "<ol><li>";
          currentLevel++;
          counters[currentLevel - minLevel] = 1;
        }
        if (currentLevel < parsedLevel) {
          result += "<ol>";
          currentLevel++;
          counters[currentLevel - minLevel] = 0;
        }
        counters[currentLevel - minLevel]++;

        if (item.className.includes("numbered-header")) {
          item.innerText = item.innerText.substr(item.innerText.indexOf(" ") + 1);
        } else {
          item.className += " numbered-header";
        }
        item.innerText = counters.slice(0, currentLevel - minLevel + 1).join(".") + ". " + item.innerText;
        headerFound = true;
        result += "<li><a onclick=\"document.getElementById('" + item.id + "').scrollIntoView()\">" + item.innerText + "</a>";
      }
    });

    // There was something found, so add it to the page
    if (headerFound) {
      while (currentLevel-- >= minLevel) result += "</li></ol>";
      result += "</div>";
      let currentToc = $("div.toc");
      if (currentToc.length > 0) currentToc.remove();
      $(result).insertAfter($("div.uu-bookkit-page-ready > h1"));
    }
  }



  // init of each bookkit page
  let initPage = function () {
    let page = $(".uu-bookkit-page-ready");
    // if page not ready do it later
    if (!page.length) {
      setTimeout(initPage, 200);
      return;
    }

    // page is already done - remove all links
    if (page.hasClass("bookkit-ext-page-done")) {
      $(".bookkit-ext-md").remove();
      $(".bookkit-ext-page-reload").remove();
      $(".bookkit-ext-copy-jira-link").remove();
      $(".bookkit-ext-copy-md-link").remove();
      $(".bookkit-ext-copy-scenario-panel").remove();
    }

    // update HTML - add icons and links
    let editIcon = 'uu5-bricks-icon mdi mdi-lead-pencil';

    let pageTitle = $(".uu-bookkit-page h1 .uu-bookkit-page-ready-header");
    let pageTitleSpan = pageTitle.find(".uu5-bricks-span").addClass("bookkit-ext-page-title-span");

    // add MD link
    pageTitle.append('<a href="' + mdUrl + '?page=' + encodeURIComponent(window.location.href) + '" target="_blank" class="bookkit-ext-md">MD</span></a>');

    // page refresh icon
    pageTitle.append('<span class="uu5-bricks-icon mdi mdi-reload bookkit-ext-page-reload" title="Reload current page" accesskey="r"></span>');

    // copy link - JIRA format
    pageTitle.append('<span class="bookkit-ext-copy-jira-link" title="Copy link to current page into clipboard in JIRA format" data-page-name="' + pageTitleSpan.text() + '">copy link</span>');
    // copy link - MD format
    pageTitle.append('<span class="bookkit-ext-copy-md-link" title="Copy link to current page into clipboard in MD format" data-page-name="' + pageTitleSpan.text() + '">copy MD link</span>');

    // add copy scenarios
    initCopyScenarios();

    // add colours into menu
    colorizeMenu();

    // mark invalid link by rec color
    colorizeInvalidLinks();

    // add resizable left navigation
    initResizableLeftNavigation();

    // add title attributes to the navigation tree items
    addNavigationTitles();

    // add table of content
    if (localStorage.getItem(LS_TOC_KEY) == "true") addToc();

    initAutocomplete($("#autocomplete-input"), menuIndex);

    // mark page as ready
    page.addClass("bookkit-ext-page-done");

  };

  // first init of whole webpage
  let firstInit = function () {
    let title = $(".uu-bookkit-book-top-text");
    // if page not loaded yet - do it later
    if (!title.length) {
      setTimeout(firstInit, 3000);
      return;
    }

    let autocompleteInput = $('<div id="autocomplete"><input type="text" id="autocomplete-input" name="autocomplete" autocomplete="off" accesskey="n" /></div>');
    const acIn = autocompleteInput.children()[0];
    acIn.placeholder = `Search for page (${acIn.accessKeyLabel || 'Alt + ' + acIn.accessKey})`;
    title.after(autocompleteInput);

    // update HTML - add icons and links
    let refreshIcon = '<span class="uu5-bricks-icon mdi mdi-reload bookkit-ext-refresh"></span>';
    let toc = '<span class="uu5-bricks-icon mdi mdi-table-of-contents bookkit-ext-toc"></span>';
    title.after(toc);
    title.after(refreshIcon);

    // add state of page into menu
    addStateIntoMenu();

    // init bookkit page
    initPage();
  };

  let colorizeMenu = function() {
    $(".plus4u5-app-menu-link").each(function(item) {
      let menuText = $(this).text().replace(/\u200B/g, "");
      if (menuText.includes("uuSubApp") || menuText.includes("uuProduct") || menuText.includes("uuScript")
          || menuText.includes("uuLib") || menuText.includes("uuAppServerLibrary")) {
        $(this).addClass("bookkit-ext-uusubapp");
      }
      if (menuText.includes("Business Mod")) {
        $(this).addClass("bookkit-ext-business");
      }
      if (menuText.includes("uuCMD") || menuText.includes("uuCmd") || menuText.includes("uuCommands")) {
        $(this).addClass("bookkit-ext-cmd");
      }
      if (menuText.includes("ObjectStore") || menuText.includes("BinaryStore") || menuText.includes("Database")) {
        $(this).addClass("bookkit-ext-store");
      }
    });
  };

  let addStateIntoMenu = function() {
    let mapState = {
      test: "T",
      underConstruction: "W",
      closed: "C"
    };
    $(".plus4u5-app-menu-link").each(function () {
      let link = $(this).find(".plus4u5-app-go-to-page-link");
      let pageCode = getPageCode(link.attr("href"));
      let state = (menuIndex[pageCode]) ? menuIndex[pageCode].state : "?";
      let stateChar = mapState[state];
      if (stateChar) {
        $(this).append($(`<div class="bookkit-ext-page-state uu-bookkit-badge bookkit-ext-page-state-${state}">${stateChar}</div>`));
      }
    });
  };

  let colorizeInvalidLinks = function() {
    let linkUrlPrefix = $(".plus4u5-app-go-to-page-link").first().attr("href") + "/page?code=";
    $(".uu5-bricks-section .uu5-bricks-link").each(function(item) {
      let linkUrl = $(this).attr("href");
      if (linkUrl && linkUrl.indexOf(linkUrlPrefix) > -1) {
        let pageCode = getPageCode(linkUrl);
        if (menuIndex[pageCode] === undefined) {
          $(this).addClass("bookkit-ext-invalid-link").attr("title", `Page with code ${pageCode} do not exists.`);
        }
      }
    });
  };

  let searchInit = function () {
    // not ready yet
    if (!currentBookStructure.itemMap || !currentBook.home) return;

    let lang = currentBook.primaryLanguage;
    let path = [];
    let lastLabel = null;

    // go through all pages from menu
    let key = currentBook.home;
    do {
      let state = currentBookStructure.itemMap[key].state;
      let labels = currentBookStructure.itemMap[key].label;
      let indent = currentBookStructure.itemMap[key].indent;
      let label = labels[lang];
      if (!label) {
        label = labels[Object.keys(labels)[0]];
      }

      if (indent > path.length) path.push(lastLabel);
      while (indent < path.length) path.pop();

      menuIndex[key] = {
        name: label,
        state: state,
        path: path.slice()
      };

      lastLabel = label;
      key = currentBookStructure.itemMap[key].next;
    } while(key);

    // also go through hidden pages
    Object.keys(currentBookStructure.itemMap).filter((key) => !menuIndex[key]).forEach(function(key) {
      let state = currentBookStructure.itemMap[key].state;
      let labels = currentBookStructure.itemMap[key].label;
      // because there is some strange page in MARI (sendPricesToEtpDa) that has invalid data
      if (labels && labels.length > 1) {
        let label = labels[lang];
        if (!label) {
          label = labels[Object.keys(labels)[0]];
        }
        menuIndex[key] = {
          name: label,
          state: state,
          path: ["Hidden"]
        };
      }
    });
  };

  // Source: https://www.w3schools.com/howto/howto_js_autocomplete.asp
  let initAutocomplete = function(input, options) {
    let current = -1;

    input.on("focus", function(e) {
      window.scrollTo(0, 0);
    });

    input.on("input", function(e) {
      current = -1;
      $("#autocomplete-list").remove();
      if (!this.value) return false;

      let listItems = $('<div id="autocomplete-list"></div>');
      input.after(listItems);

      let count = 0;
      let keys = Object.keys(options);

      // Select all names which include all words from the requested list
      this.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").forEach(item => {
        if (item) keys = keys.filter(key => options[key].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(item));
      });
      // Order by complete path
      keys = keys.sort((a, b) => options[a].path.join("#").localeCompare(options[b].path.join("#")));

      for (const pageCode of keys.slice(0, 15)) {
          let pageName = options[pageCode].name;
          let path = options[pageCode].path.join(" &raquo; ");
          let item = $('<div>' + pageName + '<span>' + path + '</span></div>');
          if (count === 0) {
            item = item.addClass("autocomplete-active");
            current = 0;
          }
          item.click(function() {
            $("#autocomplete-input").val("");
            gotoPage(pageCode);
            $("span.mdi-home").parent().focus();
            Array.prototype.slice.call(document.querySelectorAll("a.plus4u5-app-go-to-page-link")).filter(item => item.href.includes(pageCode))[0].scrollIntoView();
          });
          listItems.append(item);
          count++;
      }

    });
    input.keydown(function(e) {
      if (e.key === "ArrowDown") {
        current++;
        markActive();
      }
      if (e.key === "ArrowUp") {
        current--;
        markActive();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (current > -1) {
          $("#autocomplete-list div.autocomplete-active").click();
        } else {
          $("#autocomplete-list div").first().click();
        }

      }
    });

    function markActive() {
      let items = $("#autocomplete-list div");
      if (current >= items.length) current = 0;
      if (current < 0) current = (items.length - 1);
      items.removeClass("autocomplete-active");
      $("#autocomplete-list div:nth-child("+ (current + 1) +")").addClass("autocomplete-active");
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      $("#autocomplete-list").remove();
    });
  };

  // inject to CMD call
  let injectToHttpRequest = function () {
    let origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {

      if (url.includes("loadBook")) {
        this.addEventListener('load', function () {
          currentBook = JSON.parse(this.responseText);
          searchInit();
        });
      }
      if (url.includes("loadPage")) {
        this.addEventListener('load', function () {
          currentPageData = JSON.parse(this.responseText);
          initPage();
        });
      }
      if (url.includes("getBookStructure")) {
        this.addEventListener('load', function () {
          currentBookStructure = JSON.parse(this.responseText);
          searchInit();
        });
      }
      origOpen.apply(this, arguments);
    };

    const fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = (...args) =>
        (async args => {
          const response = await fetch(...args);
          if (response.url.includes("loadBook")) {
            currentBook = await response.clone().json();
            searchInit();
          }
          if (response.url.includes("loadPage")) {
            currentPageData = await response.clone().json();
            initPage();
          }
          if (response.url.includes("getBookStructure")) {
            currentBookStructure = await response.clone().json();
            searchInit();
          }
          return response;
        })(args);
  };

  // do inject
  injectToHttpRequest();

  // first action take after 3s
  setTimeout(firstInit, 3000);

  // click on element
  let click = function(element) {
    console.log(element);
    // mark link with #temp
    element.attr("id", "temp");
    // click on link
    document.getElementById("temp").click();
    // remove temp id
    element.attr("id", "");
  };

  // click on link in menu by its name
  let clickLinkByName = function (name) {
    // console.log('Click link by name = "' + name + '"')

    // click to "Obsah stránky" to expand menu
    $('button.uu5-bricks-dropdown-button').each(function () {
      let item = $(this);
      if (item.text() == "Obsah stránky" || item.text() == "Page body") item.click();
    });

    // find all links in control menu
    $('a.uu5-bricks-dropdown-item-link').each(function () {
      let item = $(this);
      // compare its text
      // console.log(item.text(), name);
      if (item.text() === name) {
        click(item);
      }
    });
  };

  let getPageCode = function (url) {
    return url.substring(url.lastIndexOf("?code=") + 6).replace(/#.*/, "");
  };

  let getCurrentPageCode = function() {
    let pageUrl = window.location.href;
    return getPageCode(pageUrl);
  };

  let reloadCurrentPage = function() {
    UU5.Environment.ccr.byKey["UuBookKit.Page"].reload()
  };

  let gotoPage = function(pageCode) {
    if (ctrlKey) {
      let url = $(".plus4u5-app-go-to-page-link").first().attr("href") + "/page?code=" + pageCode;
      window.open(url, '_blank');
    }
    else {
      UU5.Environment.ccr.byKey["UuBookKit.BookReady"].goToPage(pageCode);
    }
  };

  let getJiraLink = function(text, url) {
    return "[" + text + "|" + url + "]";
  };

  let getMdLink = function(text, url) {
    return "[" + text + "](book:" + getPageCode(url) + ")";
  };

  let getGTP = function(text, url) {
    return "<uu5string/><UuBookKit.Bricks.GoToPageLink page=\"" + getPageCode(url) + "\" />";
  };

  let handleClickToCopyOptions = function(e) {
    let link = $(this).parent().find(".plus4u5-app-go-to-page-link");
    let url = link.attr("href");
    let text = link.text();

    if ($(e.target).hasClass("cc")) {
      copyToClipBoard(getPageCode(url));
    }
    if ($(e.target).hasClass("cn")) {
      copyToClipBoard(text);
    }
    if ($(e.target).hasClass("cjl")) {
      copyToClipBoard(getJiraLink(text, url));
    }
    if ($(e.target).hasClass("cmdl")) {
      copyToClipBoard(getMdLink(text, url));
    }
    if ($(e.target).hasClass("cgtp")) {
      copyToClipBoard(getGTP(text, url));
    }
  };

  let showCopyOptionsInMenu = function () {
    copyMenuVisible = true;
    $(".plus4u5-app-menu-link").each(function () {
      let links = $('<div class="bookkit-ext-copy-links">'
            + '<span class="cc" title="Copy page code into clipboard">CC</span>'
            + '<span class="cn" title="Copy page name into clipboard">CN</span>'
            + '<span class="cjl" title="Copy link to current page into clipboard in JIRA format">CJL</span>'
            + '<span class="cmdl" title="Copy link to current page into clipboard in MD format">CMDL</span>'
            + '<span class="cgtp" title="Copy link to current page into clipboard in GoToLink UU5 tag format">CGTP</span>'
          + '</div>');
      links.click(handleClickToCopyOptions);
      $(this).append(links);
    });
  };

  let hideCopyOptionsInMenu = function () {
    copyMenuVisible = false;
    $(".plus4u5-app-menu-link .bookkit-ext-copy-links").remove();
  };

  // handle all clicks on webpage
  $(document).click(function (e) {
    // console.log($(e.target));

    // is it click to refresh button?
    if ($(e.target).hasClass("bookkit-ext-refresh")) {
      // init page
      initPage();
      return;
    }

    if ($(e.target).hasClass("bookkit-ext-toc")) {
      // init page
      let toc = localStorage.getItem(LS_TOC_KEY) == "true";
      localStorage.setItem(LS_TOC_KEY, !toc);

      if (!toc) addToc();
      else reloadCurrentPage();
      return;
    }

    // click to page title is linking to knowledge base
    if ($(e.target).parent().hasClass("uu-bookkit-book-top-text")) {
      window.open('https://docs.plus4u.net/libraries', '_blank');
    }

    // click to "copy JIRA link"
    if ($(e.target).hasClass("bookkit-ext-copy-jira-link")) {
      copyToClipBoard(getJiraLink($(e.target).data("page-name"), window.location.href));
    }

    if ($(e.target).hasClass("bookkit-ext-copy-md-link")) {
      copyToClipBoard(getMdLink($(e.target).data("page-name"), window.location.href));
    }

    // click to page title -> select it
    if ($(e.target).hasClass("bookkit-ext-page-title-span")) {
      window.getSelection().selectAllChildren($(e.target).get(0));
    }

    // click to section title -> select it
    if ($(e.target).hasClass("uu5-bricks-header")) {
      window.getSelection().selectAllChildren($(e.target).get(0));
    }


    // click to reload page
    if ($(e.target).hasClass("bookkit-ext-page-reload")) {
      reloadCurrentPage();
    }
  });

  $(document).keydown(function (e) {
    //console.log(e);

    switch (e.key) {
      case "e": // Start edit mode
      case "E":
        if (!isModalOpen() && !isInEditMode()) {
          startEditMode(e.shiftKey);
        }
        break;

      case "s": // With Ctrl - end edit mode and save data
      case "S":
        if (e.ctrlKey && isInEditMode()) {
          getUpdateButton().focus();
          getUpdateButton().click();
          e.preventDefault(); // Do not trigger the default browser save handler
        }
        break;

      case "q":
      case "Q":
        if (e.ctrlKey) {
          window.scrollTo(0, 0);
          $("#autocomplete-input").select();
        }
        break;

      case "Escape": // close edit dialog on ESC
        click($(".uu5-bricks-modal-l .uu5-bricks-modal-header-close"));
        break;

      case "F4":
        reloadCurrentPage();
        break;

      case "Control":
        ctrlKey = true;
        if (ctrlKeyTimeout) clearTimeout(ctrlKeyTimeout);
        ctrlKeyTimeout = setTimeout(() => $(document).trigger({type: 'keyup', key: 'Control'}), 1000);
        if (!copyMenuVisible) showCopyOptionsInMenu();
        break;

    }

    /* not working correctly
    // save edit dialog on CTRL + ENTER
    if (e.ctrlKey && e.keyCode === 13) {
      click($(".uu5-bricks-modal-l .color-schema-primary.uu5-bricks-button"));
    }
    */
  });

  $(document).keyup(function (e) {
    // console.log(e.key);
    switch (e.key) {
      case "Control":
        ctrlKey = false;
        if (ctrlKeyTimeout) clearTimeout(ctrlKeyTimeout);
        if (copyMenuVisible) hideCopyOptionsInMenu();
        break;
    }
  });

  // Copy scenarios

  const COMMENT_TYPE = "// ";
  const WORD_WRAP_CHARS = 150;

  var copyContent = "";

  var copyToClipBoard = (content) => {
    let textArea = document.createElement("textarea");
    textArea.innerHTML = content;
    document.body.appendChild(textArea);

    let range,
        selection;

    if (navigator.userAgent.match(/ipad|iphone/i)) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }

    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  var decodeSpecialChars = (input) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = input;
    return txt.value;
  };

  var walkOverList = (olElement, prefix) => {
    let stepNumber = 1;

    // walk over li elements
    olElement.childNodes.forEach(liElement => {
      let itemTextContent = liElement.innerHTML.replace(/(\<[ou]l(\s*.*)*\/[ou]l\>)/gm, "").replace(/(\<[^\>]+\>)/gm, "");
      let stepLine = prefix + stepNumber + " - " + decodeSpecialChars(itemTextContent).replace(/\s+/gm, " ").trim();

      // wrap after WORD_WRAP_CHARS chars
      while (stepLine.length > WORD_WRAP_CHARS) {
        for (let i = WORD_WRAP_CHARS ; i > 0 ; i--) {
          if (stepLine.substr(i, 1).match(/^\s+$/)) {
            copyContent += COMMENT_TYPE + stepLine.substr(0, i).replace(/^\s+|\s+$/g, "") + "\n";
            stepLine = stepLine.substr(i).replace(/^\s+|\s+$/gm, "");
            break;
          }
        }
      }

      copyContent += COMMENT_TYPE + stepLine.replace(/^\s+|\s+$/gm, "") + "\n";

      let innerOlElements = liElement.querySelectorAll("ol, ul");
      if (innerOlElements.length > 0) {
        innerOlElements.forEach((innerUlOlElement) =>  {
          walkOverList(innerUlOlElement, prefix + stepNumber + ".");
        });
      }
      stepNumber++
    });
  };

  var initCopyScenarios = () => {
    document.querySelectorAll(".uu5-bricks-section > .uu5-bricks-ol").forEach(olElement => {
      olElement.insertAdjacentHTML('beforebegin', `<div class="bookkit-ext-copy-scenario-panel uu5-common-div uu-uuapp-designkit-embedded-text-header-bar">
            <button class="bookkit-ext-copy-scenario-button uu5-bricks-button uu5-bricks-button-m uu5-bricks-button-transparent" type="button">
                <span class="uu5-bricks-icon mdi mdi-content-copy"></span>
                <span class="bookkit-ext-copy uu5-bricks-span uu5-bricks-lsi-item">Kopírovat programový komentář</span>
            </button>
        </div>`);

      olElement.previousElementSibling.querySelectorAll(".bookkit-ext-copy-scenario-button")[0].addEventListener("click", () => {
        copyContent = "";
        let commentPrefix = "";
        let heading = olElement.parentElement.querySelectorAll("h1, h2, h3, h4, h5, h6")[0].textContent;
        if (heading.toLowerCase() === "happy day scenario") {
          commentPrefix = "HDS ";
        } else {
          let prefixToken = heading.split(/\s*\-/)[0];
          if (prefixToken) {
            copyContent = COMMENT_TYPE + heading.replace(/^\s+|\s+$/gm, "") + "\n";
            commentPrefix = prefixToken + " ";
          }
        }

        walkOverList(olElement, commentPrefix);
        copyToClipBoard(copyContent);
      });
    });
  };

  // Resizable Left Navigation
  const RES_LEFT_NAV_KEY = "BOOKIT_EXT_RES_LEFT_NAV_"+ location.hostname;
  var initResizableLeftNavigation = () => {
    let leftWidth = localStorage.getItem(RES_LEFT_NAV_KEY);

    let leftNavigationElementFixed = $(".plus4u5-app-page-left-wrapper.uu5-bricks-page-left.uu5-bricks-page-column-fixed");
    let leftNavigationElementGhost = $(".plus4u5-app-page-left-wrapper.uu5-bricks-page-left.uu5-bricks-page-column-ghost");

    if(leftWidth) {
      leftNavigationElementFixed.width(leftWidth);
      leftNavigationElementGhost.width(leftWidth);
      leftNavigationElementGhost.css("max-width", leftWidth + "px");
    }

    if (!leftNavigationElementFixed.data("initialized")) {
      leftNavigationElementFixed.data("initialized", true);
      leftNavigationElementFixed.resizable({
        option: {"handles": "e"},
        resize: ( event, ui ) => { localStorage.setItem(RES_LEFT_NAV_KEY, ui.size.width); },
        containment: 'document'
      });
    }
  };

  /**
   * Adds link texts of the left navigation panel items to their title attributes so it is shown on mouse over.
   */
  const addNavigationTitles = () => {
    const navLinks = document.querySelectorAll('a.plus4u5-app-go-to-page-link');
    navLinks.forEach(a => a.title = a.innerText);
  }

})();
