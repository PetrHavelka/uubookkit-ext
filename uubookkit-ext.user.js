// ==UserScript==
// @name         uuBookKit-ext
// @namespace    https://github.com/PetrHavelka/uubookkit-ext
// @version      0.6.4
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
.bookkit-ext-refresh {
  margin-left: 0.5em;
  font-size: 24px;
  cursor: pointer;
}
.bookkit-ext-refresh {
  font-size: 22px;
}
.uu-bookkit-book-top-text {
  cursor: pointer;
}
.bookkit-ext-md {
  color: black;
  text-decoration: none;
  font-size: 19px;
  margin-left: 0.5em;
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
`);

(function () {
  'use strict';

  console.log("uuBookKit-ext starting...");

  let currentPageData = {};

  // init of each bookkit page
  let initPage = function () {
    let page = $(".uu-bookkit-page-ready");
    // if page not ready do it later
    if (!page.length) {
      setTimeout(initPage, 1000);
    }
    // page is already done - remove all links
    if (page.hasClass("bookkit-ext-page-done")) {
      $(".bookkit-ext-edit").remove();
      $(".bookkit-ext-md").remove();
      $(".bookkit-ext-copy-scenario-panel").remove();
    }

    // update HTML - add icons and links
    let editIcon = 'uu5-bricks-icon mdi mdi-lead-pencil';

    let pageTitle = $(".uu-bookkit-page h1 .uu-bookkit-page-ready-header");
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

    // add copy scenarios
    initCopyScenarios();

    // add resizable left navigation
    initResizableLeftNavigation()

    // mark page as ready
    page.addClass("bookkit-ext-page-done");
  };

  // first init of whole webpage
  let firstInit = function () {
    let title = $(".uu-bookkit-book-top-text");
    // if page not loaded yet - do it later
    if (!title.length) {
      setTimeout(firstInit, 3000);
    }

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
      if (menuText.includes("Store")) {
        $(this).addClass("bookkit-ext-store");
      }
    });


    // init bookkit page
    initPage();
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
      var lang = $(".uu5-bricks-page-system-layer .uu5-bricks-language-selector-code-text").text();
      // console.log(lang);

      // click to particular link in control menu
      clickLinkByName($(e.target).data("link-" + lang));
      return;
    }

    // click to page title is linking to knowledge base
    if ($(e.target).parent().hasClass("uu-bookkit-book-top-text")) {
      window.open('https://docs.plus4u.net/book', '_blank');
    }
  });

  $(document).keyup(function (e) {
    // close edit dialog on ESC
    if (e.keyCode === 27) {
      click($(".uu5-bricks-modal-l .uu5-bricks-modal-header-close"));
    }

    /* not working correctly
    // save edit dialog on CTRL + ENTER
    if (e.ctrlKey && e.keyCode === 13) {
      click($(".uu5-bricks-modal-l .color-schema-primary.uu5-bricks-button"));
    }
    */
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
  }

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