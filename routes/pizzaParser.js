var parser = {};

parser.objectsToList = function(data) {
	var output = [];
	var keyList = Object.keys(data);

	for(var index = 0; index < keyList.length; index++) {
		output.push(data[keyList[index]]);
	}

	return output;
}

parser.removeSuperKeys = function(data) {
	var output = {};
	var keyList = Object.keys(data);

	for(var index = 0; index < keyList.length; index++) {
		var subKeyList = Object.keys(data[keyList[index]]);
		for(var sIndex = 0; sIndex < subKeyList.length; sIndex++) {
			output[subKeyList[sIndex]] = data[keyList[index]][subKeyList[sIndex]];
		} 
	}

	return output;
}

parser.parseAvailableToppings = function(toppings) {
	var output = [];
	var toppingInfo = toppings.split(',');

	for(var index = 0; index < toppingInfo.length; index++) {
		var topping = {};
		var toppingItems = toppingInfo[index].split('=');

		topping.name = toppingItems[0];

		if(toppingItems.length > 1) {
			var quantities = toppingItems[1].split(':');
			topping.quantities = quantities;
		} else {
			topping.quantities = [1];
		}

		if(topping.name != '') {
			output.push(topping);
		}
	}

	return output;
};

parser.parseDefaultToppings = function(defaults) {
	var defaultToppingInfo = defaults.split(',');
	var defaultToppings = []

	for(var index = 0; index < defaultToppingInfo.length; index++) {
		var toppingName = defaultToppingInfo[index].split('=')[0];
		defaultToppings.push(toppingName);
	}

	return defaultToppings;
}

parser.parseProducts = function(data) {
	var output = {};
	var finalOutput = {};

	for(var index = 0; index < data.length; index++) {
		var productType = data[index].ProductType;

		var availableToppings = data[index].AvailableToppings;
		var defaultToppings = data[index].DefaultToppings;

		data[index].AvailableToppings = this.parseAvailableToppings(availableToppings);
		data[index].DefaultToppings = this.parseDefaultToppings(defaultToppings);

		if(productType in output) {
			output[productType].push(data[index]);
		} else {
			output[productType] = [];
			output[productType].push(data[index]);
		}
	}

	finalOutput.keys = Object.keys(output);
	finalOutput.productInfo = output;

	return finalOutput;
}


module.exports = parser;