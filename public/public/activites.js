async function buildActivitysTable(activitiesTable, activitiesTableHeader, token, message) {
  try {
    const response = await fetch("/api/v1/activities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [activitiesTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        activitiesTable.replaceChildren(...children); // clear this for safety
        return 0;
      } else {
        for (let i = 0; i < data.activities.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.activities[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.activities[i]._id}>delete</button></td>`;
          let rowHTML = `<td>${data.activities[i].activityName}</td><td>${data.activities[i].liftType}</td><td>${data.activities[i].weight}</td><td>${data.activities[i].reps}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        activitiesTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const logonRegister = document.getElementById("logon-register");
  const logon = document.getElementById("logon");
  const register = document.getElementById("register");
  const logonDiv = document.getElementById("logon-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const registerDiv = document.getElementById("register-div");
  const name = document.getElementById("name");
  const email1 = document.getElementById("email1");
  const password1 = document.getElementById("password1");
  const password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");
  const activities = document.getElementById("activities");
  const activitiesTable = document.getElementById("activities-table");
  const activitiesTableHeader = document.getElementById("activities-table-header");
  const addActivity = document.getElementById("add-activity");
  const editActivity = document.getElementById("edit-activity");
  const deleteActivity = document.getElementById("delete-activity")
  const activityName = document.getElementById("activity-name")
  const reps = document.getElementById("reps");
  const weight = document.getElementById("weight")
  const liftType = document.getElementById("liftType");
  const addingActivity = document.getElementById("adding-activity");
  const activitiesMessage = document.getElementById("activities-message");
  const editCancel = document.getElementById("edit-cancel");

  // section 2 

  let showing = logonRegister;
  let token = null;
  document.addEventListener("startDisplay", async () => {
    showing = logonRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildActivitysTable(
        activitiesTable,
        activitiesTableHeader,
        token,
        message
      );
      if (count > 0) {
        activitiesMessage.textContent = "";
        activitiesTable.style.display = "block";
      } else {
        activitiesMessage.textContent = "There are no activities to display for this user.";
        activitiesTable.style.display = "none";
      }
      activities.style.display = "block";
      showing = activities;
    } else {
      logonRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      activitiesTable.replaceChildren(activitiesTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
    } else if (e.target === logon) {
      showing.style.display = "none";
      logonDiv.style.display = "block";
      showing = logonDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      }
    } // section 4
    else if (e.target === addActivity) {
      showing.style.display = "none";
      editActivity.style.display = "block";
      showing = editActivity;
      delete editActivity.dataset.id;
      activityName.value = "";
      reps.value = "0";
      liftType.value = "";
      addingActivity.textContent = "add";
    } else if (e.target === editCancel) {
      showing.style.display = "none";
      activityName.value = "";
      reps.value = "";
      liftType.value = "pending";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingActivity) {

      if (!editActivity.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              activityName: activityName.value,
              reps: reps.value,
              liftType: liftType.value,
              weight: weight.value
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = "The activity entry was created.";
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            activityName.value = "";
            reps.value = "";
            liftType.value = "";
            weight.value = "";

          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const activityID = editActivity.dataset.id;
          const response = await fetch(`/api/v1/activities/${activityID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              activityName: activityName.value,
              reps: reps.value,
              liftType: liftType.value,
              weight: weight.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "The entry was updated.";
            showing.style.display = "none";
            activityName.value = "";
            reps.value = "";
            weight.value = "";
            liftType.value = "";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {

          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5


    else if (e.target.classList.contains("editButton")) {
      editActivity.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/activities/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data)
        if (response.status === 200) {
          activityName.value = data.activity.activityName; 
          reps.value = data.activity.reps; 
          weight.value = data.activity.weight  
          liftType.value = data.activity.liftType; 
          showing.style.display = "none";
          showing = editActivity;
          showing.style.display = "block";
          addingActivity.textContent = "update";
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "An error has occurred";
      }
      suspendInput = false;
    }
    //section 6
    else if (e.target.classList.contains("deleteButton")) {
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/activities/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          message.textContent = "The activity was deleted.";
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
          activityName.value = ""; 
          reps.value = ""; 
          weight.value = "";  
          liftType.value = ""; 
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The activity was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
})
  });
