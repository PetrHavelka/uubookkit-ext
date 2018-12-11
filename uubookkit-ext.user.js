// ==UserScript==
// @name         uuBookKit-ext
// @namespace    https://github.com/PetrHavelka/uubookkit-ext
// @version      0.9.0
// @description  Add usefull links to page
// @author       Petr Havelka, Josef Jetmar
// @match        https://uuos9.plus4u.net/uu-dockitg01-main/*
// @match        https://uuos9.plus4u.net/uu-bookkitg01-main/*
// @match        https://docs.plus4u.net/book*
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
.bookkit-ext-page-reload {
  margin-left: 0.5em;
  font-size: 24px;
  cursor: pointer;
}
.bookkit-ext-refresh {
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
  min-width: 400px;
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
  padding-right:.75em
}
.uu5-bricks-section > ol > li:before {
  display:run-in;
}
ol.uu5-bricks-ol ul.uu5-bricks-ul {
  padding-left: 3em;
}
.bookkit-ext-copy-links {
  position: absolute;
  right: 0.5em;
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
}
`);

(function () {
  'use strict';

  console.log("uuBookKit-ext starting...");

  let currentPageData = {};
  let currentBookStructure = {};
  let menuIndex = {};
  let ctrlKey = false;
  let copyMenuVisible = false;

  // init of each bookkit page
  let initPage = function () {
    let page = $(".uu-bookkit-page-ready");
    // if page not ready do it later
    if (!page.length) {
      setTimeout(initPage, 1000);
      return;
    }

    // page is already done - remove all links
    if (page.hasClass("bookkit-ext-page-done")) {
      $(".bookkit-ext-edit").remove();
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

    // if i have rights for edit
    if ($(".uu-bookkit-control-bar-executives").length) {
      pageTitle.append('<span class="bookkit-ext-edit ' + editIcon + '" data-link-cs="Upravit strukturu obsahu" data-link-en="Update Content Structure"></span>');

      $(".uu-bookkit-page h2.uu5-bricks-header, .uu-bookkit-page h3.uu5-bricks-header").each(function (i) {
        // find correct index
        let title = $(this).text();
        if (currentPageData && currentPageData.body) {
          for (let a = 0; a < currentPageData.body.length; a++) {
            if (currentPageData.body[a].content.includes('header="' + title + '"')) {
              i = a;
              break;
            }
          }
        }
        $(this).append('<span class="bookkit-ext-edit ' + editIcon
            + '" data-link-cs="Upravit obsah - sekce ' + i
            + '" data-link-en="Update Content - Section ' + i
            + '" title="Upravit obsah - sekce ' + i + '"></span>');
      });
    }

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

    // add resizable left navigation
    initResizableLeftNavigation();

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

    let autocompleteInput = $('<div id="autocomplete"><input type="text" id="autocomplete-input" name="autocomplete" placeholder="Search for page (Alt + n)" autocomplete="off" accesskey="n" /></div>');
    title.after(autocompleteInput);

    // update HTML - add icons and links
    let refreshIcon = '<span class="uu5-bricks-icon mdi mdi-reload bookkit-ext-refresh"></span>';
    title.after(refreshIcon);

    $(".plus4u5-app-menu-link").each(function(item) {
      let menuText = $(this).text();
      if (menuText.includes("uuSubApp")) {
        $(this).addClass("bookkit-ext-uusubapp");
      }
      if (menuText.includes("Business Mod")) {
        $(this).addClass("bookkit-ext-business");
      }
      if (menuText.includes("uuCMD") || menuText.includes("uuCmd")) {
        $(this).addClass("bookkit-ext-cmd");
      }
      if (menuText.includes("ObjectStore") || menuText.includes("BinaryStore") || menuText.includes("Database")) {
        $(this).addClass("bookkit-ext-store");
      }
    });

    // init bookkit page
    initPage();
  };

  let searchInit = function () {
    let lang = $(".uu-bookkit-book-top .uu5-bricks-language-selector-code-text").text();
    Object.keys(currentBookStructure.itemMap).forEach(function(key) {
      let labels = currentBookStructure.itemMap[key].label;
      let label = labels[lang];
      if (!label) {
        label = labels[Object.keys(labels)[0]];
      }
      menuIndex[key] = label;
    });
    console.log(menuIndex);
  };

  // Source: https://www.w3schools.com/howto/howto_js_autocomplete.asp
  let initAutocomplete = function(input, options) {
    let current = -1;

    input.on("input", function(e) {
      current = -1;
      $("#autocomplete-list").remove();
      if (!this.value) return false;

      let listItems = $('<div id="autocomplete-list"></div>');
      input.after(listItems);

      let count = 0;
      let keys = Object.keys(options);
      for (let i = 0; i < keys.length && count < 20; i++) {
        let pageCode = keys[i];
        let pageName = options[pageCode];
        if (pageName.toLowerCase().includes(this.value.toLowerCase())) {
          let item = $('<div>' + pageName + '</div>');
          if (count === 0) {
            item = item.addClass("autocomplete-active");
            current = 0;
          }
          item.click(function() {
            $("#autocomplete-input").val("");
            gotoPage(pageCode);
          });
          listItems.append(item);
          count++;
        }
      }

    });
    input.keydown(function(e) {
      // console.log(e.key);
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

      if (url.includes("loadPage")) {
        this.addEventListener('load', function () {
          currentPageData = JSON.parse(this.responseText);
          initPage();
        });
      }
      if (url.includes("getBookStructure")) {
        this.addEventListener('load', function () {
          currentBookStructure = JSON.parse(this.responseText);
          console.log(currentBookStructure);
          searchInit();
        });
      }
      origOpen.apply(this, arguments);
    };
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

    // find all linsk in controll menu
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
    return url.substring(url.lastIndexOf("?code=") + 6);
  };

  let getCurrentPageCode = function() {
    let pageUrl = window.location.href;
    return getPageCode(pageUrl);
  };

  let reloadCurrentPage = function() {
    UU5.Environment.ccr.byKey["UuBookKit.Page"].reload()
  };

  let gotoPage = function(pageCode) {
    console.log("Goto code ", pageCode);
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

  let handleClickToCopyOptions = function(e) {
    let link = $(this).parent().find(".plus4u5-app-go-to-page-link");
    let url = document.location.origin + link.attr("href");
    let text = link.text();

    if ($(e.target).hasClass("cn")) {
      copyToClipBoard(text);
    }
    if ($(e.target).hasClass("cjl")) {
      copyToClipBoard(getJiraLink(text, url));
    }
    if ($(e.target).hasClass("cmdl")) {
      copyToClipBoard(getMdLink(text, url));
    }
  };

  let showCopyOptionsInMenu = function () {
    copyMenuVisible = true;
    $(".plus4u5-app-menu-link").each(function () {
      let links = $('<div class="bookkit-ext-copy-links">'
            + '<span class="cn" title="Copy page name into clipboard">CN</span>'
            + '<span class="cjl" title="Copy link to current page into clipboard in JIRA format">CJL</span>'
            + '<span class="cmdl" title="Copy link to current page into clipboard in MD format">CMDL</span>'
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

    // is it click to edit button?
    if ($(e.target).hasClass("bookkit-ext-edit")) {
      // detect language
      var lang = $(".uu-bookkit-book-top .uu5-bricks-language-selector-code-text").text();
      // console.log(lang);

      // click to particular link in control menu
      clickLinkByName($(e.target).data("link-" + lang));
      return;
    }

    // click to page title is linking to knowledge base
    if ($(e.target).parent().hasClass("uu-bookkit-book-top-text")) {
      window.open('https://docs.plus4u.net/book/page?code=books', '_blank');
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
      window.getSelection().selectAllChildren($(".bookkit-ext-page-title-span").get(0));
    }

    // click to reload page
    if ($(e.target).hasClass("bookkit-ext-page-reload")) {
      reloadCurrentPage();
    }
  });

  $(document).keydown(function (e) {
    // console.log(e.key);

    // close edit dialog on ESC
    if (e.key === "Escape") {
      click($(".uu5-bricks-modal-l .uu5-bricks-modal-header-close"));
    }

    if (e.key === "F4") {
      reloadCurrentPage();
    }

    // if (e.key === "n" && e.altKey === true) {
    //   window.scrollTo(0, 0);
    //   $("#autocomplete-input").select();
    // }

    if (e.key === "Control") {
      ctrlKey = true;
      if (!copyMenuVisible) showCopyOptionsInMenu();
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

    if (e.key === "Control") {
      ctrlKey = false;
      if (copyMenuVisible) hideCopyOptionsInMenu();
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
    let leftNavigationElement = $(".plus4u5-app-page-left-wrapper.uu5-bricks-page-left");
    let leftWidth = localStorage.getItem(RES_LEFT_NAV_KEY);

    if(leftWidth) {
      leftNavigationElement.width(leftWidth);
    }

    if (!leftNavigationElement.data("initialized")) {
      leftNavigationElement.data("initialized", true);
      leftNavigationElement.resizable({
        option: {"handles": "e"},
        resize: ( event, ui ) => { localStorage.setItem(RES_LEFT_NAV_KEY, ui.size.width); },
        containment: 'document'
      });
    }
  };

})();