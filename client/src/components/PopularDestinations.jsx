import React from 'react';

export default function PopularDestinations({ onSelectRoute }) {
  const destinations = [
    {
      city: 'Livingstone',
      label: 'Mosi-oa-Tunya (Victoria Falls)',
      airport: 'LVI',
      price: '1,650',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
      badge: 'Tourist Favorite',
      description: 'Fly straight to Victoria Falls. Enjoy Zambezi sunset boat cruises, Devils Pool, and quick weekend holidays without the 7-hour road trip.'
    },
    {
      city: 'Ndola & Kitwe',
      label: 'Copperbelt Business Route',
      airport: 'NLA',
      price: '1,450',
      image: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=800&q=80',
      badge: '45-Min Fast Flight',
      description: 'Avoid the long drive on the Great North Road. Perfect for quick business meetings in Ndola, Kitwe, and Chingola mining towns.'
    },
    {
      city: 'Mfuwe',
      label: 'South Luangwa National Park',
      airport: 'MFU',
      price: '2,200',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
      badge: 'Safari & Game Viewing',
      description: 'Direct flight to Zambias top wildlife park. Watch leopards, lions, elephants, and hippos along the Luangwa river in under an hour.'
    },
    {
      city: 'Solwezi',
      label: 'North-Western Mining Belt',
      airport: 'SLI',
      price: '2,400',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      badge: 'Mining Express',
      description: 'Fly directly into Solwezi for Kansanshi and Lumwana mine business. Skip the exhausting 12-hour bus trip with a smooth 1-hour flight.'
    }
  ];

  return (
    <section className="my-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
        <div>
          <span className="text-xs font-black tracking-widest text-gold-500 uppercase">Top Places People Fly To in Zambia</span>
          <h2 className="text-3xl md:text-4xl font-black text-navy-900 mt-1">Trending Domestic Routes</h2>
        </div>
        <p className="text-sm text-slate-500 max-w-md mt-2 md:mt-0 font-medium">
          Whether you are going for business ku Copperbelt or visiting family and taking holiday ku Livingstone, book easily and travel without stress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((d) => (
          <div
            key={d.city}
            className="group relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={d.image}
                alt={d.city}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />
              <span className="absolute top-3 left-3 bg-navy-900/90 text-gold-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-gold-400/30">
                {d.badge}
              </span>
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                <div>
                  <h3 className="text-xl font-black leading-tight">{d.city}</h3>
                  <span className="text-xs text-slate-300 font-medium block">{d.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 block uppercase">One-way from</span>
                  <span className="text-lg font-black text-gold-400 font-mono">K {d.price}</span>
                </div>
              </div>
            </div>

            {/* Info and Booking */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{d.description}</p>
              <button
                onClick={() => onSelectRoute(d.airport)}
                className="w-full py-3 bg-slate-100 hover:bg-navy-900 hover:text-white text-navy-900 text-xs font-black rounded-xl transition duration-150 flex items-center justify-center gap-1.5"
              >
                Book Flights to {d.city} &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}