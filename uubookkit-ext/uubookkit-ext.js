// init of each bookkit page
let initPage = function() {
	// no rights
	if (!$(".uu-bookkit-control-bar-executives").length) return;
	
	let page = $(".uu-bookkit-page");
	// if page not ready do it later
	if (!page.length) {
		setTimeout(initPage, 1000);
	}
	// page is already done
	if (page.hasClass("bookkit-ext-page-done")) return; 

	// update HTML - add icons and links
	let editIcon = 'uu5-bricks-icon mdi mdi-lead-pencil';
	$(".uu-bookkit-page h1 .uu-bookkit-page-ready-header").append('<span class="bookkit-ext-edit ' + editIcon + '" data-link="Upravit strukturu obsahu"></span>')
	$(".uu-bookkit-page h2.uu5-bricks-header").each(function (i) {
		$(this).append('<span class="bookkit-ext-edit ' + editIcon + '" data-link="Upravit obsah - sekce ' + i + '"></span>');
	});
	
	// mark page as ready
	page.addClass("bookkit-ext-page-done");
}

// first init of whole webpage
let firstInit = function() {
	let title = $(".uu-bookkit-book-top-text");
	// if page not loaded yer - do it later
	if (!title.length) {
		setTimeout(firstInit, 3000);
	}
	
	// update HTML - add icons and links
	let refreshIcon = '<span class="uu5-bricks-icon plus4u5 plus4u5-refresh bookkit-ext-refresh"></span>'
	title.wrapInner('<a href="https://docs.plus4u.net/book"></a>');
	title.append(refreshIcon);
	
	// init bookkit page
	initPage();
}

// first action take after 3s
setTimeout(firstInit, 3000);

// click on link by its name
let clickLinkByName = function (name) {
	// console.log('Click link by name = "' + name + '"')
	
	// find all linsk in controll menu
	$('a.uu5-bricks-dropdown-item-link').each(function() {
		let item = $(this);
		// compare its text
		if (item.text() == name) {
			// mark link with #temp
			item.attr("id", "temp");
			// click on link
			document.getElementById("temp").click();
			// remove temp id
			item.attr("id", "");
		}
	});
}

// handle all clicks on webpage
$(document).click(function(e) {
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
	
	// any other click is probably loading next page - so init it after 1s
	setTimeout(initPage, 1000);
});