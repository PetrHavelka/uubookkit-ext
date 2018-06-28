// ==UserScript==
// @name         uuBookKit-ext
// @namespace    https://github.com/PetrHavelka/uubookkit-ext
// @version      0.5.1
// @description  Add usefull links to page
// @author       Petr Havelka
// @match        https://uuos9.plus4u.net/uu-dockitg01-main/*
// @match        https://uuos9.plus4u.net/uu-bookkitg01-main/*
// @match        https://docs.plus4u.net/book*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-2.1.4.min.js
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

.uu5-bricks-page-column:hover {
  overflow-x: visible;
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
    }

    // update HTML - add icons and links
    let editIcon = 'uu5-bricks-icon mdi mdi-lead-pencil';

    let pageTitle = $(".uu-bookkit-page h1 .uu-bookkit-page-ready-header");
    // if i have rights for edit
    if ($(".uu-bookkit-control-bar-executives").length) {
      pageTitle.append('<span class="bookkit-ext-edit ' + editIcon + '" data-link="Upravit strukturu obsahu"></span>');

      $(".uu-bookkit-page h2.uu5-bricks-header, .uu-bookkit-page h3.uu5-bricks-header").each(function (i) {
        // find correct index
        let title = $(this).text();
        if (currentPageData && currentPageData.body) {
          for (let a = 0; a < currentPageData.body.length; a++) {
            if (currentPageData.body[a].includes('header="' + title + '"')) {
              i = a;
              break;
            }
          }
        }
        $(this).append('<span class="bookkit-ext-edit ' + editIcon
            + '" data-link="Upravit obsah - sekce ' + i
            + '" title="Upravit obsah - sekce ' + i + '"></span>');
      });
    }

    // add MD link
    pageTitle.append('<a href="' + mdUrl + '?page=' + encodeURIComponent(window.location.href) + '" target="_blank" class="bookkit-ext-md">MD</span></a>');

    // mark page as ready
    page.addClass("bookkit-ext-page-done");
  };

  // first init of whole webpage
  let firstInit = function () {
    let title = $(".uu-bookkit-book-top-text");
    // if page not loaded yer - do it later
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
      if (menuText.includes("uuCMD")) {
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

    // find all linsk in controll menu
    $('a.uu5-bricks-dropdown-item-link').each(function () {
      let item = $(this);
      // compare its text
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
      // click to particular link in control menu
      clickLinkByName($(e.target).data("link"));
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

})();