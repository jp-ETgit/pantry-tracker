"use client";
import Image from "next/image"
import { useState, useEffect} from "react"
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material"
import { collection, query, getDocs, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [searchedItems, setSearchedItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const updateInventory = async () =>{
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async(item) =>{
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists())
    {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else
    {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async(item) =>{
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists)
    {
      const{quantity} = docSnap.data()
      if(quantity === 1)
        {
          await deleteDoc(docRef)
        }
        else{
          await setDoc(docRef, {quantity: quantity-1})
        }
    }

    await updateInventory()
  }

 const handleSearch = (term) => {
  const sResults = inventory.filter((item) =>
    item.name.toLowerCase().includes(term.toLowerCase())
  );
  setSearchedItems(sResults);
 };
  useEffect(()=>{
    handleSearch(searchTerm)
  }, [searchTerm, inventory])
  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width = "100vw"
      height = "100vh" 
      display = "flex" 
      flexDirection="column"
      justifyContent = "center" 
      alignItems = "center"
      gap = {2}
      bgcolor="#0D0809"
      >

      <Modal open = {open} onClose = {handleClose}>
        <Box 
          position = "absolute"
          top = "50%"
          left = "50%"
          width = {400}
          bgcolor = "#0D0809"
          border = "2px solid #4B6A42"
          boxShadow = {24}
          p = {4}
          display = "flex"
          flexDirection = "column"
          gap = {3}
          sx = {{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant = "h6" color="#F4EDEE" font="Verdana" fontWeight="bold">Add Item</Typography>
          <Stack width = "100%" maxHeight= "55px" direction = "row" spacing = {2}>
            <TextField
              label="Item Name"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color:"#F4EDEE",
                  font: "Verdana",
                  fontWeight:"bold",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4B6A42",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-outlined": {
                  color: "#F4EDEE",
                },
              }}
              fullWidth
              value={itemName}
              onChange={(e) =>{
                setItemName(e.target.value)
              }}
            />
            <Button
            variant="contained"
            sx={{
              color:"#F4EDEE",
              bgcolor:"#4B6A42",
            }}
            onClick={() =>{
              addItem(itemName)
              setItemName("")
              handleClose()
            }}
            >Add Here</Button>
          </Stack>
        </Box>
      </Modal>
      <Box 
        position="absolute"
        top="10%"
      >
        <Typography variant ="h1" fontFamily="Verdana" fontWeight="bold" fontSize="75px" color="#F4EDEE">Pantry Tracker</Typography>
      </Box>
        <Stack width = "800px" direction = "row" spacing = {2}>
          <TextField 
            label="Search from your list!"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color:"#F4EDEE",
                font: "Verdana",
                fontWeight:"bold",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4B6A42",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-outlined": {
                color: "#F4EDEE",
              },
            }}
            fullWidth
            value={searchTerm}
            onChange={(e) =>{
              setSearchTerm(e.target.value)
            }}
          />
          <Button
          variant = "contained"
          sx={{
            color:"#F4EDEE",
            bgcolor:"#4B6A42",
          }}
          onClick={() =>{
            handleSearch(searchTerm)
          }}
          >Search</Button>
        </Stack>
      <Box border="2px solid #4B6A42">
        <Box width="800px" height="100px" bgcolor="#4B6A42" display="flex" justifyContent = "center" alignItems = "center">
          <Typography variant="h2" fontFamily="Verdana" color="#F4EDEE">Inventory Items</Typography>
        </Box>
      
        <Stack width="800px" maxHeight="315px" spacing={2} overflow="auto">
          {searchedItems.map(({name, quantity}) => (
            <Box 
            key={name}
            width="100%"
            minHeight="120px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#80B092"
            padding={5}
            >
              <Typography variant="h3" color="#0D0809" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#0D0809" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction ="row" spacing={2}>
                <Button 
                  variant="contained"
                  sx={{
                    color:"#0D0809",
                    bgcolor:"#CCADB0",
                  }}
                  onClick={() => {
                    removeItem(name)
                  }}
                  >
                    Remove
                  </Button>
                  <Button 
                  variant="contained"
                  sx={{
                    color:"#0D0809",
                    bgcolor:"#CCADB0",
                  }}
                  onClick={() => {
                    addItem(name)
                  }}
                  >
                    Add
                  </Button>
                </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      <Button variant="contained"
      sx={{
        color:"#F4EDEE",
        bgcolor:"#4B6A42",
      }}
       onClick={() => {
        handleOpen()
      }}
      >Add New Item</Button>
    </Box>
  )
}