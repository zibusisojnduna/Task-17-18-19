const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');


admin.initializeApp({
  credential: admin.credential.applicationDefault(),  
  databaseURL: 'https://task-17-node-and-firebase.firebaseapp.com',
});


const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
app.use(cors()); 
app.use(bodyParser.json()); 


const upload = multer({ dest: 'uploads/' }); 


const PORT = process.env.PORT || 5000;


app.post('/api/employees', upload.single('photo'), async (req, res) => {
  try {
    const { name, surname, age, idNumber, role } = req.body;
    const employeePhoto = req.file;  

    
    const fileUploadResponse = await bucket.upload(employeePhoto.path, {
      destination: `employees/${idNumber}/${employeePhoto.originalname}`,
    });

    const photoUrl = `https://storage.googleapis.com/${bucket.name}/employees/${idNumber}/${employeePhoto.originalname}`;

    
    const employeeRef = db.collection('employees').doc(idNumber);
    await employeeRef.set({
      name,
      surname,
      age,
      idNumber,
      role,
      photoUrl,
    });

    res.status(201).send('Employee added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding employee');
  }
});


app.get('/api/employees/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employeeRef = db.collection('employees').doc(employeeId);
    const doc = await employeeRef.get();

    if (!doc.exists) {
      return res.status(404).send('Employee not found');
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching employee details');
  }
});


app.put('/api/employees/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { name, surname, age, role } = req.body;

    const employeeRef = db.collection('employees').doc(employeeId);
    await employeeRef.update({ name, surname, age, role });

    res.status(200).send('Employee updated successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating employee');
  }
});


app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employeeRef = db.collection('employees').doc(employeeId);

    
    const employeeData = (await employeeRef.get()).data();
    const photoFilePath = `employees/${employeeId}/${employeeData.photoUrl.split('/').pop()}`;
    const file = bucket.file(photoFilePath);
    await file.delete();

    
    await employeeRef.delete();

    res.status(200).send('Employee deleted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting employee');
  }
});


app.get('/api/employees/search/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employeeRef = db.collection('employees').doc(employeeId);
    const doc = await employeeRef.get();

    if (!doc.exists) {
      return res.status(404).send('Employee not found');
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching employee');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
