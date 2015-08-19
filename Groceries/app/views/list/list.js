var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");
var viewModule = require("ui/core/view");

var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");

var page;
var groceryList = new GroceryListViewModel([]);
var pageData = new observableModule.Observable({
	grocery: "",
	groceryList: groceryList
});

exports.navigatedTo = function(args) {
	page = args.object;
	if (page.ios) {
		var listView = viewModule.getViewById(page, "groceryList");
		swipeDelete.enable(listView, function(index) {
			groceryList.delete(index);
		});
	}
	page.bindingContext = pageData;
	groceryList.empty();
	groceryList.load();
};

exports.add = function() {
	// Check for empty submission
	if (pageData.get("grocery").trim() !== "") {
		viewModule.getViewById(page, "grocery").dismissSoftInput();
		groceryList.add(pageData.get("grocery"))
			.catch(function() {
				dialogsModule.alert({
					message: "An error occurred adding to your list.",
					okButtonText: "OK"
				});
			});

		// Clear the textfield
		pageData.set("grocery", "");
	} else {
		dialogsModule.alert({
			message: "Please enter a grocery item",
			okButtonText: "OK"
		});
	}
};

exports.share = function() {
	var list = [];
	for (var i = 0, size = groceryList.length; i < size ; i++) {
		list.push(groceryList.getItem(i).name);
	}
	var listString = list.join(", ").trim();
	socialShare.shareText(listString);
};

exports.delete = function(args) {
	var item = args.view.bindingContext;
	var index = groceryList.indexOf(item);
	groceryList.delete(index);
};
