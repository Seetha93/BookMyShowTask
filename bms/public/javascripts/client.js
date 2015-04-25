$(document).ready(function() {
	 $('#user-input').keydown(function(e) {
		if(e.keyCode == 13){ //Enter pressed
		go();
		}
	});
	$('.go-user').on('click', function(e) {
		go();
	});
});

var inputNumber = '';
var numberArray;
function go() {
	inputNumber = $('#user-input').val();
	
	/*Ajax call is made to get the array */
	
	$.ajax({
		type: "GET",
		url: "/getArray",
		dataType:'json',
		success:function(response)
		{
			numberArray = new Array(response.numbers.length);
			console.log(response.numbers.length);
			
			for(var i = 0; i < response.numbers.length; i++) {
				numberArray[i] = response.numbers[i];
			}
				
			console.log("Input is "+inputNumber);
			if(inputNumber.indexOf('-') >  -1) {
				console.log("range of numbers");
				var range = inputNumber.split("-");
				for(var i=range[0]; i < range[1]; i++)
				{
					checkAndAdd(i,numberArray);  //Checking whether the number is already exist
				}
			}
			else if(inputNumber.indexOf(',') > -1) {
				console.log("Set of numbers");
				var numbers = inputNumber.split(",");
				
				for(number of numbers) {
					checkAndAdd(number,numberArray);
				}
			}
			else {
				console.log("Single number");
				checkAndAdd(inputNumber,numberArray); 
			}
			$('.user-form').hide();
			$('.chat-box').show();
			$('.message-area').html("<p>"+numberArray+"</p>");
			for(var i=0;i < numberArray.length; i++) {
				console.log("From data base : "+numberArray[i]);
			}
			
			saveInRedis(numberArray); //Saving in redis
		}
	});
      
  };
 
 /*Ajax call is made to post the final array in redis */
 
function saveInRedis(numberArray) {
	$.ajax({
		type: "POST",
		url: "/save",
		data: JSON.stringify({"numbers":numberArray}),
		contentType: "application/json",
		success: function(response)
		{
			alert(response);
		}
	
	})
}

/* Function to skip the duplicates */
function checkAndAdd(number,fromStored) {
	if($.inArray(number, fromStored) > -1)
		alert("Number is already present");
	else{
		fromStored.length = fromStored.length+1;
		fromStored[fromStored.length-1]= number;
	}
}
	
	
