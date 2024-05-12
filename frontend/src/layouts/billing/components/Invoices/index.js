import React, { useState } from 'react';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Card from "@mui/material/Card";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import './style.css';
 
import MDBox from "components/MDBox";
 
async function saveDataToDatabase(fileName, fileId, fileData, fichier_id, nom_fichier) {
  // Logique de sauvegarde des données dans la base de données
}
 
function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importedFileName, setImportedFileName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [buildHash, setBuildHash] = useState('');
 
  const [isHashInputFocused, setIsHashInputFocused] = useState(false);
  const [isTypeInputFocused, setIsTypeInputFocused] = useState(false);
  const [typeInputLabelColor, setTypeInputLabelColor] = useState('gray');
  const [isTypeSelected, setIsTypeSelected] = useState(false);
 
  const [successPercentage, setSuccessPercentage] = useState('');
  const [failurePercentage, setFailurePercentage] = useState('');
  const [skippedPercentage, setSkippedPercentage] = useState('');
  const [pendingPercentage, setPendingPercentage] = useState('');
  const [showStatusReports, setShowStatusReports] = useState(false);
  
 
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImportedFileName(event.target.files[0].name);
  };
 
  const handleUpload = async () => {
    if (!selectedFile || !selectedOption || !buildHash) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
 
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const fileData = JSON.parse(event.target.result);
 
      try {
        const response = await axios.post(
          'http://localhost:3008/insert-data',
          {
            fileName: selectedFile.name,
            file: fileData,
            buildHash: buildHash,
            type: selectedOption
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
 
        const fileId = response.data.fileId;
 
        await saveDataToDatabase(selectedFile.name, fileId, fileData, fileId, selectedFile.name);
 
        const { successPercentage, failurePercentage, skippedPercentage, pendingPercentage } = response.data;
 
        setSuccessPercentage(formatPercentage(successPercentage));
        setFailurePercentage(formatPercentage(failurePercentage));
        setSkippedPercentage(formatPercentage(skippedPercentage));
        setPendingPercentage(formatPercentage(pendingPercentage));
 
        setShowStatusReports(true);
 
        alert('Fichier JSON chargé avec succès');
        console.log('Réponse du serveur :', response.data);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert(`Le fichier ${selectedFile.name} existe déjà. Veuillez choisir un autre nom de fichier.`);
        } else {
          alert('Erreur lors du chargement du fichier JSON');
          console.error('Erreur lors du chargement du fichier JSON :', error);
        }
      }
    };
    fileReader.readAsText(selectedFile);
  };
 
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setIsTypeSelected(true);
  };
 
  const handleTypeInputFocus = () => {
    setIsTypeInputFocused(true);
    setTypeInputLabelColor('gray');
  };
 
  const handleTypeInputBlur = () => {
    setIsTypeInputFocused(false);
    setTypeInputLabelColor('gray');
  };
 
  const handleHashInputFocus = () => {
    setIsHashInputFocused(true);
  };
 
  const handleHashInputBlur = () => {
    setIsHashInputFocused(false);
  };
 
  const formatPercentage = (percentage) => {
    if (percentage !== '') {
      return parseFloat(percentage).toFixed(1) + '%';
    }
    return '';
  };
 
  const handleAlertConfirmation = () => {
    setShowStatusReports(false);
  };
 
  return (
  
    <Card className="custom-card" style={{ borderColor: 'black', borderWidth: '1px' }} >
      <MDBox pt={2} px={2} display="flex" justifyContent="flex-start" alignItems="center">
        <Typography variant="h6" fontWeight="medium" display="flex" alignItems="center">
          <CloudUploadIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
          Import File
        </Typography>
      </MDBox>
 
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <form>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel
                  id="demo-simple-select-label"
                  style={{
                    color: 'gray',
                    position: 'top',
                    top: -20,
                    left: 0,
                    background: 'white',
                    padding: '0 5px',
                  }}
                >
                  Type*
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedOption}
                  margin="normal"
                  variant="outlined"
                  label="Type"
                  onChange={handleOptionChange}
                  onFocus={handleTypeInputFocus}
                  onBlur={handleTypeInputBlur}
                  className={isTypeInputFocused ? 'focused' : ''}
                  required
                  style={{
                    top:"10%",
                  }}
                  InputProps={{
                    style: { color: 'gray' }
                  }}
                >
                  <MenuItem value={'DHVD'}>DHVD</MenuItem>
                  <MenuItem value={'DHVM'}>DHVM</MenuItem>
                  <MenuItem value={'DHV'}>DHV</MenuItem>
                </Select>
              </FormControl>
 
              <TextField
                id="build-hash"
                label="Build_Hash"
                variant="outlined"
                margin="normal"
                onChange={(event) => setBuildHash(event.target.value)}
                onFocus={handleHashInputFocus}
                onBlur={handleHashInputBlur}
                className={isHashInputFocused ? 'focused' : ''}
                required
                InputLabelProps={{
                  shrink: true,
                  style: { color: isHashInputFocused ? 'gray' : 'gray' }
                }}
                InputProps={{
                  style: { color: 'gray' }
                }}
              />
            </Box>
            <br />
 
            <Box mt={2} display="flex" alignItems="center">
              <label htmlFor="upload-file" style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <Button variant="contained" component="span" size="medium" style={{ backgroundColor: '#0ED8B8', color: 'white' }}>
                  Choose a file
                </Button>
                <input type="file" style={{ display: 'none' }} id="upload-file" onChange={handleFileChange} required />
              </label>
 
              <Button variant="contained" onClick={handleUpload} size="medium" style={{ backgroundColor: '#0ED8B8', color: 'white' }}>
                Load file
              </Button>
              {importedFileName &&
                <Box ml={1}>
                  <Typography variant="body1" style={{ color: 'gray',fontSize:'80%',fontFamily:'Arial' }}>
                  The Imported file is :{importedFileName}
                  </Typography>
                </Box>
              }
            </Box>
            {showStatusReports && (
    <Box mt={1} display="flex" justifyContent="center" alignItems="center">
        <div style={{ marginLeft: '-60%', marginTop: "1.5%" }}>
            <b><h7 style={{ color: 'rgb(99, 98, 95)', fontFamily: 'italic' }}>The Status Results of The Imported Report</h7></b>
            <table>
                <tbody>
                    <tr>
                        <td style={{ color: 'gray', fontFamily: 'italic' }}>Passed:</td>
                        <td><span style={{ color: 'green' }}>{successPercentage}</span></td>
                    </tr>
                    <tr>
                        <td style={{ color: 'gray', fontFamily: 'italic' }}>Failed:</td>
                        <td><span style={{ color: 'red' }}>{failurePercentage}</span></td>
                    </tr>
                    <tr>
                        <td style={{ color: 'gray', fontFamily: 'italic' }}>Skipped:</td>
                        <td><span style={{ color: 'blue' }}>{skippedPercentage}</span></td>
                    </tr>
                    <tr>
                        <td style={{ color: 'gray', fontFamily: 'italic' }}>Pending:</td>
                        <td><span style={{ color: 'rgb(255, 209, 25)' }}>{pendingPercentage}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Box>
)}
 
 
          </form>
        </MDBox>
      </MDBox>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
      </Box>
    </Card>
  );
}
 
export default FileUploader;