/*
	Important to make sure these keys don't get pushed to Github! There
	are web crawlers out there which look for files like this and abuse
	the access privileges your key/secret pairs grant. You should probably
	remove this file from your github repo & go change the key/secret for
	this app. In the future -- store these as environment variables (for
	local development, you can use something like the npm package dotenv,
	or you can have a file like this which is gitignored)
 */

var ids = {
	// clientId: "ca_82cgoRl8OnBLBwBWinkKSHNK09sqbCFB"
	consumerKey: "wkWivWf42J5X8TApg40B7IizaHwEKXwcqu03tDfR",
	consumerSecret: "5O4P051emsjVnjVkC7axUTSieaL2s2lFRh4jaznC",
	requestTokenURL: "https://secure.splitwise.com/api/v3.0/get_request_token",
	accessTokenURL: "https://secure.splitwise.com/api/v3.0/get_access_token",
	authorizeURL: "https://secure.splitwise.com/authorize"
};

module.exports = ids;
