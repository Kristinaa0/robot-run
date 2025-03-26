const firebaseConfig = {//אובייקט עם פרטי הפיירבייס
    apiKey: "AIzaSyAxFL12tVB4g_BQ66NE5BHjlGDpXayxfuA",
    authDomain: "robot-11ad4.firebaseapp.com",
    databaseURL: "https://robot-11ad4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "robot-11ad4",
    storageBucket: "robot-11ad4.firebasestorage.app",
    messagingSenderId: "809850505199",
    appId: "1:809850505199:web:a702f6cde883e61433181a"
  };
   
  // אתחול Firebase רק אם הוא לא מאותחל כבר
if (!firebase.apps.length) {//מוודא שהפייבייס לא מאותחל פעמיים
    firebase.initializeApp(firebaseConfig);//אם הוא לא אז הוא קורא לפונקצייה הזו
} else {
    firebase.app(); // אם כבר יש אתחול, השתמש בו
}
  // Initialize Firebase
    const auth = firebase.auth();//גישה לשירותי אימות משתמשים
    const db = firebase.database();//גישה לשירותי מסד נתונים בזמן אמת


    function moveRobot(direction) {//שולחת פקודה לתוך מסד הנתונים
        db.ref("robot/RX").set(direction);//כותבת את הכיוון לתוך הענף
        console.log("Moving: " + direction);//מראה את מצב רובוט בקונסול
    }

    db.ref("robot/RX").on("value", (snapshot) => {//מאזין לכל שינוי ומדפיס בקונסול
        console.log("Robot status:", snapshot.val());
    });

    function setMoveMode(mode) {
        console.log("הגדרת מצב: " + mode);
        db.ref("robot/RX").set(mode)
            .then(() => {
                console.log("מצב נשמר בפיירבייס: " + mode);
                toggleControlButtons(mode === 'manual');
            })
            .catch(error => console.error("שגיאה בעדכון המצב: ", error));
    }
    
    function toggleControlButtons(enabled) {
        document.querySelectorAll(".control-btn").forEach(button => {
            button.disabled = !enabled;
        });
    }
    // Function to check the distance and update the UI and database
function checkDistance(distance) {//מקבלת ערך
    let status;

    if (distance < 10) {//אם המרחק קטן מ10 סמ אז קרוב    
        status = "Close";
    } else {
        status = "Far";//אם לא אז רחוק
    }

    db.ref("robot/dis").set(status)//מעדכנת את הסטטוס במסד הנתונים
        .then(() => {
            console.log("Distance status updated successfully.");
        })
        .catch((error) => {
            console.error("Error updating distance status:", error);
        });

    // Update the UI
    document.getElementById("distanceStatus").innerText = "Object is: " + status;

    //שינוי צבע התיבה
    let statusBox = document.getElementById("distanceStatus");
    if (status === "Close") {
        statusBox.className = "alert alert-danger";  //אדום אם קרוב
    } else {
        statusBox.className = "alert alert-success"; //ירוק אם רחוק
    }
}

// Listen for changes from Firebase in real-time
db.ref("robot/TX/A").on("value", (snapshot) => {//מאזין לשינויים בנתיב בזמן אמת אם הערך משתנה אז הוא מתעדכן בהתאם
    const status = snapshot.val();
    if (status) {
        document.getElementById("distanceStatus").innerText = "Object is: " + status;
        let statusBox = document.getElementById("distanceStatus");
        if (status === "Close") {
            statusBox.className = "alert alert-danger";
        } else {
            statusBox.className = "alert alert-success";
        }
    }
});

// Function to update light intensity in Firebase
function setLightIntensity(value) {//מעדכן את עוצמת האור במסד הנתונים בענף
    db.ref("robot/RX").set(value);
    console.log("Light intensity set to:", value);
}

// Function to set light mode (manual/auto)
function setLightMode(mode) {//מעדכן את מצב התאורה
    db.ref("robot/LightMode").set(mode)
        .then(() => {
            console.log("Light mode changed to:", mode);
        });

    let intensitySelect = document.getElementById("lightLevel");
    if (mode === "manual") {//אם המצב ידני הוא מאפשר בחירה עצמית
        intensitySelect.removeAttribute("disabled");
    } else {//אם זה אוטומט אז זה חוסם את האפשרות
        intensitySelect.setAttribute("disabled", "true");
    }
}

// Listen for LDR contrast data from Firebase
db.ref("robot/TX/C").on("value", (snapshot) => {//מאזין לשינוי התאורה
    const contrast = snapshot.val();//בודק אם הערך קטן או גדול מ50 ומשנה את הצבע בהתאם(אדום אם חשוך או ירוק)
    document.getElementById("ldrContrast").innerText = "LDR Contrast: " + contrast;
    document.getElementById("ldrContrast").className = contrast < 50 ? "alert alert-danger" : "alert alert-success";
});

// Listen for light mode changes
db.ref("robot/TX/C").on("value", (snapshot) => {//מאזין לשינויי התאורה
    const mode = snapshot.val();
    let intensitySelect = document.getElementById("lightLevel");
    //מפעיל וחוסם בהתאם למצב
    if (mode === "manual") {
        intensitySelect.removeAttribute("disabled");
    } else {
        intensitySelect.setAttribute("disabled", "true");
    }
});
   

