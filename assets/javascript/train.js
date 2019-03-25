  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyDvbrT29p6K7l_bbqf2hvKFG3TSHrIWsYY",
      authDomain: "train-times-5fbcf.firebaseapp.com",
      databaseURL: "https://train-times-5fbcf.firebaseio.com",
      projectId: "train-times-5fbcf",
      storageBucket: "train-times-5fbcf.appspot.com",
      messagingSenderId: "328032423815"
  };

  firebase.initializeApp(config);
  var database = firebase.database();

  // Initial Values
  var name = "";
  var destination = "";
  var time = 0;
  var frequency = "";

  // Capture Button Click
  $("#add-train-btn").on("click", function (event) {
      event.preventDefault();

      // Grabbed values from text boxes
      var trainName1 = $("#train-name-input").val().trim();
      var trainDestination1 = $("#destination-input").val().trim();
      var timeStart1 = $("#first-train-input").val().trim();
      var trainFrequency1 = $("#frequency-input").val().trim();

      // Code for the push
      var newTrain = ({
          name: trainName1,
          destination: trainDestination1,
          time: timeStart1,
          frequency: trainFrequency1,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      database.ref().push(newTrain);

      // Clears all of the text-boxes
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#first-train-input").val("");
      $("#frequency-input").val("");
  });


  // Firebase watcher .on("child_added"
  database.ref().on("child_added", function (childSnapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = childSnapshot.val();
      
      var trainName2 = sv.name;
      var trainDestination2 = sv.destination;
      var timeStart2 = sv.time;
      var trainFrequency2 = sv.frequency;


      var tFrequency = trainFrequency2;

      var firstTime = timeStart2;
    
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);
    
      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
    
      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      console.log(tRemainder);
    
      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      // Create the new row
      var newRow = $("<tr>").append(
          $("<td>").text(trainName2),
          $("<td>").text(trainDestination2),
          $("<td>").text(trainFrequency2),
          $("<td>").text(nextTrain),
          $("<td>").text(tMinutesTillTrain)
      );
      // Append the new row to the table
      $("#train-table > tbody").append(newRow);

      // Handle the errors
  }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });