import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { data: [], isLoading: false, error: null },
  reducers: {
    fetchStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    // Serverdan kelgan ro'yxatni saqlash
    fetchSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    // Tuzatildi: oldin xatolik holati yo'q edi va internet uzilsa spinner abadiy aylanardi
    fetchFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Yangi vazifa ro'yxat boshiga qo'shiladi
    addTodo: {
      reducer(state, action) {
        state.data.unshift(action.payload);
      },
      prepare(title) {
        return { payload: { id: Date.now(), title, completed: false } };
      },
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

export const { fetchStart, fetchSuccess, fetchFailure, addTodo, toggleComplete, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
