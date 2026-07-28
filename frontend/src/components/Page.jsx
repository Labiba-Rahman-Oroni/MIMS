import Navbar from './Navbar';

export default function Page({ title, children }) {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {title && (
          <h2 className="text-3xl text-green-900 mb-6"
            style={{ fontFamily: 'DM Serif Display, serif' }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}