import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import TodoList from './components/TodoList'
import Ping from './components/Ping'

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='todo_list/:id' element={<TodoList />} />
      <Route exact path='ping' element={<Ping />} />
    </Routes>
  );
}

export default App;
