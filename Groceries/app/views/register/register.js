var dialogs = require("ui/dialogs");
var frameModule = require("ui/frame");

var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

exports.load = function(args) {
	var page = args.object;
	page.bindingContext = user;
};

function completeRegistration() {
	user.register()
		.then(function() {
			dialogs
				.alert("Your account was successfully created.")
				.then(function() {
					frameModule.topmost().navigate("./views/login/login");
				});
		}).catch(function() {
			dialogs.alert({
				message: "Unfortunately we were unable to create your account.",
				okButtonText: "OK"
			});
		});
}

exports.register = function() {
	if (user.isValidEmail()) {
		completeRegistration();
	} else {
		dialogs.alert({
			message: "Please include a valid email address.",
			okButtonText: "OK"
		});
	}
};
