import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { data: [], isLoading: false, error: null },
  reducers: {

    fetchStart(state, action) {
      state.isLoading = true;
    },
    addNewTodo(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },

    toggleComplete(state, action) {
      const todo = state.data.find((item) => item.id === action.payload);


      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    deleteTodo(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addNewTodo, fetchStart, toggleComplete, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;