export function CategoryWidgets({ name, data }) {
    return (
        <div className="bg-white text-zinc-800 rounded-xl">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-semibold mb-6">{name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.map((item, index) => (
                        <div key={index} className="bg-zinc-100 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold flex items-center mb-4">
                                <span className="material-icons mr-2">{item._id}</span>
                            </h3>
                            <p className="text-lg font-medium">Rs. {item.value.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
