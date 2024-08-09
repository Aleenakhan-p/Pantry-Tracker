'use client';
import { useState, useEffect } from 'react';
import { TextField, Typography, Box, Modal, Stack, Button } from '@mui/material';
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false); // Changed to false so the modal doesn't open initially
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // First function i.e: Updating items in the pantry
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // Second function i.e: Removing items from the pantry
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Third function i.e: Adding items in the pantry
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
//Search field
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setInventory(filteredInventory);
    } else {
      updateInventory();
    }
  };

  return (
    //Styling everything
    <Box
      flexDirection="column"
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Box width="800px" display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary"  bgcolor="pink" fontFamily="fantasy" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <Button variant="contained" color="primary"  bgcolor="pink" fontFamily="fantasy" onClick={handleOpen}>
        Add New Items
      </Button>
      <Box border="1px solid pink">
        <Box width="800px" height="100px" bgcolor="pink" fontFamily="fantasy" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="white" bgcolor="pink" fontFamily="fantasy" border="3px solid black" display="flex" padding="10px">Pantry Tracker</Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="pink" padding={5}>
              <Typography variant="h3"  bgcolor="pink" fontFamily="fantasy" color="black" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="black" bgcolor="pink" fontFamily="fantasy" textAlign="center">{quantity}</Typography>
              <Stack direction="row" spacing={2}>
                <Button  bgcolor="pink" fontFamily="fantasy" variant="contained" onClick={() => removeItem(name)}>Remove</Button>
                <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="pink"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography  bgcolor="pink" fontFamily="fantasy" variant="h6">Add an item here</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
