import { useDispatch, useSelector } from 'react-redux';
import { addNewTodo, deleteTodo, fetchStart, toggleComplete } from './todoSlice';
import { useEffect } from 'react';
import { Trash } from 'lucide-react';

function App() {
  const { data, isLoading, error } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch(fetchStart());
      const response = await fetch('https://jsonplaceholder.typicode.com/todos',);
      const todosData = await response.json();
      dispatch(addNewTodo(todosData));
    };

    fetchTodos();
  }, []);

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
  const completedCount = data?.filter((t) => t.completed).length ?? 0;
  const totalCount = data?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">
            Todo List
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

        {/* Todo items */}
        <div className="flex flex-col gap-3">
          {data?.map(({ title, id, completed }) => (
            <div
              key={id}
              onClick={() => dispatch(toggleComplete(id))}
              className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl shadow-sm border transition-all duration-200 ${completed
                  ? 'bg-white border-green-200 opacity-70'
                  : 'bg-white border-indigo-100 hover:shadow-md hover:-translate-y-0.5'
                }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center ${completed
                    ? 'border-green-500 bg-green-500'
                    : 'border-indigo-300'
                  }`}
              >
                <span>{id}</span>
                {completed && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              <p
                className={`flex-1 text-sm font-medium leading-snug ${completed ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
              >
                {title.slice(0, 60)}
                {title.length > 60 ? '...' : ''}
              </p>

              <span
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${completed
                    ? 'bg-green-100 text-green-600'
                    : 'bg-indigo-100 text-indigo-600'
                  }`}
              >
                {completed ? 'Bajarildi' : 'Kutilmoqda'}
              </span>

<button
  onClick={(e) => {
    e.stopPropagation();
    dispatch(deleteTodo(id));
  }}
  className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-red-400"
>
  <Trash size={14} />
</button>

              {/* <button
                onClick={() => dispatch(deleteTodo(id))}

                className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-red-400"
              >
                {' '}
                <Trash size={14} />{' '}
              </button> */}
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
