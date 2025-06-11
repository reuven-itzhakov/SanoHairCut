function Times({ date, availableTimes, onSelect }) {
  if (!date) return null;
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Available Times for {date.toLocaleDateString()}</h2>
      <div className="flex flex-wrap gap-2">
        {availableTimes && availableTimes.length > 0 ? (
          availableTimes.map((time) => (
            <button
              key={time}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => onSelect && onSelect(time)}
            >
              {time}
            </button>
          ))
        ) : (
          <span className="text-gray-500">No times available</span>
        )}
      </div>
    </div>
  );
}

export default Times;