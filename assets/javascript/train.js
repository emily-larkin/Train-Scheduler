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
  var trainName = "";
  var destination = "";
  var time = 0;
  var frequency = "";


  // Capture Button Click
  $("#add-train-btn").on("click", function (event) {
      event.preventDefault();

      // Grabbed values from text boxes
      trainName = $("#train-name-input").val().trim();
      destination = $("#destination-input").val().trim();
      time = $("#first-train-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      // Code for the push
      database.ref().push({
          trainName: trainName,
          destination: destination,
          time: time,
          frequency: frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      // Clears all of the text-boxes
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#first-train-input").val("");
      $("#frequency-input").val("");
  });

  // Firebase watcher .on("child_added"
  database.ref().on("child_added", function (snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();

      console.log(sv);
      console.log(sv.trainName);
      console.log(sv.destination);
      console.log(sv.time);
      console.log(sv.frequency);

      // Create the new row
      var newRow = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(destination),
          $("<td>").text(frequency),
          $("<td>").text(nextTrain),
          $("<td>").text(tMinutesTillTrain)
      );
      // Append the new row to the table
      $("#train-table > tbody").append(newRow);

      // Handle the errors
  }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);

  });


  var tFrequency = 20;

  // Time is 3:30 AM
  var firstTime = "03:30";

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