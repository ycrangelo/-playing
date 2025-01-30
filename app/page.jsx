"use client";
import React from 'react';
import { useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import EmployeeTable from './component/EmployeeTable';
import DepartmentTable from './component/DepartmentTable';
import axios from 'axios';

export default function App() {
   
  // State for Add Employee Modal
  const { isOpen: isEmployeeModalOpen, onOpen: openEmployeeModal, onClose: closeEmployeeModal } = useDisclosure();
  
  // State for Add Department Modal
  const { isOpen: isDepartmentModalOpen, onOpen: openDepartmentModal, onClose: closeDepartmentModal } = useDisclosure();

  // State for Add CSV file Modal
  const { isOpen: isCSVModalOpen, onOpen: openCSVModal, onClose: closeCSVModal } = useDisclosure();

  // State for Department Form
  const [departmentId, setDepartmentId] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [department, setDepartment] = useState([])
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [EmployeeName, setName] = useState("")
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file selected
    setSelectedFile(file);
  };
  
  const handlenameChange = (event) => {
    setName(event.target.value);  // Store the value of the input in state
  };

  // To access the value, just refer to `email`
  console.log("Current email value:", EmployeeName); // This logs the email value

  const handleEmailChange = (event) => {
    setEmail(event.target.value);  // Store the value of the input in state
  };

  // To access the value, just refer to `email`
  console.log("Current email value:", email); // This logs the email value

  const handleDeptChange = (event) => {
  const selectedId = event.target.value;  // dept.id will be the value
  setSelectedDeptId(selectedId);
  };
  useEffect(() => {
  if (selectedDeptId) {
    console.log("Selected Department ID:", selectedDeptId);
  }
}, [selectedDeptId]);


  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/department/getAllDepartment`
      );
      const fetchDEpt = response.data;
      console.log(fetchDEpt)
      setDepartment((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post.id));
        const newUniquePosts = fetchDEpt.filter((post) => !existingIds.has(post.id));
        return [...prevPosts, ...newUniquePosts];
      });
    } catch (error) {
      console.error("Error fetching posts:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
       const intervalId = setInterval(() => {
             fetchPosts();
             console.log(" polling")
         }, 10000); // Poll every 10 second
  }, []);

   const handleAddEmployee = async (e) => {
  if (e && e.preventDefault) e.preventDefault(); // Ensure e is valid before calling preventDefault()

  // Generate a random 13-digit number
  const randomDepartmentId = Math.floor(1000000000000 + Math.random() * 9000000000000);

     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!emailRegex.test(email)) {
  alert("Please enter a valid email address.");
  return; // Stop further execution if the email is invalid
}

  try {
    const response = await axios.post("http://localhost:3000/api/employee/addEmployee", {
      employee_id: randomDepartmentId,
      department_id: Number(selectedDeptId),
      name: EmployeeName,
      email: email,
    });
    
    if (response.data) {
      closeEmployeeModal()
    }

    console.log("Successful employee add", response.data);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

  const handleSubmit = async (e) => {
  if (e && e.preventDefault) e.preventDefault(); // Ensure e is valid before calling preventDefault()
  setMessage(null);

  // Generate a random 13-digit number
  const randomDepartmentId = Math.floor(1000000000000 + Math.random() * 9000000000000);

  if (!departmentDescription) {
    setMessage({ type: "error", text: "Department description is required." });
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/department/createDepartment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        department_id: randomDepartmentId,
        department_description: departmentDescription,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage({ type: "success", text: `Department created successfully: ${data.department_description}` });
      setDepartmentDescription(""); // Clear input field
      closeDepartmentModal()
    } else {
      const errorData = await response.json();
      setMessage({ type: "error", text: errorData.error || "Failed to create department." });
    }
  } catch (error) {
    setMessage({ type: "error", text: "An unexpected error occurred." });
  }
};

  return (
   <div className="h-screen ">
  <div className="flex flex-col px-6 gap-4">
        <EmployeeTable />
        <DepartmentTable/>

    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-auto">
        {/* Button to open Add Employee using CSV File */}
        <Button color="default" onPress={openCSVModal}>Add Employee using CSV file</Button>

        {/* Add CSV File Modal */}
        <Modal
          isOpen={isCSVModalOpen} 
          onClose={closeCSVModal} 
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-black">Add Department</ModalHeader>
            <ModalBody className="text-black">
                  <Input type="file" />
                   {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeCSVModal}>
                Close
              </Button>
              <Button color="success" onPress={closeCSVModal}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <div className="w-full sm:w-auto">
        {/* Button to open Add Employee Modal */}
        <Button color="primary" onPress={openEmployeeModal}>Add Employee</Button>

        {/* Add Employee Modal */}
        <Modal
          isOpen={isEmployeeModalOpen} 
          onClose={closeEmployeeModal} 
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-black">Add Employee</ModalHeader>
            <ModalBody className="text-black">
                  <Input label="Name"
                    type="text"
                   value={EmployeeName} 
        onChange={handlenameChange} 
                  />
              <Input 
        label="Email" 
        type="email" 
        value={email} 
        onChange={handleEmailChange} 
      />
              <div>
                     <RadioGroup label="Select Department" className="text-black" onChange={handleDeptChange}>
    {department.map((dept) => (
      <Radio key={dept.id} value={dept.department_id}>
        {dept.department_description}
      </Radio>
    ))}
  </RadioGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeEmployeeModal}>
                Close
              </Button>
              <Button color="success" onClick={handleAddEmployee}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      <div className="w-full sm:w-auto">
        {/* Button to open Add Department Modal */}
        <Button color="secondary" onPress={openDepartmentModal}>Add Department</Button>

        {/* Add Department Modal */}
        <Modal
          isOpen={isDepartmentModalOpen} 
          onClose={closeDepartmentModal} 
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-black">Add Department</ModalHeader>
            <ModalBody className="text-black">
              
              <Input 
                label="Department Description" 
                type="text" 
                value={departmentDescription} 
                onChange={(e) => setDepartmentDescription(e.target.value)} 
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeDepartmentModal}>
                Close
              </Button>
              <Button color="success" onPress={handleSubmit}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  </div>
</div>

  );
}