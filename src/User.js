import React, { useState, useEffect } from 'react';
import { app as firebase } from './firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, deleteDoc, addDoc, getDocs, setDoc } from 'firebase/firestore';
import "firebase/firestore";
import { BiSort } from "react-icons/bi";
import {
  Icon,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Box, Heading, Input, Button,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Select,
  ChakraProvider,
  Stack
} from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles

const MyDatePicker = ({setSelectedDate,selectedDate}) => {
  function setDate(date){
    setSelectedDate(date);
  }
  return (
    <div>
      <h2>Select a Date</h2>
      <Box>
      <DatePicker
        selected={selectedDate}
        onChange={date => setDate(date)}
        dateFormat="MM/dd/yyyy" // Customize date format as needed
      />
      </Box>
      {/* Display the selected date */}
      
    </div>
  );
};

const db = getFirestore(firebase);
const User = () => {
  const auth = getAuth(firebase)
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFUsers] = useState([]);
  const [filter,setfilter] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [status, setStatus] = useState("Active");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate,setSelectedDate] = useState('');
  const [usernameSort,setusernameSort] = useState(false);
  const [dateSort,setdateSort] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const fetchUsers = async () => {
    try {
      const usersCollection = await getDocs(collection(db, 'Users'))
      const usersData = usersCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      console.log("data ", usersData)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleAddUser = async () => {
    try {
      console.log("db: ", db);
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits (Month is zero-based, so we add 1)
      const year = date.getFullYear();
      const addDate = { day, month, year };
      const addUser = await addDoc(collection(db, 'Users'), { userName: newUsername, status: status, date: addDate });
      setNewUsername('');
      console.log(addUser.id);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  function sortByUserName(users) {
    return users.sort((a, b) => {
        return a.userName.localeCompare(b.userName);
    });
}
function sortByStatus(users) {
  return users.sort((a, b) => {
      return a.status.localeCompare(b.status);
  });
}
function sortByDate(users) {
  return users.sort((a, b) => {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(`${a.date.year}-${a.date.month}-${a.date.day}`);
      const dateB = new Date(`${b.date.year}-${b.date.month}-${b.date.day}`);
      return dateA - dateB;
  });
}
function filterActiveUsers(users) {
  return users.filter(user => user.status === 'Active');
}

// Filter inactive users
function filterInactiveUsers(users) {
  return users.filter(user => user.status === 'Inactive');
}
  function getDateSelected(){
    const usersWithSelectedDate = users.filter((user) => {
      const { year, month, day } = user.date;
      const date = selectedDate;
      console.log(date);
      // Convert selected date to string in the same format as user's date
      const selectedDateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      // Compare selected date with user's date
      const userDateString = `${year}-${month}-${day}`;
      return selectedDateString === userDateString;
    });
    // if(usersWithSelectedDate.length===0) window.alert("No Records found on this date",);
    setFUsers(usersWithSelectedDate);
  }
  async function handleDeleteUser (userId) {
    try {
      await deleteDoc(doc(db, 'Users', userId)); // Corrected line
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  //   const handleAddUser = (newUser) => {
  //     setUsers([...users, newUser]);
  //   };
  if (!currentUser) {
    return (
      <div>
        <h1>Please log in</h1>
        <button onClick={() => firebase.auth().signInAnonymously()}>Log In</button>
      </div>
    );
  }
  async function handleChangeStatus (userId) {
    try {
      const userToUpdate = users.find((user) => user.id === userId);
      const updatedStatus = userToUpdate.status === 'Active' ? 'InActive' : 'Active';
  
      // Construct the collection reference with `collection` and `doc` functions
      const userDocRef = doc(db, 'users', userId);
  
      // Update the document using the `setDoc` function
      await setDoc(userDocRef, { status: updatedStatus });
  
      // Update the local state (`users`) with the updated status
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...user, status: updatedStatus };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  const handleInputChange = (e) => {
    setNewUsername(e.target.value);
  };
  return (
    <ChakraProvider>
      <Box>
        <main>
          <Box id="userTableSection" >
            <Heading as="h1" size="lg">User Table</Heading>

            <Button m={4} mt={3} colorScheme='pink' onClick={()=>{onOpen()}}>Add User</Button>
            <Button p={8} m={4} mt={3} colorScheme='pink' ><MyDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate}/><Text ml={2}>{selectedDate&&`${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`}</Text></Button>
            <Button m={4} mt={3} onClick={()=>{
              getDateSelected();
              setfilter(true);
              setSelectedDate('');
            }} >Apply Date Filter</Button>
            <Button colorScheme='green' onClick={()=>{

            }}>Active Users</Button>
            <Button m={4} mt={3} colorScheme='pink' onClick={()=>{
              setfilter(false);
            }}>Clear Filter</Button>
              <Modal bg='#394363' isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay
                  bg='none'
                  backdropFilter='auto'
                  backdropInvert='80%'
                  backdropBlur='2px'
                />
                <ModalContent>
                  <ModalHeader>Add New User</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
              <Stack padding={'auto'} spacing={2}>
              <Input  mx='auto'my='2'
                type="text"
                placeholder="Enter username"
                width="80%"
                value={newUsername}
                onChange={handleInputChange}
              />
                <Select  my='2' mx='auto' w="80%"  value={status} onChange={(e) => { setStatus(e.target.value) }}>
                  <option value="">Status</option>
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                </Select>
                <Button mx='auto' my='2' w='80%' colorScheme='teal' onClick={()=>{
                  handleAddUser();
                  onClose();
                }}>Add User</Button>
              </Stack>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <TableContainer>            
                <Table p={4} border={"1px solid black"} borderRadius={1} maxW={{base:"90vw",md:"60vw"}}  mr={{base:"5vw",md:"20vw"}} ml={{base:"5vw",md:"20vw"}} variant="simple">
              {/* <TableCaption>Users Table</TableCaption> */}
              <Thead bg={'teal'} color={'wheat'}>
                <Tr>
                  {/* <Th></Th> */}
                  <Th ><Text color={'white'} >Username <Icon cursor={'pointer'} onClick={()=>{
                    sortByUserName(users);
                    setUsers(users);
                    console.log(users)
                    setFUsers(users);
                    setusernameSort(true);
                  }} as={BiSort} boxSize={4} /></Text></Th>
                  <Th  ><Text color={'white'}>Added Date <Icon cursor={'pointer'} as={BiSort}mt={1} onClick={()=>{
                    sortByDate(users);
                    setUsers(users);
                    console.log(users);
                    setFUsers(users);
                    setdateSort(true);
                  }} boxSize={4} /></Text></Th>
                  <Th  ><Text color={'white'}>Status</Text></Th>
                  <Th><Text color={'white'}>Actions </Text></Th>
                  {/* <Th>Actions</Th> */}
                </Tr>
              </Thead>
              <Tbody ml={10}>{filter?filteredUsers?(filteredUsers.map((user) => (
                <Tr key={user.id} >
                  <Td >{user.userName} </Td>
                  <Td>{user.status}</Td>
                  <Td>{user.date ? `${user.date.day}/${user.date.month}/${user.date.year}` : " "}   </Td>
                  <Td>
                    <Button mx={2} onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                    <Button onClick={() => handleChangeStatus(user.id)}>Change Status</Button>
                  </Td>
                </Tr>))):<></>:users.map((user) => (
                <Tr key={user.id} >
                  <Td >{user.userName}</Td>
                  <Td>{user.date ? `${user.date.day}/${user.date.month}/${user.date.year}` : " "}</Td>
                  <Td>{user.status}</Td>
                  <Td>
                    <Button mx={2} onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                    <Button onClick={() => handleChangeStatus(user.id)}>Change Status</Button>
                  </Td>
                </Tr>))}</Tbody>
            </Table>
            </TableContainer>

              {(!filter || dateSort || usernameSort)&&filteredUsers?<></>:<Heading color={'black'}>No User Added on Selected Date{console.log("No data")}</Heading>}
            
          </Box>
        </main>
      </Box>
    </ChakraProvider>
  );
};

export default User;
