import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import { Image } from "@heroui/react";
import axios from 'axios';
export default function DepartmentTable() {
  const [posts, setPosts] = useState([]);
  
  const deleteDepartment = async (departmentId) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/department/deleteDepartment",
      { department_id: departmentId }, // Send department_id in body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Department deleted successfully:", response.data);
      alert("Department deleted successfully!");
    }
  } catch (error) {
    console.error("Error deleting department:", error.response?.data || error.message);
    alert("Failed to delete department!");
  }
};

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/department/getAllDepartment`
      );
      const fetchDEpt = response.data;
      console.log(fetchDEpt)
      setPosts((prevPosts) => {
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
  }, []);

  return (
    <div className='pt-[5rem]'>
          <h1>Department Table</h1>
     <Table className="text-black" aria-label="Employee Table">
        <TableHeader>
          <TableColumn>Department ID</TableColumn>
          <TableColumn>department_description</TableColumn>
           <TableColumn></TableColumn>
          
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.department_id}</TableCell>
              <TableCell>{post.department_description}</TableCell>
               <TableCell>
                <button onClick={() => deleteDepartment(post.department_id)}><Image
      alt="HeroUI hero Image with delay"
      height={20}
      src="../../bin.png"
      width={20}
    /></button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

