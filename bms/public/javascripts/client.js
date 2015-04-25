var inputNumber = '';
$(document).ready(function() {
	 $('#user-input').keydown(function(e) {
		 inputNumber = $('#user-input').val();
		if(e.keyCode == 13){ //Enter pressed
			console.log();
			if(isNumeric(inputNumber)==1) {
				go(inputNumber);
			}
			else 
				alert("Please enter only numeric not alphabets");
		}
	});
	$('.go-user').on('click', function(e) {
		if(isNumeric(inputNumber)) {
				go(inputNumber);
			}
			else 
				alert("Please enter only numeric not alphabets");
	});
	$('.go-again').on('click', function(e){
		$('.user-form').show();
		$('.output-box').hide();
	});
});

var numberArray;

function go() {
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
			$('.output-box').show();
			$('.message-area').html("<p>"+numberArray+"</p>");
			$('.go-again').show();
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
		console.log("Number is already present");
	else{
		fromStored.length = fromStored.length+1;
		fromStored[fromStored.length-1]= number;
	}
}

/* Function to ensure that user had entered only numeric characters */	
function isNumeric(input) {
	var letters = /[A-Za-z]+$/;
	if(letters.test(input))
		return 0;
	else
		return 1;
}	
