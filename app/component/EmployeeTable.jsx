import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  RadioGroup,
  Radio,
  Code,
  Image,
} from "@heroui/react";
import { useDisclosure } from "@heroui/react";

export default function EmployeeTable() {
  const [posts, setPosts] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeView, setSelectedEmployeeView] = useState(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { isOpen: isOpenview, onOpen: onOpenview, onClose: onCloseview, onOpenChange: onOpenChangeview } = useDisclosure();
  const [status, setStatus] = useState(""); // Default to "true" (Active)

  // Function to handle selection change
  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee); // Store the selected employee data
    onOpen(); // Open the modal
  };

  const handleOpenModalview = (employee) => {
    setSelectedEmployeeView(employee); // Store the selected employee data
    onOpenview(); // Open the modal
  };

  const handleUpdate = async () => {
    if (!selectedEmployee.employee_id || !selectedEmployee.department_id || !selectedEmployee.name || !selectedEmployee.email) {
      alert("Please fill all fields.");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(selectedEmployee.email)) {
      alert("Please enter a valid email address.");
      return; // Stop further execution if the email is invalid
    }
   

    try {
      const response = await axios.post(
        "https://playing-nine.vercel.app/api/employee/updateInfo",
        {
          employee_id: Number(selectedEmployee.employee_id),
          department_id: Number(selectedEmployee.department_id),
          name: selectedEmployee.name,
          email: selectedEmployee.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Employee updated successfully!");
        onClose();  // Close modal or reset form
      }
      const empstatus = status === "true" ? true : false;

     
      const respontActive = await axios.post("https://playing-nine.vercel.app/api/employee/changeStatus",
        {
          employee_id: Number(selectedEmployee.employee_id),
          status: empstatus
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      alert("Failed to update status.");
    }
  };

  const handleFetchEmployee = async () => {
    try {
      const response = await axios.get(
        `https://playing-nine.vercel.app/api/employee/getAllEmployeeInfo`
      );
      const fetchEmployee = response.data;
      setPosts(fetchEmployee); // Replace the existing data with the new data
    } catch (error) {
      console.error("Error fetching posts:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    handleFetchEmployee(); // Fetch data immediately on component mount
    const intervalId = setInterval(() => {
      handleFetchEmployee(); // Poll every 6 seconds
      console.log("Polling...");
    }, 6000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="pt-[2rem]">
      <h1>Employee Table</h1>
      <Table className="text-black" aria-label="Employee Table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Employee ID</TableColumn>
          <TableColumn>Department ID</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn></TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.name}</TableCell>
              <TableCell>{post.email}</TableCell>
              <TableCell>{post.employee_id}</TableCell>
              <TableCell>{post.department_id}</TableCell>
              <TableCell>{post.status === true ? "Active" : "Not Active"}</TableCell>
              <TableCell>
                <button onClick={() => handleOpenModal(post)}>
                  <Image
                    alt="HeroUI hero Image with delay"
                    height={20}
                    src="../../editing.png"
                    width={20}
                  />
                </button>
              </TableCell>
              <TableCell>
                <button onClick={() => handleOpenModalview(post)}>
                  <Image
                    alt="HeroUI hero Image with delay"
                    height={20}
                    src="../../view.png"
                    width={20}
                  />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedEmployee && (
        <Modal
          className="text-black"
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Edit Employee</ModalHeader>
            <ModalBody>
              {/* Display employee information in input fields */}
              <div className="flex flex-col gap-3">
                <div>
                  <Input label="Name" value={selectedEmployee.name}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
                    type="Name" />
                </div>
                <div>
                  <Input label="Email" value={selectedEmployee.email}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                    type="email" />
                </div>
                <div>
                  <Input
                    label="Department ID"
                    value={selectedEmployee.department_id}
                    onChange={(e) => setSelectedEmployee({
                      ...selectedEmployee,
                      department_id: e.target.value
                    })}
                    onInput={(e) => {
                      // Prevent non-numeric input
                      if (!/^\d+$/.test(e.target.value)) {
                        e.preventDefault();
                      }
                    }}
                    type="number"
                  />
                </div>
              </div>
              <div>
                <RadioGroup label="Select Status"
                  value={status} // Controlled component
                  onValueChange={handleStatusChange} >
                  <Radio value="true">Active</Radio>
                  <Radio value="false">Inactive</Radio>
                </RadioGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="success" onClick={handleUpdate}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {selectedEmployeeView && (
        <Modal
          className="text-black"
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpenview}
          onOpenChange={onOpenChangeview}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Employee Information</ModalHeader>
            <ModalBody>
              {/* Display employee information in input fields */}
              <Code size="md">Name: {selectedEmployeeView.name}</Code>
              <Code size="md">Email: {selectedEmployeeView.email}</Code>
              <Code size="md">Employee ID: {selectedEmployeeView.employee_id}</Code>
              <Code size="md">Department ID: {selectedEmployeeView.department_id}</Code>
              <Code size="md">
                Status: {selectedEmployeeView.status ? 'Active' : 'Inactive'}
              </Code>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onCloseview}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}