 export const addEmployee = async (emoloyee,photoFile) => {
    const formData = new FormData();
    formData.append("name", emoloyee.name);
    formData.append("surname", emoloyee.surname);
    formData.append("email", emoloyee.email);
    formData.append("idNumber", emoloyee.idNumber);
    formData.append("position", emoloyee.position);

    const response = await fetch("http://localhost:3000/api/employees", {
        method: "POST",
        body: formData,
    });

    return response.json();
 }

 
