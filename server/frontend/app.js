const API_URL = 'https://localhost:5000/api';
const MQTT_URL = 'https://localhost:5001';

var drinkIndex = 1;

// $(document).ready(function() {
//   // Show nutritional value table when hovering over drink image
//   $('.drink-image').hover(
//     function() {
//       var $this = $(this);
//       var alcohol = $this.data('alcohol');
//       var ingredients = $this.data('ingredients');
//       $this.next('.drink-info').find('.alcohol').text(alcohol);
//       $this.next('.drink-info').find('.ingredients').text(ingredients);
//       $this.next('.drink-info').stop(true, true).fadeIn();
//     },
//     function() {
//       $(this).next('.drink-info').stop(true, true).fadeOut();
//     }
//   );
// });

$(document).ready(function() {
  const title = $('#drink_title23');
  const price = $('#drink_price1');
  const alcohol = $('#alcohol5');
  const options = $('#options');
  console.log(drinkIndex);
  console.log('yep')
  $.ajax({
    url: `${API_URL}/mixers?ind=${drinkIndex}`,
    method: 'GET',
    success: function(data) {
      console.log(data);
      $('#drink_price1').val(data.cost);
      $('#drink_title23').val(data.name);
      title.text(data.name);
      price.text("$"+data.cost);
      alcohol.find('td:nth-child(2)').text(data.alcohol + '%');

      options.empty();

      for (var i = 0; i < data.mixers.length; i++) {
        var mixer = data.mixers[i];
        console.log(mixer);
        var id = i + 1;
        var div=$('<div>');
        var label = $(`<label for="${id}" style="margin-right: 10px">${mixer}</label>`);
        var input = $(`<input type="radio" id="${id}" name="options" value="${id}">`);
        var dive=$('</div>');
        options.append(div);
        options.append(label);
        options.append(input);
        options.append(dive);
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error:', errorThrown);
    }
  });
});


$(document).ready(function() {
  const title = $('#cocktail_name');
  const price = $('#cocktail_price');
  const alcohol = $('#alcohol23');
  const descrip = $('#Description');
  const ingre = $('#ingre');

  console.log('yep')
  $.ajax({
    url: `${API_URL}/drink?drinkIndex=${drinkIndex}`,
    method: 'GET',
    success: function(data) {
      console.log(data)
      title.text(data.name);
      title.val(data.name);
      price.val(data.cost);
      price.text("$"+data.cost);
      alcohol.find('td:nth-child(2)').text(data.alcohol + '%');
      descrip.text(data.descrip);
      ingredients.find('td:nth-child(2)').text(data.ingredients);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('Error:', errorThrown);
    }
  });
});


$('#order-button1').on('click', function(){

  console.log("new order has been requested by the customer");
  var cost = $('#drink_price1').val();
  var notes = $('#drink_title23').val();
  var receipt=$('#drink_title23').val();
  console.log("#drink_price1:", $('#drink_price1'));
  console.log(cost);
  console.log(notes);
  console.log(receipt);

  $.ajax({
    url: `${MQTT_URL}/make?d=${drinkIndex}`,
    type: 'PUT',
    success: function(data) {
      console.log("Drink is being created now");
      window.location.href="wel.html"
    },

    error: function(xhr, status, error) {
      console.log('Error:', error);
    }

  });
 
});

$('#order-button2').on('click', function(){
  
  console.log("new order has been requested by the customer");
  var amount = $('#cocktail_price').val();
  var notes = $('#cocktail_name').val();
  var receipt=$('#cocktail_name').val();

  console.log(amount);
  console.log(notes);
  console.log(receipt);
  console.log(1);

  $.ajax({
    url: `${MQTT_URL}/make?d=${drinkIndex}`,
    type: 'PUT',
    success: function(data) {
      console.log("Drink is being created now");
      window.location.href="wel.html"
    },

    error: function(xhr, status, error) {
      console.log('Error:', error);
    }

  });

  // $.ajax({
  //   url: `${API_URL}/createOrder`,
  //   type: 'POST',
  //   dataType: 'json',
  //   contentType: 'application/json',
  //   data: JSON.stringify({ amount: amount, notes: notes, receipt: receipt }),
  //   success: function(data) {
  //     console.log("Received data from server:");
  //     console.log(data);
  //     // On success, redirect the user to the Razorpay checkout page
  //     const options = {
  //       key: '<rzp_test_GSteFriVAs9upZ>',
  //       amount: data.amount,
  //       currency: data.currency,
  //       name: 'Your Company Name',
  //       description: 'Purchase Description',
  //       order_id: data.id,
  //       handler: function (response) {
  //         // Handle the response after payment completion
  //         console.log(response);
  //       },
  //       prefill: {
  //         name: 'John Doe',
  //         email: 'john.doe@example.com',
  //         contact: '+91 9999999999'
  //       },
  //       notes: {
  //         address: 'Razorpay Corporate Office'
  //       },
  //       theme: {
  //         color: '#F37254'
  //       }
  //     };
  //     console.log(options);
  //     const rzp = new Razorpay(options);
      
  //     // Open the checkout modal
  //     rzp.open();

  //   },
  //   error: function(error) {
  //     console.error(error);
  //   }
  // });

});


$('#left1').on('click', function(){
  if (drinkIndex<=1) {
    ////////         /////////
  }
  else{
    drinkIndex=drinkIndex-1;

    console.log("next drink");
    var drinkName = $('#cocktail_name');
    var drinkDes = $('#Description');
    var right = $('#right1');
    var alcohol = $('#alcohol23');
    var ingredients = $('#ingre');
    var price = $('#cocktail_price');
    var drink_img = $('#drink');
    var bg = $('#bg');


    console.log("extracting drink: " + drinkIndex)

    $.ajax({
      url: `${API_URL}/drink?drinkIndex=${drinkIndex}`,
      type: 'GET',
      success: function(data) {
        console.log('Retrieved data:', data);
        drinkName.val(data.name);
        price.val(data.cost);
        drinkName.text(data.name);
        drinkDes.text(data.descrip);
        ingredients.find('td:nth-child(2)').empty();
        alcohol.find('td:nth-child(2)').empty();
        alcohol.find('td:nth-child(2)').text(data.alcohol + '%');
        ingredients.find('td:nth-child(2)').text(data.ingredients);
        price.text("$"+data.cost);
        drink_img.attr("src", `object${drinkIndex}.jpg`);
        bg.css("background-image", `url(background${drinkIndex}.jpg)`);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });

  }
  
});


$('#right1').on('click', function(){
  if (drinkIndex>=3) {
    ///////////////////
  }
  else{
    drinkIndex=drinkIndex+1;

    console.log("next drink");
    var drinkName = $('#cocktail_name');
    var drinkDes = $('#Description');
    var right = $('#right1');
    var alcohol = $('#alcohol23');
    var ingredients = $('#ingre');
    var price = $('#cocktail_price');
    var drink_img = $('#drink');
    var bg = $('#bg');

    console.log("extracting drink: " + drinkIndex)

    $.ajax({
      url: `${API_URL}/drink?drinkIndex=${drinkIndex}`,
      type: 'GET',
      success: function(data) {
        console.log('Retrieved data:', data);
        drinkName.val(data.name);
        price.val(data.cost);
        drinkName.text(data.name);
        drinkDes.text(data.descrip);
        ingredients.find('td:nth-child(2)').empty();
        alcohol.find('td:nth-child(2)').empty();
        alcohol.find('td:nth-child(2)').text(data.alcohol + '%');
        ingredients.find('td:nth-child(2)').text(data.ingredients);
        price.text("$"+data.cost);
        drink_img.attr("src", `object${drinkIndex}.jpg`);
        bg.css("background-image", `url(background${drinkIndex}.jpg)`);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
  }
});


$('#left2').on('click', function(){
  if (drinkIndex<=1) {
    console.log("no");
  }
  else{
    drinkIndex = drinkIndex-1;

    console.log("next drink");
    var drinkName = $('#drink_title23');
    var alcohol = $('#alcohol5');
    var price = $('#drink_price1');
    var bg = $('#bg1');
    var left = $('#left2');
    var drink_img=$('#drinki')
    var options=$('#options');

    console.log("extracting drink: " + drinkIndex)

    $.ajax({
      url: `${API_URL}/mixers?ind=${drinkIndex}`,
      type: 'GET',
      success: function(data) {
        console.log('Retrieved data:', data);
        drinkName.text(data.name);
        alcohol.find('td:nth-child(2)').empty();
        alcohol.find('td:nth-child(2)').text(data.alcohol + '%');
        price.text("$"+data.cost);
        drink_img.attr("src", `object${drinkIndex}.jpg`);
        bg.css("background-image", `url(background${drinkIndex}.jpg)`);
        options.empty();

        
        for (var i = 0; i < data.mixers.length; i++) {
          var mixer = data.mixers[i];
          var id = i + 1;
          var div=$('<div>');
          var label = $(`<label for="${id}" style="margin-right: 10px">${mixer}</label>`);
          var input = $(`<input type="radio" id="${id}" name="options" value="${id}">`);
          var dive=$('</div>');
          options.append(div);
          options.append(label);
          options.append(input);
          options.append(dive);
        }
      
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
  }

});

$('#right2').on('click', function(){
  if (drinkIndex>=3) {
    console.log("no");
  }
  else{
    drinkIndex = drinkIndex+1;

    console.log("next drink");
    var drinkName = $('#drink_title23');
    var alcohol = $('#alcohol5');
    var price = $('#drink_price1');
  
    var bg = $('#bg1');
    var left = $('#left2');
    var drink_img=$('#drinki')
    var options=$('#options');

    console.log("extracting drink: " + drinkIndex)

    $.ajax({
      url: `${API_URL}/mixers?ind=${drinkIndex}`,
      type: 'GET',
      success: function(data) {
        console.log('Retrieved data:', data);
        drinkName.text(data.name);
        alcohol.find('td:nth-child(2)').empty();
        alcohol.find('td:nth-child(2)').text(data.alcohol + '%');
        price.text("$"+data.cost);
        drink_img.attr("src", `object${drinkIndex}.jpg`);
        bg.css("background-image", `url(background${drinkIndex}.jpg)`);
        alcohol.find('td:nth-child(2)').text(data.alcohol + '%');
        options.empty();

        for (var i = 0; i < data.mixers.length; i++) {
          var mixer = data.mixers[i];
          var id = i + 1;
          var div=$('<div>');
          var label = $(`<label for="${id}" style="margin-right: 10px">${mixer}</label>`);
          var input = $(`<input type="radio" id="${id}" name="options" value="${id}">`);
          var dive=$('</div>');
          options.append(div);
          options.append(label);
          options.append(input);
          options.append(dive);
        }
      
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
  }

});




