const express = require('express');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { symlink } = require('fs');
const firebase = require('firebase');
require('dotenv').config();

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(require(process.env.FIREBASE_CONFIG_PATH)),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

const db = firebaseAdmin.firestore();
const bucket = firebaseAdmin.storage().bucket();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });


app.post("/api/employees", upload.single("photo"), async(req, res) => {
    try {
        const { name, surname, email, idNumber, position} = req.body
        const photoFile = req.file

        const photoBlob = bucket.file(`employee_photos/${photoFile.originalname}`)
        await photoBlob.save(photoFile.buffer, {contentType:photoFile.mimetype})
        const photoUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/employee_photos/${photoFile.originalname}`

        const newEmployee = {
            name,
            surname,
            email,
            idNumber,
            position,
            photoUrl
        }

        const employeeRef = await db.collection("employees").add(newEmployee)
        res.status(201).json({ id: employeeRef.id, ...newEmployee})
        } catch (error) {
            res.status(500).send("Error adding employee")
        }
    })

    app.get("/api/employees", async (req, res) => {
        try {
            const snapshot = await db.collection("employees").get()
            const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
            res.status(200).json(employees)
        } catch (error) {
          console.error(error)
          res.status(500).send("Error fetching employees")
        }
    })

    app.put("/api/emloyees/:id", async (req, res) => {
        const { id } = req.params
        const { name, surname, email, idNumber, position } = req.body

        try {
            const employeeRef = db.collection("employees").doc(id)
            await employeeRef.update({ name, surname, email, idNumber, position})
            res.status(200).send("Employee updated")
        } catch (error) {
            console.error(error)
            res.status(500).send("Error updating employee")
        }
    })

app.delete("/api/eployees/:id", async (req, res) => {
    const { id } = req.params

    try {
        const employeeRef = db.collection("employees").doc(id)
        await employeeRef.delete()
        res.status(200).send("Employee deleted")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error deleting employee")
    }
})

app.get("/api/employees/:id", async (req, res) => {
    const { id } = req.params

    try {
        const snapshot = await db.collection("employees").where("idNumber", "==", id).get()
        if (snapshot.empty) {
            res.status(404).send("Employee not found")
        }
        const employee = snapshot.docs[0].data()
        res.status(200).json(employee)
    } catch (error) {
        console.error(error)
        res.status(500).send("Error fetching employee")
    }
})

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
})

app.post("/register", checkAuth, async (req, res) => {
    const { name, surname, email, idNumber, position} = req.body

    if (req.user.role !== "super-admin") {
        res.status(403).send("Unauthorized")
    }

    try {
        const userRecord = await firebase.auth().createUser({
            email,
            password,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        res.status(201).json({ uid: userRecord.uid, email, role})
    } catch (error) {
        console.error("Error creating user:", error)
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const userRecord = await firebase.auth().signInWithEmailAndPassword(email, password)

        const idToken = await userRecord.user.getIdToken()

        res.status(200).json({ idToken})
    } catch (error) {
        console.error("Error logging in:", error)
        res.status(500).send("Unauthorized")
    }
})

const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1]
    if (!token) {
        return res.status(403).send("No Ttoken provided")
    }

    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token)
        req.user = decodedToken

        const userDoc = await db.collection("users").doc(decodedToken.uid).get()
        req.user.role = userDoc.data().role

        next()
    } catch (error) {
        console.error("Authentication error:", error)
        res.status(403).send("Invalid token")
    }
}

const checkSuperAdmin = (req, res, next) => {
    if (req.user.role !== "super-admin" && req.user.role !== "general-admin") {
        return res.status(403).send("Unauthorized")
    }
    next()
}

app.post("/add-admin", checkAuth, checkSuperAdmin, async (req, res) => {
    const { email, password, role} = req.body

    try {
        const userRecord = await firebase.auth().createUser({
            email,
            password,
        })

        await db.collection("users").doc(userRecord.uid).set({
            email,
            role,
        })

        res.status(201).json({ uid: userRecord.uid, email, role})
        
    } catch (error) {
        console.error("Error adding admin:", error)
        res.status(500).send("Error adding admin")
    }
})

app.put("/employees/:id", checkAuth, checkSuperAdmin, async (req, res) => {
    const { id } = req.params
    const { name, surname, email, idNumber, position } = req.body

    if (req.user.role === "general-admin") {
        const employeeDoc = await db.collection
    }
})




app.listen(3000, () => {
    console.log('Server is running on port 3000');
})