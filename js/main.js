//variables
var activityPrice = 0;
var emailCheck = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
var cardCheck;
var zipCheck;
var cvvCheck;

//*************//
//Title Section//
//*************//

//hides the 'other-title' text field on load
$('#other-title').hide();

//focus on first text field
$('#name').focus();

//hide and show 'other-title' text field when title selector changes
$("#title").on("change", function() {
    if ($('#title').val() == "other") {
        $('#other-title').show();
    } else $('#other-title').hide();
});

//***************//
//T-Shirt Section//
//***************//

//gives class to options to group them easier
function classAssign() {
    for (i = 0; i < $('.shirtType option').length; i++) {
        if ($('.shirtType option')[i].innerHTML.includes("JS Puns shirt only")){
            $('.shirtType option')[i].setAttribute("class", "group1");
        } else if ($('.shirtType option')[i].innerHTML.includes("Select Shirt")){
            //skip over the select shirt option
        } else $('.shirtType option')[i].setAttribute("class", "group2");
    }  
}
classAssign();

//hides the whole div for shirts
function hideAllShirts() {
    $('#colors-js-puns').hide();
}
//shows the whole div
function showAllShirts() {
    $('#colors-js-puns').show();
}

hideAllShirts();

//t-shirt selector function
document.getElementById("design").addEventListener("change", function() {
    if ($('#design').val() == "js puns"){
        showAllShirts();
        $('.group1').show();
        $('.group2').hide();
    } else if ($('#design').val() == "heart js"){
        showAllShirts();
        $('.group2').show();
        $('.group1').hide();
    } else hideAllShirts();
    
});

//****************//
//Checkbox Section//
//****************//

//function checks for checkbox items that have the same time and assigns them a class.
function classAssignActivities() {
    for (i = 0; i < $('.activities label').length; i++) {
        if ($('.activities label')[i].innerHTML.includes("9am-12pm")){
            $('.activities input')[i].setAttribute("class", "activityMorning");
        } else if ($('.activities label')[i].innerHTML.includes("1pm-4pm")){
            $('.activities input')[i].setAttribute("class", "activityEvening");
        } else if ($('.activities label')[i].innerHTML.includes("Main Conference")) {
            $('.activities input')[i].setAttribute("class", "activityMain");
        }
    }  
}
classAssignActivities();

//on change checks for specific class and blocks out conflicting classes and changes the total price on check or uncheck
$(".activities input").on('change', function() {
    if($(this).hasClass("activityMorning")) {
        if (this.checked){
            $('.activityMorning').attr("disabled", true);
            $('.activityMorning').parent().css('textDecoration', 'line-through');
            $(this).removeAttr("disabled");
            $(this).parent().css('textDecoration', 'none');
            activityPrice +=  100;
        } else {
            $('.activityMorning').removeAttr("disabled");
            $('.activityMorning').parent().css('textDecoration', 'none');
            activityPrice -= 100;
        }
    } else if($(this).hasClass("activityEvening")){
        if (this.checked){
            $('.activityEvening').attr("disabled", true);
            $('.activityEvening').parent().css('textDecoration', 'line-through');
            $(this).removeAttr("disabled");
            $(this).parent().css('textDecoration', 'none');
            activityPrice += 100;
        } else {
            $('.activityEvening').removeAttr("disabled");
            $('.activityEvening').parent().css('textDecoration', 'none');
            activityPrice -= 100;
        }
    } else if($(this).hasClass("activityMain")){ 
       if (this.checked) {
           activityPrice += 200;
       } else {
           activityPrice -= 200;
       } 
    };
    
    $('#totalCost').html("Total: $" + activityPrice);
});

//***************//
//Payment Section//
//***************//

//function to hide all the payment options
function hidePayments() {
    $('#payment').nextAll().hide();
}
//hides the payment options then shows the default credit card option
hidePayments();
$('#credit-card').show();

//on change function calls different payment info depending on payment selection
$('#payment').on('change', function(){
    if ($('#payment').val() == 'credit card'){
        hidePayments();
        $('#credit-card').show();
    } else if ($('#payment').val() == 'paypal'){
        hidePayments();
        $('#credit-card').next().show();
    } else if ($('#payment').val() == 'bitcoin'){
        hidePayments();
        $('#payment').siblings('div').last().show();
    } else hidePayments();
    
})

//***************//
//submit Section//
//***************//

$('form').submit(function () {
    //resets the labels back to normal
    $('.required').removeClass('required');
    //changes the text in the email label back to normal
    $('#mail').prev().text( "Email:" ).show();
    $('#cc-num').prev().text( "Card Number:" ).show();
    //assigns form items into an array
    var a1 = [$('#name'), $('#title'), $('#size'), $('#design'), $('#color'), $('#payment')];
    ////assigns cc detail items into an array
    var aCC = [$('#exp-month'),$('#exp-year')]
    //counter used to count how many form inputs are wrong or empty
    var specialCounter = 0;
    // Check if form input items contained in a1 array are empty
    for (i = 0; i < a1.length; i++){
        if (a1[i].val()  === '') {
        a1[i].prev().addClass('required');
        specialCounter++;
        }
    }
    //email check if html5 method fails
    var mailValue = $('#mail').val();
    if (emailCheck.test(mailValue) == false){
        $('#mail').prev().addClass('required');
            specialCounter++;
        $('#mail').prev().text( "Email: * Please enter a valid email *" ).show();
    }
    
    //error message for incomplete payment
    if ($('#payment').val() === 'credit card'){
        for (i = 0; i < aCC.length; i++){
            if (aCC[i].val()  === '') {
                aCC[i].prev().addClass('required');
                specialCounter++;
            }
        }
        zipCheck = $('#zip').val();
        if (!$.isNumeric(zipCheck)){
            $('#zip').prev().addClass('required');
            specialCounter++;
        }
        cvvCheck = $('#cvv').val();
        if (!$.isNumeric(cvvCheck)){
            $('#cvv').prev().addClass('required');
            specialCounter++;
        }
        //credit card number validation
        var number = $('#cc-num').val();
        var output = [];
        var sNumber = number.toString();
        var finalNum = 0;
        var numBuilder = 0;
        for (var i = 0; i < sNumber.length; i++) {
            output.push(+sNumber.charAt(i));
        }
        var lastNum = output.pop();
        output.reverse();
        for (i = 0; i < output.length; i += 2){
            output.splice(i,1,(output[i]*2));    
        }
        for (i = 0; i < output.length; i++){
            if (output[i] > 9){
                output.splice(i,1,(output[i]-9));
            }
        }
        for (i = 0; i < output.length; i++){
            numBuilder += output[i];
        }
        finalNum = (Math.ceil(numBuilder / 10)) * 10; 
        if ((finalNum - numBuilder) !== lastNum){
            $('#cc-num').prev().addClass('required');
            $('#cc-num').prev().text( "Not a Valid Card Number" ).show();
            specialCounter++;
        }
    }
    //error message for incomplete title selection
    if ($('#title').val() == "other") {
        if ($('#other-title').val() == '') {
            $('#title').prev().addClass('required');
            specialCounter++;
        }
    }
    //error message for incomplete workshop selection
    if($('#workshops input[type=checkbox]:checked').length == false){ 
        $("#totalCost").addClass('required');
        specialCounter++;
    };
    //error message if anything on the page is missing or incorrect
    //also fails the submit function
    if (specialCounter > 0){
        $( "button" ).text( "Missing Info" ).addClass('required').fadeTo( 1500 , 1, function() {
            $( "button" ).removeClass('required');
            $( "button" ).text( "Register" ).show();
        });
        return false;
    }
});