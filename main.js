const firebaseConfig = {
    apiKey: "AIzaSyAxFL12tVB4g_BQ66NE5BHjlGDpXayxfuA",
    authDomain: "robot-11ad4.firebaseapp.com",
    databaseURL: "https://robot-11ad4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "robot-11ad4",
    storageBucket: "robot-11ad4.firebasestorage.app",
    messagingSenderId: "809850505199",
    appId: "1:809850505199:web:a702f6cde883e61433181a"
  };
  
  //מאתחל פיירבייס
  const app = firebase.initializeApp(firebaseConfig);
  
  
  function login() {
      document.getElementById("alert2").style.display = "none"; // מסתיר את הודעת השגיאה אם יש כזו
    
      // שליפת הנתונים מהשדות
      let emailInput = document.getElementById("LOGemail").value;//מקבל אימייל
      let passwordInput = document.getElementById("LOGpassword").value;//מקבל סיסמא
      const gender = getSelectedGender(); // שליפת המגדר שנבחר
    
      // בדיקת אם כל השדות מולאו
      if (!emailInput || !passwordInput || !gender) {
        document.getElementById("alert2").innerHTML = "All fields, including gender, are required!";
        document.getElementById("alert2").style.display = "block"; // הצגת הודעת שגיאה
        return;
      }
      if (passwordInput.length<6){//בדיקה אם הסיסמא קטנה משש תווים
        document.getElementById("alert2").innerHTML = "password need 6 digits!";
        document.getElementById("alert2").style.display = "block"; // הצגת הודעת שגיאה
        return;
      }
      // אם הכל תקין, מתבצע תהליך התחברות (דוגמה עם Firebase):
      firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User logged in:", user);
          window.location.href = "control.html"; // מעבר לדף אחר לאחר התחברות מוצלחת
        })
        .catch((error) => {//אם ההתחברות נכשלה פיירבייס מחזיר הודעת שגיאה
          const errorMessage = error.message;//היא נשמרת פה
          console.log("Login error:", errorMessage);
          document.getElementById("alert2").innerHTML = errorMessage;
          document.getElementById("alert2").style.display = "block"; // הצגת הודעת שגיאה
        });
    }
    
    // פונקציה לשליפת המגדר שנבחר
    function getSelectedGender() {
      const genderRadios = document.getElementsByName("gender");
      for (const radio of genderRadios) {
        if (radio.checked) {
          return radio.value; // מחזיר את הערך שנבחר
        }
      }
      return null; // אם לא נבחר מגדר
    }
    