
$( document ).ready(function(){
	var chosenFilter = document.querySelectorAll(".rows");
	var maxId = 1;
	var currentIdFOfChange;
	var information;
	loadDataFromServer();

	addAllButtonEventListener();
	addCancelButtonEventListener();
	addAddButtonEventListener();
	addFilterButtonEventListener();

	function fillIn(obj){
		$("#firstName").val(obj.firstName);
		$("#lastName").val(obj.lastName);
		$("#phone").val(obj.phone);
		$("#office").val(obj.office);
		$("#address").val(obj.address);
		var dateOfR = obj.dateOfRecruitment.split(/-|T/);
		$("#dateOfRecruitment").val(dateOfR[0] + "-" + dateOfR[1] + "-" + dateOfR[2]);
		var dateOfD = obj.dateOfDeparture.split(/-|T/);
		$("#dateOfDeparture").val(dateOfD[0] + "-" + dateOfD[1] + "-" + dateOfD[2]);
		var dateOfB = obj.birthDate.split(/-|T/);
		$("#birthDate").val(dateOfB[0] + "-" + dateOfB[1] + "-" + dateOfB[2]);
		$("#hourlyRate").val(obj.hourlyRate);
		$("#firstNameNat").val(obj.firstNameNative);
		$("#lastNameNat").val(obj.lastNameNative);
		$("#mobPhone").val(obj.mobilePhone);
		$("#email").val(obj.email);
		$("#workingHours").val(obj.workingHoursPerDay);
		var endOfP = obj.endOfProbation.split(/-|T/);
		$("#endOfProbation").val(endOfP[0] + "-" + endOfP[1] + "-" + endOfP[2]);
		if (obj.active == true){
			$("#active").prop('checked', true);
		}
		else{
			$("#active").prop('checked', false);
		}
		$("#teamled").val(obj.teamled);
		$("#visibleFor").val(obj.visibleForGroups);
		$("#addButtonText").text(" Update");
	}

	function validateInput(){
		var toFill = [];
		var valid = true;
		$.each($(".required"), function(index){
			if ($(".required")[index].value == ''){
				valid = false;
				toFill.push($(".required").eq(index).attr("name"));
			}
		})

		if (!valid){
			var message = "You have to fill in the following fields: " + toFill[0];

			for (var i = 1; i < toFill.length; i++) {
				message += ", " + toFill[i]; 
			}
			alert(message);
		}
		
		return valid;
	}

	function displayData(arr){
		for (var i = 0; i < arr.length; i++) {
			$("tbody").append('<tr  dbidx='+arr[i].id+'><th scope="row" class="rows">' + (i + 1) +'<td class="officeOfEmployee">' + arr[i].office + '</td><td>' + arr[i].firstName + '</td><td>' + arr[i].firstNameNative + '</td><td>' + arr[i].lastName + '</td><td>' + arr[i].lastNameNative + '</td></th></tr>');
		};
	}

	function loadDataFromServer(){
		$("tbody").empty();
		$.getJSON("https://localhost:5001/api/values", function(data){
			information = data;
			displayData(information);
			addTableEventListener(information);
		});
	}

	function loadFilteredDataFromServer(){
		$("tbody").empty();
		var checked;
		if($("#activeFilter").is(":checked")){
			checked = 1;
		}
		else{
			checked = 0;
		}

		var url = 'https://localhost:5001/api/values?officeFilter=' + $("#officeSelect").val() + '&activeFilter=' + checked;
		$.getJSON(url, function(data){
			information = data;
			displayData(information);
			addTableEventListener(information);
		})
	}

	function addTableEventListener(arr){
	$("tr").on("click", function(){
		for (var i = 0; i < arr.length; i++) 
			if ($(this).attr("dbidx") == arr[i].id) {
				fillIn(arr[i]);
				currentIdFOfChange = $(this).attr("dbidx");
				addDeleteButtonEventListener();
			}
		})
	}

	function addAddButtonEventListener(){
		$("#add").on("click", function(){
			var valid = validateInput();
			if (valid){
				var newEmployee = {
					firstName: $("#firstName").val(),
					lastName: $("#lastName").val(),
					phone: $("#phone").val(),
					office: $("#office").val(),
					address: $("#address").val(),
					hourlyRate: $("#hourlyRate").val(),
					firstNameNative: $("#firstNameNat").val(),
					lastNameNative: $("#lastNameNat").val(),
					mobilePhone: $("#mobPhone").val(),
					email: $("#email").val(),
					workingHoursPerDay: $("#workingHours").val(),
					teamled: $("#teamled").val(),
					visibleForGroups: $("#visibleFor").val(),
					dateOfDeparture: $("#dateOfDeparture").val(),
					dateOfRecruitment: $("#dateOfRecruitment").val(),
					birthDate: $("#birthDate").val(),
					endOfProbation: $("#endOfProbation").val()
				}
				if ($('input[type=checkbox]').prop('checked')){
					newEmployee.active = 1;
				}
				else{
					newEmployee.active = 0;
				}

				if ($("#addButtonText").text() == " Add"){
					var newEmployeeString = JSON.stringify(newEmployee);
					$.ajax({
						type: 'POST',
						url: 'https://localhost:5001/api/values',
						data: JSON.stringify(newEmployee), // or JSON.stringify ({name: 'jonas'}),
						// error: function(data) { console.log('information: ' + data); },
					 	 	contentType: "application/json",
						dataType: 'json',
						complete: function(){
							loadDataFromServer();
							cleanInputFieldsAndFilters();
						}
					});
				}
				else if ($("#addButtonText").text() == " Update"){
					newEmployee.id = currentIdFOfChange;
					var putUrl = 'https://localhost:5001/api/values/'+ currentIdFOfChange;
					var newEmployeeString = JSON.stringify(newEmployee);
					$.ajax({
						type: 'PUT',
						url: putUrl,
						data: JSON.stringify(newEmployee), // or JSON.stringify ({name: 'jonas'}),
						// error: function(data) { console.log('data: ' + data); },
					 	contentType: "application/json",
						dataType: 'json',
						complete: function(){
							loadDataFromServer();
							cleanInputFieldsAndFilters();
						}
					});
				}
			}
		})
	}

	function cleanInputFieldsAndFilters(){
		$("input").val('');
		$("textarea").val('');
		$("select").val('');
		currentIdFOfChange = undefined;
		$("#addButtonText").text(" Add");
		$("#officeSelect").val("");
		$("#activeFilter").prop('checked', true);
		$("#delete").attr("disabled", true);
	}

	function addAllButtonEventListener(){
		$("#all").on("click", function(){
			$("tbody").empty();
			loadDataFromServer();
			$("#addButtonText").text(" Update");
			$("#officeSelect").val("");
			$("#activeFilter").prop('checked', true);
		})
	}

	function addCancelButtonEventListener(){
		$("#cancel").on("click", function(){
			cleanInputFieldsAndFilters();
		})
	}

	function addFilterButtonEventListener(){
		$("#filterButton").on("click", function(){
			var selector = $("#officeSelect").val();
			$("tbody").empty();

			loadFilteredDataFromServer();
			addTableEventListener(information);
		})
	}

	function addDeleteButtonEventListener(){
		$("#delete").attr("disabled", false);
		$("#delete").on("click", function(){
			var urlToDelete = 'https://localhost:5001/api/values/'+ currentIdFOfChange;
			$.ajax({
				type: 'DELETE',
				url: urlToDelete,
				complete: function(){
					loadDataFromServer();
					cleanInputFieldsAndFilters();
				}
			})
		})
	}
})