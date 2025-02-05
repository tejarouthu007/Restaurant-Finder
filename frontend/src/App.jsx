import {Route, Routes, Link} from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import RestaurantDetail from "./pages/RestaurantDetail";

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/search" element={<Search />} />
        <Route path='/restaurants/:id' element={<RestaurantDetail/>}></Route>
      </Routes>
    </div>
  )
}

export default App
