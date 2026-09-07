function AddRoom() {
  return (
    <section className="min-h-screen bg-white px-6 py-10 text-black sm:px-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em]">Rooms</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Add room</h1>
        <p className="mt-4 text-gray-600">Create a new room listing for your property.</p>

        <form className="mt-10 grid gap-6 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Room name
            <input className="rounded-lg border border-black px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-black" placeholder="e.g. Suite 204" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Property
            <input className="rounded-lg border border-black px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-black" placeholder="Property name" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Price per night
            <input type="number" className="rounded-lg border border-black px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-black" placeholder="0" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Capacity
            <input type="number" className="rounded-lg border border-black px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-black" placeholder="2" />
          </label>
          <label className="grid gap-2 text-sm font-semibold sm:col-span-2">
            Description
            <textarea className="min-h-32 rounded-lg border border-black px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-black" placeholder="Describe the room" />
          </label>
          <button type="submit" className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 sm:col-span-2 sm:w-fit">
            Add room
          </button>
        </form>
      </div>
    </section>
  )
}

export default AddRoom
