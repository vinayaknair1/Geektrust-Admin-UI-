import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Pagination,
    Box,
    Checkbox,
    TextField,
  } from "@mui/material";
  import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
  import EditIcon from "@mui/icons-material/Edit";
  import axios from "axios";
  import Edits from "./Edits";
  import { useState, useEffect } from "react";
  
  const AdminPage = () => {
    //data varriable for setting the page data.
    const [data, setData] = useState([]);

    //current viwewing page.
    const [currentPage, setcurrentPage] = useState(1);

    //loading is for setting the loader.
    const [loading, setLoading] = useState(true);

    //posts per page handling.
    const [entriesPerPage, setentriesPerPage] = useState(10);

    //for setting and deleting the current selected entries.
    const [currentEntries, setcurrentEntries] = useState([]);

    //selected is for selecting a particular entry.
    const [selected, setselected] = useState(false);

    //openedId for current opened post.
    const [openedId, setopenedId] = useState(null);

    //checkedId used for selecting an entry.
    const [checkedId, setCheckedId] = useState([]);

    //allSelect varriable used for selecting all entries.
    const [allSelect, setallSelect] = useState(false);

    // searchEntires for making a search.
    const [searchEntries, setsearchEntries] = useState("");

    // searchAll varriable for making a search in all pages.
    const [searchAll, setSearchAll] = useState([]);
    
    // lastPageIndex for going directly to the last entry.
    const lastPageIndex = currentPage * entriesPerPage;

    //firstPageIndex for going to first page.
    const firstPageIndex = lastPageIndex - entriesPerPage;
  
    console.log(checkedId);
  
    async function fetchData() {
      try {
        const res = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setData(res.data);
      } catch (error) {
        alert("something went wrong please try again");
        console.log(error);
      }
    }
    // for selecting or changing the page.
    function onPageChange(event, value) {
      setcurrentPage(value);
    }
    
    //fun selectCheck for selecting a check box of a particular post.
    function selectCheck(e) {
      const index = checkedId.indexOf(e.target.value);
      if (index === -1) {
        setCheckedId([...checkedId, e.target.value]);
      } else {
        setCheckedId(checkedId.filter((id) => id !== e.target.value));
      }
    }
  
    // for selecting all the entries on the page.
    function selectAll() {
      setallSelect(!allSelect);
      if (allSelect) {
        setCheckedId([]);
      } else {
        if (searchEntries.length < 1) {
          setCheckedId(currentEntries.map((el) => el.id));
        } else {
          setCheckedId(searchAll.map((el) => el.id));
        }
      }
    }
      // deleting an entry.
    function deletePost(id) {
      const updatedData = data.filter((item) => item.id !== id);
      setSearchAll(updatedData);
      setData(updatedData);
    }
  
    function deleteSelectedEntry() {
      const newData = data.filter((item) => !checkedId.includes(item.id));
      setData(newData);
      setSearchAll(newData);
      setallSelect(false);
    }
     
    //editing data.
    function editData(id) {
      setselected(true);
      setopenedId(id);
    }
  
    function searchItem(e) {
      setsearchEntries(e.target.value);
      if (e.target.value !== "") {
        const newPosts = data.filter((item) => {
          return Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
        setSearchAll(newPosts);
      } else {
        setSearchAll(data);
      }
    }
  
    useEffect(() => {
      fetchData();
      console.log(currentEntries);
    }, []);
  
    useEffect(() => {
      setcurrentEntries(data.slice(firstPageIndex, lastPageIndex));
      setLoading(false);
    }, [data, currentPage]);
  
    return (
      <>
        {loading ? (
          <>
            <Box
              sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1>...Loading</h1>
            </Box>
          </>
        ) : (
          <>
            <Box
              display="flex"
              sx={{
                height: "100vh",
                flexDirection: "column",
              }}
            >
              <TextField
                id="fullWidth"
                sx={{ width: "99%", alignSelf: "center" }}
                placeholder="Search by name, email or role"
                value={searchEntries}
                onChange={searchEntries}
              />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox checked={allSelect} onChange={selectAll} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="center">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(searchEntries.length < 1 ? currentEntries : searchAll).map(
                      (item) => {
                        return (
                          <TableRow
                            key={item.id}
                            sx={{
                              backgroundColor: checkedId.includes(item.id)
                                ? "#c3c3c3"
                                : "",
                            }}
                          >
                            <TableCell>
                              <Checkbox
                                value={item.id}
                                checked={checkedId.includes(item.id)}
                                onChange={selectCheck}
                              />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.role}</TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                onClick={() => editData(item.id)}
                              >
                                <EditIcon fontSize="small" />
                              </Button>
                              <Button
                                size="small"
                                onClick={() => deletePost(item.id)}
                              >
                                <DeleteOutlineOutlinedIcon
                                  fontSize="small"
                                  color="error"
                                />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" sx={{ padding: "10px", marginTop: "auto" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={deleteSelectedEntry}
                >
                  Delete Selected
                </Button>
                <Pagination
                  count={Math.ceil(data.length / 10)}
                  defaultPage={currentPage}
                  color="primary"
                  sx={{ margin: "auto" }}
                  showFirstButton={true}
                  showLastButton={true}
                  onChange={onPageChange}
                />
              </Box>
            </Box>
            {openedId && (
              <>
                <Edits
                  setselected={setselected}
                  selected={selected}
                  currentEntries={searchEntries.length < 1 ? currentEntries : searchAll}
                  openedId={openedId}
                  data={data}
                  setData={setData}
                  setSearchAll={setSearchAll}
                />
              </>
            )}
          </>
        )}
      </>
    );
  };
  
  export default AdminPage;