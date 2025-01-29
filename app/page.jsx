"use client";
import React from 'react';
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

   const handleSubmit = async (e) => {
     e.preventDefault();
     setMessage(null);

     if (!departmentId || !departmentDescription) {
       setMessage({ type: "error", text: "Department ID and description are required." });
       return;
     }

     try {
      const response = await fetch("http://localhost:3000/api/department/createDepartment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department_id: parseInt(departmentId),
          department_description: departmentDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: "success", text: `Department created successfully: ${data.department_description}` });
        setDepartmentId("");
        setDepartmentDescription("");
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
              <Input label="Department ID" type="text" />
              <Input label="Department Description" type="text" />
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
              <Input label="Name" type="text" />
              <Input label="Email" type="email" />
              <div>
                <RadioGroup label="Select Department" className="text-black">
                  <Radio value="buenos-aires">Buenos Aires</Radio>
                  <Radio value="sydney">Sydney</Radio>
                  <Radio value="san-francisco">San Francisco</Radio>
                  <Radio value="london">London</Radio>
                  <Radio value="tokyo">Tokyo</Radio>
                </RadioGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeEmployeeModal}>
                Close
              </Button>
              <Button color="success" onPress={closeEmployeeModal}>
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






  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage(null);

  //   if (!departmentId || !departmentDescription) {
  //     setMessage({ type: "error", text: "Department ID and description are required." });
  //     return;
  //   }

  //   try {
  //     const response = await fetch("http://localhost:3000/api/department/createDepartment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         department_id: parseInt(departmentId),
  //         department_description: departmentDescription,
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setMessage({ type: "success", text: `Department created successfully: ${data.department_description}` });
  //       setDepartmentId("");
  //       setDepartmentDescription("");
  //     } else {
  //       const errorData = await response.json();
  //       setMessage({ type: "error", text: errorData.error || "Failed to create department." });
  //     }
  //   } catch (error) {
  //     setMessage({ type: "error", text: "An unexpected error occurred." });
  //   }
  // };