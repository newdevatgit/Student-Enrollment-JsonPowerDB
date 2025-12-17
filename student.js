// CONFIG 
const token = "90934841|-31949263465469351|90957931";
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";
const jpdbBaseUrl = "https://api.login2explore.com:5577";

let rec_no = 0;

// BUTTON HELPERS 
function enableBtn(id) {
  $("#" + id).prop("disabled", false);
}

function disableBtn(id) {
  $("#" + id).prop("disabled", true);
}

// RESET FORM 
function resetForm() {
  $("#studentForm")[0].reset();

  $("#rollNo").prop("disabled", false).focus();

  $("#fullName, #studentClass, #birthDate, #address, #enrollDate")
    .prop("disabled", true);

  disableBtn("saveBtn");
  disableBtn("updateBtn");
  disableBtn("resetBtn");
}

// CHECK ROLL NO
function checkRollNo() {
  let roll = $("#rollNo").val().trim();
  if (roll === "") return;

  let getReq = createGET_BY_KEYRequest(
    token,
    dbName,
    relName,
    JSON.stringify({ "Roll-No": roll })
  );

  jQuery.ajaxSetup({ async: false });
  let res = executeCommandAtGivenBaseUrl(getReq, jpdbBaseUrl, "/api/irl");
  jQuery.ajaxSetup({ async: true });

  if (res.status === 400) {
    // Record NOT found
    enableFields();
    enableBtn("saveBtn");
    enableBtn("resetBtn");
  } else {
    // Record FOUND
    let data = JSON.parse(res.data);
    rec_no = data.rec_no;

    fillForm(data.record);

    $("#rollNo").prop("disabled", true);
    enableBtn("updateBtn");
    enableBtn("resetBtn");
  }
}

// ENABLE INPUT FIELDS 
function enableFields() {
  $("#fullName, #studentClass, #birthDate, #address, #enrollDate")
    .prop("disabled", false);

  $("#fullName").focus();
}

// FILL FORM 
function fillForm(record) {
  enableFields();

  $("#fullName").val(record["Full-Name"]);
  $("#studentClass").val(record["Class"]);
  $("#birthDate").val(record["Birth-Date"]);
  $("#address").val(record["Address"]);
  $("#enrollDate").val(record["Enrollment-Date"]);
}

// VALIDATION
function validateForm() {
  if (
    $("#rollNo").val().trim() === "" ||
    $("#fullName").val().trim() === "" ||
    $("#studentClass").val().trim() === "" ||
    $("#birthDate").val().trim() === "" ||
    $("#address").val().trim() === "" ||
    $("#enrollDate").val().trim() === ""
  ) {
    alert("All fields are mandatory!");
    return false;
  }
  return true;
}

// SAVE
function saveStudent() {
  if (!validateForm()) return;

  let jsonData = {
    "Roll-No": $("#rollNo").val(),
    "Full-Name": $("#fullName").val(),
    "Class": $("#studentClass").val(),
    "Birth-Date": $("#birthDate").val(),
    "Address": $("#address").val(),
    "Enrollment-Date": $("#enrollDate").val()
  };

  let putReq = createPUTRequest(
    token,
    JSON.stringify(jsonData),
    dbName,
    relName
  );

  jQuery.ajaxSetup({ async: false });
  executeCommandAtGivenBaseUrl(putReq, jpdbBaseUrl, "/api/iml");
  jQuery.ajaxSetup({ async: true });

  alert("Record Saved Successfully.");
  resetForm();
}

// UPDATE
function updateStudent() {
  if (!validateForm()) return;

  let jsonData = {
    "Roll-No": $("#rollNo").val(),
    "Full-Name": $("#fullName").val(),
    "Class": $("#studentClass").val(),
    "Birth-Date": $("#birthDate").val(),
    "Address": $("#address").val(),
    "Enrollment-Date": $("#enrollDate").val()
  };

  let updateReq = createUPDATERecordRequest(
    token,
    JSON.stringify(jsonData),
    dbName,
    relName,
    rec_no
  );

  jQuery.ajaxSetup({ async: false });
  executeCommandAtGivenBaseUrl(updateReq, jpdbBaseUrl, "/api/iml");
  jQuery.ajaxSetup({ async: true });

  alert("Record Updated Successfully.");
  resetForm();
}
