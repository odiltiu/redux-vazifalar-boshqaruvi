import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, fetchFailure, fetchStart, fetchSuccess, toggleComplete } from './todoSlice';
import { useCallback, useEffect, useState } from 'react';
import { Trash, Plus } from 'lucide-react';

function App() {
  const { data, isLoading, error } = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState('');

  const fetchTodos = useCallback(async () => {
    dispatch(fetchStart());
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
      const todosData = await response.json();
      dispatch(fetchSuccess(todosData));
    } catch (err) {
      dispatch(fetchFailure(err.message || "Ma'lumotni yuklab bo'lmadi"));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    dispatch(addTodo(title));
    setNewTitle('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-600 font-medium text-lg">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div role="alert" className="max-w-sm text-center bg-white rounded-xl border border-red-200 p-6 shadow-sm">
          <p className="text-red-700 font-medium">Vazifalarni yuklab bo'lmadi.</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button
            type="button"
            onClick={fetchTodos}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  const completedCount = data?.filter((t) => t.completed).length ?? 0;
  const totalCount = data?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">
            Vazifalar ro'yxati
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {completedCount} / {totalCount} bajarilgan
          </p>
          <div className="mt-3 h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{
                width: totalCount
                  ? `${(completedCount / totalCount) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>

        {/* Yangi vazifa qo'shish */}
        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <label htmlFor="new-todo" className="sr-only">Yangi vazifa</label>
          <input
            id="new-todo"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Yangi vazifa yozing..."
            className="flex-1 min-w-0 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus size={16} aria-hidden="true" />
            Qo'shish
          </button>
        </form>

        {/* Vazifalar */}
        <div className="flex flex-col gap-3">
          {data?.map(({ title, id, completed }) => (
            <div
              key={id}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-sm border transition-all duration-200 ${completed
                  ? 'bg-white border-green-200 opacity-70'
                  : 'bg-white border-indigo-100 hover:shadow-md'
                }`}
            >
              {/* Tuzatildi: oldin butun qator bosiladigan div edi (klaviatura bilan ishlamasdi)
                  va kichik doira ichiga vazifa ID raqami yozilib, sig'masdi */}
              <button
                type="button"
                onClick={() => dispatch(toggleComplete(id))}
                aria-pressed={completed}
                className="flex flex-1 min-w-0 items-center gap-3 text-left"
              >
                <span
                  aria-hidden="true"
                  className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center ${completed
                      ? 'border-green-500 bg-green-500'
                      : 'border-indigo-300'
                    }`}
                >
                  {completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>

                <span
                  className={`flex-1 min-w-0 text-sm font-medium leading-snug ${completed ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                >
                  {title.length > 60 ? `${title.slice(0, 60)}...` : title}
                </span>
              </button>

              <span
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-indigo-100 text-indigo-600'
                  }`}
              >
                {completed ? 'Bajarildi' : 'Kutilmoqda'}
              </span>

              <button
                type="button"
                onClick={() => dispatch(deleteTodo(id))}
                aria-label={`"${title}" vazifasini o'chirish`}
                className="flex-shrink-0 p-2 rounded-full text-red-600 hover:bg-red-50"
              >
                <Trash size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
