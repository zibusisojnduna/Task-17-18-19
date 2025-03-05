export const addEmployee = async (employee, photoFile) => {
    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("surname", employee.surname);
    formData.append("email", employee.email);
    formData.append("idNumber", employee.idNumber);
    formData.append("position", employee.position);

    
    if (photoFile) {
        formData.append("photo", photoFile);
    }

    try {
        const response = await fetch("http://localhost:3000/api/employees", {
            method: "POST",
            body: formData,
        });

        
        if (!response.ok) {
            throw new Error('Failed to add employee');
        }

        
        return await response.json();
    } catch (error) {
        console.error("Error adding employee:", error);
        throw error; 
    }
};
